# Phone Number Checker - Installation & Setup Guide

## Overview

This is a comprehensive phone number validation system with Arabic/English support, featuring a PHP backend, Python validation engine, and modern JavaScript frontend.

## Features Implemented

### ✅ Core Features
- **PHP Backend API** - Complete RESTful API for phone validation
- **Python Integration** - libphonenumbers library for accurate validation
- **Multilingual Support** - Arabic/English language switching
- **User Authentication** - Username/password registration and login
- **Guest Functionality** - Anonymous phone checking (50/day) with file upload
- **Telegram Integration** - Account activation via bot (simulated)
- **Dashboard System** - Full user control panel with statistics
- **Real-time Notifications** - In-app and Telegram notifications
- **Data Export** - CSV/TXT export for results
- **3D Modern Design** - Professional UI with animations

### 📊 Validation Capabilities
- **Phone Number Analysis**: Country, carrier, type detection
- **Bulk Processing**: Up to 1,000 numbers for registered users
- **File Upload Support**: TXT and CSV formats
- **Rate Limiting**: 50,000 monthly checks per user
- **Real-time Results**: DataTables with export options

## Installation

### Prerequisites
- **PHP 8.0+** with PDO extension
- **Python 3.8+** with pip
- **Web Server** (Apache/Nginx) or PHP built-in server
- **Database** (MySQL recommended, SQLite fallback included)

### Step 1: Clone Repository
```bash
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git
cd phonenumberschecker
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Set Up Database
The system automatically creates SQLite database on first run. For MySQL:

```sql
CREATE DATABASE phonechecker;
```

Update database credentials in `config/database.php`:
```php
private const DB_HOST = 'localhost';
private const DB_NAME = 'phonechecker';
private const DB_USER = 'your_username';
private const DB_PASS = 'your_password';
```

### Step 4: Configure Web Server

#### PHP Built-in Server (Development)
```bash
php -S localhost:8000
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/phonenumberschecker
    ServerName phonechecker.local
    
    <Directory /path/to/phonenumberschecker>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Step 5: Set Permissions
```bash
chmod +x scripts/phone_validator.py
chmod +x scripts/telegram_bot.py
chmod 755 data/
```

## Usage

### Guest Users
1. Visit homepage
2. Enter phone number or upload file (max 100 numbers)
3. View results in DataTable
4. Export as CSV/TXT

### Registered Users
1. **Register**: Username + password + optional Telegram
2. **Activate**: Via Telegram bot (6-digit code, 30 seconds)
3. **Login**: Access full dashboard
4. **Check Numbers**: Up to 50,000 monthly checks
5. **Bulk Processing**: Upload files with up to 1,000 numbers

## API Endpoints

### Authentication
- `POST /api/index.php?endpoint=register`
- `POST /api/index.php?endpoint=login`
- `POST /api/index.php?endpoint=activate`

### Phone Validation
- `POST /api/index.php?endpoint=check`
- `POST /api/index.php?endpoint=bulk_check`

### User Data
- `GET /api/index.php?endpoint=stats`
- `GET /api/index.php?endpoint=notifications`

## Sample API Usage

### Single Phone Check
```javascript
const response = await fetch('api/index.php?endpoint=check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        phone_number: '+966501234567',
        user_id: 123 // optional for guests
    })
});
```

### Response Format
```json
{
  "success": true,
  "data": {
    "valid": true,
    "phone_number": {
      "international": "+966 50 123 4567",
      "country_code": 966
    },
    "location": {
      "country_name": "Saudi Arabia",
      "flag_emoji": "🇸🇦"
    },
    "carrier": {
      "name": "STC"
    },
    "type": {
      "name": "Mobile"
    }
  }
}
```

## File Structure
```
phonenumberschecker/
├── api/
│   └── index.php              # Main API endpoint
├── config/
│   └── database.php           # Database configuration
├── css/
│   └── 3d-effects.css         # Modern styling and animations
├── js/
│   ├── language.js            # Multilingual support
│   ├── guest-checker.js       # Guest functionality
│   └── dashboard.js           # User dashboard
├── scripts/
│   ├── phone_validator.py     # Python validation engine
│   └── telegram_bot.py        # Telegram bot simulator
├── data/                      # Database and logs (auto-created)
├── index.html                 # Homepage with guest checker
├── register.html              # User registration
├── login.html                 # User authentication
├── activate.html              # Account activation
├── dashboard.html             # User control panel
└── styles.css                 # Base styles
```

## Testing

### Phone Validation Test
```bash
python3 scripts/phone_validator.py "+966501234567"
```

### Telegram Bot Test
```bash
python3 scripts/telegram_bot.py activate testuser 123456
```

### Database Test
```bash
php -r "
require_once 'config/database.php';
\$db = DatabaseConfig::getInstance();
echo 'Database connection successful';
"
```

## Troubleshooting

### Common Issues

#### 1. "Database connection failed"
- Check database credentials in `config/database.php`
- Ensure SQLite directory is writable: `chmod 755 data/`

#### 2. "Python script not found"
- Verify Python path: `which python3`
- Make scripts executable: `chmod +x scripts/*.py`

#### 3. "API returns HTML instead of JSON"
- Check web server configuration
- Ensure `.htaccess` is working (Apache)
- Try direct API access: `curl http://localhost:8000/api/index.php?endpoint=stats`

#### 4. "libphonenumbers not found"
- Install dependencies: `pip install phonenumbers`
- Check Python path in API calls

## Production Deployment

### Security Checklist
- [ ] Change default database credentials
- [ ] Enable HTTPS/SSL
- [ ] Set up proper error logging
- [ ] Configure rate limiting
- [ ] Set up real Telegram bot
- [ ] Enable production error handling

### Performance Optimization
- [ ] Enable PHP OPcache
- [ ] Configure MySQL connection pooling
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize database indexes

## Support

For issues and questions:
1. Check logs in `data/` directory
2. Verify configuration files
3. Test individual components
4. Check browser console for JavaScript errors

## License

Created for demonstration purposes. All rights reserved.

---

**Made with ❤️ for comprehensive phone number validation**