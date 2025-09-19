// Global utility functions and shared JavaScript functionality

// Phone number validation
function validatePhoneNumber(number) {
    // Remove all non-digit characters except +
    const cleaned = number.replace(/[^\d+]/g, '');
    
    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
}

// Format phone number for display
function formatPhoneNumber(number) {
    // Remove all non-digit characters except +
    let cleaned = number.replace(/[^\d+]/g, '');
    
    // Add + if not present
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    
    return cleaned;
}

// Country code mapping for phone number validation
const countryData = {
    '+966': { name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', code: 'SA' },
    '+971': { name: 'United Arab Emirates', nameAr: 'الإمارات', flag: '🇦🇪', code: 'AE' },
    '+965': { name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', code: 'KW' },
    '+974': { name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', code: 'QA' },
    '+973': { name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', code: 'BH' },
    '+968': { name: 'Oman', nameAr: 'عمان', flag: '🇴🇲', code: 'OM' },
    '+20': { name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', code: 'EG' },
    '+962': { name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', code: 'JO' },
    '+961': { name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', code: 'LB' },
    '+963': { name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', code: 'SY' },
    '+964': { name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', code: 'IQ' },
    '+967': { name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', code: 'YE' },
    '+212': { name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', code: 'MA' },
    '+213': { name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', code: 'DZ' },
    '+216': { name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', code: 'TN' },
    '+218': { name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', code: 'LY' },
    '+249': { name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', code: 'SD' },
    '+1': { name: 'United States', nameAr: 'الولايات المتحدة', flag: '🇺🇸', code: 'US' },
    '+44': { name: 'United Kingdom', nameAr: 'المملكة المتحدة', flag: '🇬🇧', code: 'GB' },
    '+33': { name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', code: 'FR' },
    '+49': { name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', code: 'DE' },
    '+39': { name: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹', code: 'IT' },
    '+34': { name: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸', code: 'ES' },
    '+31': { name: 'Netherlands', nameAr: 'هولندا', flag: '🇳🇱', code: 'NL' },
    '+90': { name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', code: 'TR' },
    '+98': { name: 'Iran', nameAr: 'إيران', flag: '🇮🇷', code: 'IR' },
    '+92': { name: 'Pakistan', nameAr: 'باكستان', flag: '🇵🇰', code: 'PK' },
    '+91': { name: 'India', nameAr: 'الهند', flag: '🇮🇳', code: 'IN' },
    '+86': { name: 'China', nameAr: 'الصين', flag: '🇨🇳', code: 'CN' },
    '+81': { name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵', code: 'JP' },
    '+82': { name: 'South Korea', nameAr: 'كوريا الجنوبية', flag: '🇰🇷', code: 'KR' }
};

// Network operators data (mainly for Middle East)
const networkOperators = {
    // Saudi Arabia
    '+96650': 'STC',
    '+96651': 'موبايلي',
    '+96652': 'موبايلي', 
    '+96653': 'موبايلي',
    '+96654': 'زين',
    '+96655': 'زين',
    '+96656': 'زين',
    '+96657': 'زين',
    '+96658': 'زين',
    '+96659': 'زين',
    
    // UAE
    '+97150': 'اتصالات',
    '+97151': 'اتصالات',
    '+97152': 'اتصالات',
    '+97154': 'اتصالات',
    '+97155': 'دو',
    '+97156': 'دو',
    '+97158': 'دو',
    
    // Kuwait
    '+96550': 'زين الكويت',
    '+96551': 'زين الكويت',
    '+96552': 'اوريدو',
    '+96555': 'اوريدو',
    '+96556': 'اوريدو',
    '+96560': 'فيفا',
    '+96565': 'فيفا',
    '+96566': 'فيفا',
    '+96567': 'فيفا',
    '+96569': 'فيفا',
    
    // Qatar
    '+97430': 'اوريدو',
    '+97431': 'اوريدو',
    '+97433': 'اوريدو',
    '+97434': 'اوريدو',
    '+97435': 'اوريدو',
    '+97436': 'اوريدو',
    '+97450': 'فودافون',
    '+97455': 'فودافون',
    '+97466': 'فودافون',
    '+97470': 'فودافون',
    '+97477': 'فودافون'
};

// Get country information from phone number
function getCountryInfo(phoneNumber) {
    const number = formatPhoneNumber(phoneNumber);
    
    // Try to match country codes from longest to shortest
    const sortedCodes = Object.keys(countryData).sort((a, b) => b.length - a.length);
    
    for (const code of sortedCodes) {
        if (number.startsWith(code)) {
            return countryData[code];
        }
    }
    
    return { name: 'Unknown', nameAr: 'غير معروف', flag: '❓', code: 'UN' };
}

// Get network operator from phone number
function getNetworkOperator(phoneNumber) {
    const number = formatPhoneNumber(phoneNumber);
    
    // Try to match network codes from longest to shortest
    const sortedCodes = Object.keys(networkOperators).sort((a, b) => b.length - a.length);
    
    for (const code of sortedCodes) {
        if (number.startsWith(code)) {
            return networkOperators[code];
        }
    }
    
    // Default networks based on country
    const country = getCountryInfo(phoneNumber);
    const defaultNetworks = {
        'SA': ['STC', 'موبايلي', 'زين'],
        'AE': ['اتصالات', 'دو'],
        'KW': ['زين الكويت', 'اوريدو', 'فيفا'],
        'QA': ['اوريدو', 'فودافون'],
        'BH': ['بتلكو', 'زين البحرين', 'فيفا'],
        'OM': ['عمانتل', 'اوريدو'],
        'EG': ['اورانج', 'فودافون', 'اتصالات مصر', 'وي'],
        'JO': ['زين الأردن', 'اورانج', 'أمنية']
    };
    
    if (defaultNetworks[country.code]) {
        const networks = defaultNetworks[country.code];
        return networks[Math.floor(Math.random() * networks.length)];
    }
    
    return 'غير معروف';
}

// Simulate WhatsApp check (replace with actual API)
async function checkWhatsAppStatus(phoneNumber) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate random result (in real implementation, this would call WhatsApp API)
    return Math.random() > 0.3; // 70% chance of having WhatsApp
}

// File parsing utilities
async function parseTextFile(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const phoneNumbers = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && validatePhoneNumber(trimmed)) {
            phoneNumbers.push(formatPhoneNumber(trimmed));
        }
    }
    
    return phoneNumbers;
}

async function parseCSVFile(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const phoneNumbers = [];
    
    for (const line of lines) {
        const cells = line.split(',');
        for (const cell of cells) {
            const trimmed = cell.trim().replace(/"/g, '');
            if (trimmed && validatePhoneNumber(trimmed)) {
                phoneNumbers.push(formatPhoneNumber(trimmed));
            }
        }
    }
    
    return phoneNumbers;
}

// Export results utilities
function exportToCSV(results) {
    let csv = 'الرقم,صالح,البلد,مشغل الشبكة,الواتساب\n';
    
    results.forEach(result => {
        const row = [
            result.number,
            result.valid ? 'نعم' : 'لا',
            result.country ? result.country.nameAr : '',
            result.network || '',
            result.whatsapp !== null ? (result.whatsapp ? 'نعم' : 'لا') : ''
        ];
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

function exportToTXT(results) {
    let txt = '';
    
    results.forEach(result => {
        let line = `${result.number} - ${result.valid ? 'صالح' : 'غير صالح'}`;
        
        if (result.country) {
            line += ` - ${result.country.nameAr}`;
        }
        
        if (result.network) {
            line += ` - ${result.network}`;
        }
        
        if (result.whatsapp !== null) {
            line += ` - واتساب: ${result.whatsapp ? 'متوفر' : 'غير متوفر'}`;
        }
        
        txt += line + '\n';
    });
    
    return txt;
}

function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Local storage utilities
function saveUserData(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

function getUserData() {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function clearUserData() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // This would integrate with Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, eventData);
}

// Error handling
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorMessages = {
        'network': 'خطأ في الاتصال بالإنترنت',
        'file': 'خطأ في قراءة الملف',
        'validation': 'خطأ في التحقق من البيانات',
        'payment': 'خطأ في عملية الدفع',
        'auth': 'خطأ في التسجيل أو تسجيل الدخول'
    };
    
    const message = errorMessages[context] || 'حدث خطأ غير متوقع';
    showNotification(message, 'error');
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Loading state management
function showLoading(element, text = 'جاري التحميل...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    element.disabled = true;
    return originalContent;
}

function hideLoading(element) {
    if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// API simulation (replace with actual API calls)
class PhoneCheckerAPI {
    static async checkNumber(phoneNumber, options = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        const result = {
            number: phoneNumber,
            valid: validatePhoneNumber(phoneNumber),
            timestamp: new Date().toISOString()
        };
        
        if (options.country) {
            result.country = getCountryInfo(phoneNumber);
        }
        
        if (options.network) {
            result.network = getNetworkOperator(phoneNumber);
        }
        
        if (options.whatsapp) {
            result.whatsapp = await checkWhatsAppStatus(phoneNumber);
        }
        
        return result;
    }
    
    static async checkBulk(phoneNumbers, options = {}, onProgress = null) {
        const results = [];
        const total = phoneNumbers.length;
        
        for (let i = 0; i < phoneNumbers.length; i++) {
            const result = await this.checkNumber(phoneNumbers[i], options);
            results.push(result);
            
            if (onProgress) {
                onProgress({
                    completed: i + 1,
                    total: total,
                    percentage: Math.round(((i + 1) / total) * 100),
                    currentNumber: phoneNumbers[i]
                });
            }
            
            // Small delay between requests to avoid overwhelming
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return results;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Add global event listeners
    document.addEventListener('click', function(e) {
        // Handle dropdown menus, modals, etc.
        if (e.target.closest('.dropdown-toggle')) {
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            dropdown.classList.toggle('active');
        }
        
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle file input changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file') {
            const fileInput = e.target;
            const files = fileInput.files;
            
            if (files.length > 0) {
                const file = files[0];
                const maxSize = 10 * 1024 * 1024; // 10MB
                
                if (file.size > maxSize) {
                    showNotification('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.', 'error');
                    fileInput.value = '';
                    return;
                }
                
                const allowedTypes = ['text/plain', 'text/csv', 'application/csv'];
                if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|csv)$/i)) {
                    showNotification('نوع الملف غير مدعوم. يرجى استخدام ملفات .txt أو .csv فقط.', 'error');
                    fileInput.value = '';
                    return;
                }
            }
        }
    });
    
    // Handle form submissions with validation
    document.addEventListener('submit', function(e) {
        const form = e.target;
        
        // Check for required fields
        const requiredFields = form.querySelectorAll('[required]');
        let hasErrors = false;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                hasErrors = true;
            } else {
                field.style.borderColor = '#e1e5e9';
            }
        });
        
        if (hasErrors) {
            e.preventDefault();
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Validate email fields
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !isValidEmail(field.value)) {
                field.style.borderColor = '#dc3545';
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            e.preventDefault();
            showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // Validate phone fields
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value && !validatePhoneNumber(field.value)) {
                field.style.borderColor = '#dc3545';
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            e.preventDefault();
            showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
            return;
        }
    });
    
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
    });
});

// Email validation utility
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    const symbols = {
        'USD': '$',
        'SAR': 'ر.س',
        'AED': 'د.إ',
        'KWD': 'د.ك'
    };
    
    return `${symbols[currency] || currency} ${amount}`;
}

// Date formatting for Arabic
function formatDateArabic(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Export all utilities for use in other files
window.PhoneCheckerUtils = {
    validatePhoneNumber,
    formatPhoneNumber,
    getCountryInfo,
    getNetworkOperator,
    checkWhatsAppStatus,
    parseTextFile,
    parseCSVFile,
    exportToCSV,
    exportToTXT,
    downloadFile,
    saveUserData,
    getUserData,
    clearUserData,
    trackEvent,
    handleError,
    showNotification,
    showLoading,
    hideLoading,
    PhoneCheckerAPI,
    isValidEmail,
    formatCurrency,
    formatDateArabic
};