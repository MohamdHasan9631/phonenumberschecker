<?php
/**
 * Phone Number Checker API
 * Main API endpoint for phone number validation
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class PhoneCheckerAPI {
    private $db;
    private $python_script;
    
    public function __construct() {
        $this->db = DatabaseConfig::getInstance()->getConnection();
        $this->python_script = __DIR__ . '/../scripts/phone_validator.py';
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $endpoint = $_GET['endpoint'] ?? '';
        
        try {
            switch ($endpoint) {
                case 'check':
                    return $this->checkPhoneNumber();
                case 'bulk_check':
                    return $this->bulkCheckPhoneNumbers();
                case 'register':
                    return $this->registerUser();
                case 'login':
                    return $this->loginUser();
                case 'activate':
                    return $this->activateUser();
                case 'stats':
                    return $this->getUserStats();
                case 'notifications':
                    return $this->getNotifications();
                default:
                    return $this->errorResponse('Invalid endpoint', 404);
            }
        } catch (Exception $e) {
            return $this->errorResponse('Server error: ' . $e->getMessage(), 500);
        }
    }
    
    public function checkPhoneNumber() {
        $data = $this->getRequestData();
        $phone_number = $data['phone_number'] ?? '';
        $user_id = $data['user_id'] ?? null;
        
        if (empty($phone_number)) {
            return $this->errorResponse('Phone number is required');
        }
        
        // Check rate limits
        if (!$this->checkRateLimit($user_id)) {
            return $this->errorResponse('Rate limit exceeded');
        }
        
        // Validate phone number using Python script
        $result = $this->validateWithPython($phone_number);
        
        if ($result) {
            // Save to database
            $this->savePhoneCheck($user_id, $phone_number, $result);
            
            // Update credits/limits
            $this->updateCredits($user_id);
            
            return $this->successResponse($result);
        }
        
        return $this->errorResponse('Failed to validate phone number');
    }
    
    public function bulkCheckPhoneNumbers() {
        $data = $this->getRequestData();
        $phone_numbers = $data['phone_numbers'] ?? [];
        $user_id = $data['user_id'] ?? null;
        
        if (empty($phone_numbers) || !is_array($phone_numbers)) {
            return $this->errorResponse('Phone numbers array is required');
        }
        
        // Check bulk limits
        $max_bulk = $this->getMaxBulkLimit($user_id);
        if (count($phone_numbers) > $max_bulk) {
            return $this->errorResponse("Bulk limit exceeded. Maximum: $max_bulk numbers");
        }
        
        // Check total rate limits
        if (!$this->checkBulkRateLimit($user_id, count($phone_numbers))) {
            return $this->errorResponse('Rate limit exceeded for bulk operation');
        }
        
        $results = [];
        foreach ($phone_numbers as $phone_number) {
            $result = $this->validateWithPython(trim($phone_number));
            if ($result) {
                $this->savePhoneCheck($user_id, $phone_number, $result);
                $results[] = $result;
            }
        }
        
        // Update credits
        $this->updateCredits($user_id, count($results));
        
        // Add notification for completed bulk check
        if ($user_id) {
            $this->addNotification(
                $user_id,
                'Bulk Check Completed',
                'Your bulk phone number check has been completed successfully. ' . count($results) . ' numbers processed.'
            );
            
            // Send Telegram notification if user has Telegram username
            $this->sendTelegramNotification($user_id, 'Bulk Check Completed', 'Your bulk phone number check has been completed successfully. ' . count($results) . ' numbers processed.');
        }
        
        return $this->successResponse([
            'total_processed' => count($results),
            'results' => $results
        ]);
    }
    
    public function registerUser() {
        $data = $this->getRequestData();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $telegram_username = $data['telegram_username'] ?? null;
        
        if (empty($username) || empty($password)) {
            return $this->errorResponse('Username and password are required');
        }
        
        // Check if username exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            return $this->errorResponse('Username already exists');
        }
        
        // Generate activation code
        $activation_code = sprintf('%06d', mt_rand(100000, 999999));
        $activation_expires = date('Y-m-d H:i:s', time() + 30); // 30 seconds
        
        // Hash password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert user
        $stmt = $this->db->prepare("
            INSERT INTO users (username, password_hash, telegram_username, activation_code, activation_expires)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        if ($stmt->execute([$username, $password_hash, $telegram_username, $activation_code, $activation_expires])) {
            $user_id = $this->db->lastInsertId();
            
            // TODO: Send activation code via Telegram bot
            $this->sendTelegramActivation($telegram_username, $activation_code);
            
            return $this->successResponse([
                'user_id' => $user_id,
                'message' => 'Registration successful. Check your Telegram for activation code.',
                'activation_expires' => $activation_expires
            ]);
        }
        
        return $this->errorResponse('Registration failed');
    }
    
    public function loginUser() {
        $data = $this->getRequestData();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            return $this->errorResponse('Username and password are required');
        }
        
        $stmt = $this->db->prepare("SELECT id, password_hash, is_active, credits FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password_hash'])) {
            if (!$user['is_active']) {
                return $this->errorResponse('Account not activated');
            }
            
            return $this->successResponse([
                'user_id' => $user['id'],
                'username' => $username,
                'credits' => $user['credits'],
                'token' => $this->generateToken($user['id'])
            ]);
        }
        
        return $this->errorResponse('Invalid credentials');
    }
    
    public function activateUser() {
        $data = $this->getRequestData();
        $username = $data['username'] ?? '';
        $code = $data['code'] ?? '';
        
        if (empty($username) || empty($code)) {
            return $this->errorResponse('Username and activation code are required');
        }
        
        $stmt = $this->db->prepare("
            SELECT id, activation_expires 
            FROM users 
            WHERE username = ? AND activation_code = ? AND is_active = 0
        ");
        $stmt->execute([$username, $code]);
        $user = $stmt->fetch();
        
        if ($user) {
            if (strtotime($user['activation_expires']) < time()) {
                return $this->errorResponse('Activation code expired');
            }
            
            // Activate user
            $stmt = $this->db->prepare("
                UPDATE users 
                SET is_active = 1, activation_code = NULL, activation_expires = NULL 
                WHERE id = ?
            ");
            
            if ($stmt->execute([$user['id']])) {
                return $this->successResponse([
                    'message' => 'Account activated successfully'
                ]);
            }
        }
        
        return $this->errorResponse('Invalid activation code');
    }
    
    private function validateWithPython($phone_number) {
        $command = escapeshellcmd("python3 {$this->python_script}") . ' ' . escapeshellarg($phone_number);
        $output = shell_exec($command);
        
        if ($output) {
            $result = json_decode($output, true);
            return $result;
        }
        
        return null;
    }
    
    private function checkRateLimit($user_id) {
        if ($user_id) {
            // Check user credits
            $stmt = $this->db->prepare("SELECT credits FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            return $user && $user['credits'] > 0;
        } else {
            // Check IP-based limits for guests
            return $this->checkIPLimit();
        }
    }
    
    private function checkIPLimit() {
        $ip = $_SERVER['REMOTE_ADDR'];
        $today = date('Y-m-d');
        
        $stmt = $this->db->prepare("
            SELECT checks_today, last_reset 
            FROM ip_limits 
            WHERE ip_address = ?
        ");
        $stmt->execute([$ip]);
        $limit = $stmt->fetch();
        
        if ($limit) {
            if ($limit['last_reset'] !== $today) {
                // Reset daily limit
                $stmt = $this->db->prepare("
                    UPDATE ip_limits 
                    SET checks_today = 0, last_reset = ? 
                    WHERE ip_address = ?
                ");
                $stmt->execute([$today, $ip]);
                return true;
            }
            
            return $limit['checks_today'] < 50; // Daily limit for guests
        } else {
            // First time IP, create record
            $stmt = $this->db->prepare("
                INSERT INTO ip_limits (ip_address, checks_today, last_reset) 
                VALUES (?, 0, ?)
            ");
            $stmt->execute([$ip, $today]);
            return true;
        }
    }
    
    private function getMaxBulkLimit($user_id) {
        if ($user_id) {
            return 1000; // Registered users
        } else {
            return 100; // Guests
        }
    }
    
    private function updateCredits($user_id, $count = 1) {
        if ($user_id) {
            $stmt = $this->db->prepare("UPDATE users SET credits = credits - ? WHERE id = ?");
            $stmt->execute([$count, $user_id]);
        } else {
            // Update IP limit
            $ip = $_SERVER['REMOTE_ADDR'];
            $stmt = $this->db->prepare("
                UPDATE ip_limits 
                SET checks_today = checks_today + ? 
                WHERE ip_address = ?
            ");
            $stmt->execute([$count, $ip]);
        }
    }
    
    private function savePhoneCheck($user_id, $phone_number, $result) {
        $stmt = $this->db->prepare("
            INSERT INTO phone_checks (user_id, ip_address, phone_number, country, network_operator, is_valid, whatsapp_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user_id,
            $_SERVER['REMOTE_ADDR'],
            $phone_number,
            $result['location']['country_name'] ?? null,
            $result['carrier']['name'] ?? null,
            $result['valid'] ?? false,
            null // WhatsApp status - to be implemented
        ]);
    }
    
    private function addNotification($user_id, $title, $message) {
        $stmt = $this->db->prepare("
            INSERT INTO notifications (user_id, title, message)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$user_id, $title, $message]);
    }
    
    private function sendTelegramActivation($telegram_username, $code) {
        if (!$telegram_username) {
            error_log("No Telegram username provided for activation code: $code");
            return false;
        }
        
        // Call Python Telegram bot script
        $script_path = __DIR__ . '/../scripts/telegram_bot.py';
        $command = escapeshellcmd("python3 $script_path") . ' activate ' . 
                  escapeshellarg($telegram_username) . ' ' . 
                  escapeshellarg($code);
        
        $output = shell_exec($command);
        
        if ($output) {
            $result = json_decode($output, true);
            if ($result && $result['success']) {
                error_log("Activation code sent successfully to @$telegram_username: $code");
                return true;
            }
        }
        
        error_log("Failed to send activation code to @$telegram_username: $code");
        return false;
    }
    
    private function sendTelegramNotification($user_id, $title, $message) {
        // Get user's Telegram username
        $stmt = $this->db->prepare("SELECT telegram_username FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        
        if (!$user || !$user['telegram_username']) {
            return false;
        }
        
        $telegram_username = $user['telegram_username'];
        $script_path = __DIR__ . '/../scripts/telegram_bot.py';
        $command = escapeshellcmd("python3 $script_path") . ' notify ' . 
                  escapeshellarg($telegram_username) . ' ' . 
                  escapeshellarg($title) . ' ' . 
                  escapeshellarg($message);
        
        $output = shell_exec($command);
        
        if ($output) {
            $result = json_decode($output, true);
            if ($result && $result['success']) {
                error_log("Notification sent successfully to @$telegram_username: $title");
                return true;
            }
        }
        
        error_log("Failed to send notification to @$telegram_username: $title");
        return false;
    }
    
    private function generateToken($user_id) {
        return base64_encode($user_id . ':' . time() . ':' . bin2hex(random_bytes(16)));
    }
    
    private function getRequestData() {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?: [];
    }
    
    private function successResponse($data) {
        return json_encode(['success' => true, 'data' => $data]);
    }
    
    private function errorResponse($message, $code = 400) {
        http_response_code($code);
        return json_encode(['success' => false, 'error' => $message]);
    }
    
    public function getUserStats() {
        $user_id = $_GET['user_id'] ?? null;
        
        if (!$user_id) {
            return $this->errorResponse('User ID required');
        }
        
        // Get user credits
        $stmt = $this->db->prepare("SELECT credits FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return $this->errorResponse('User not found');
        }
        
        // Get usage stats
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as total_checks,
                   COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_checks
            FROM phone_checks 
            WHERE user_id = ?
        ");
        $stmt->execute([$user_id]);
        $stats = $stmt->fetch();
        
        return $this->successResponse([
            'credits' => $user['credits'],
            'total_checks' => $stats['total_checks'],
            'today_checks' => $stats['today_checks']
        ]);
    }
    
    public function getNotifications() {
        $user_id = $_GET['user_id'] ?? null;
        
        if (!$user_id) {
            return $this->errorResponse('User ID required');
        }
        
        $stmt = $this->db->prepare("
            SELECT id, title, message, is_read, created_at
            FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 20
        ");
        $stmt->execute([$user_id]);
        $notifications = $stmt->fetchAll();
        
        return $this->successResponse($notifications);
    }
}

// Initialize API and handle request
$api = new PhoneCheckerAPI();
echo $api->handleRequest();