// Language configuration for Phone Number Checker
const LANGUAGES = {
    ar: {
        name: 'العربية',
        dir: 'rtl',
        translations: {
            // Navigation
            'nav.home': 'الرئيسية',
            'nav.login': 'تسجيل الدخول',
            'nav.register': 'إنشاء حساب',
            'nav.dashboard': 'لوحة التحكم',
            
            // Homepage
            'home.title': 'فاحص أرقام الهواتف',
            'home.hero.title': 'مرحباً بك في فاحص أرقام الهواتف',
            'home.hero.subtitle': 'اكتشف معلومات الأرقام مثل مشغل الشبكة والعلم وحالة الواتساب',
            'home.hero.start': 'ابدأ الآن',
            'home.hero.learn_more': 'تعرف على المزيد',
            
            // Features
            'features.title': 'المميزات',
            'features.network.title': 'فحص مشغل الشبكة',
            'features.network.desc': 'اكتشف مشغل الشبكة لأي رقم هاتف',
            'features.whatsapp.title': 'فلترة الواتساب',
            'features.whatsapp.desc': 'تحقق من وجود رقم الهاتف على الواتساب',
            'features.bulk.title': 'فحص ملفات الأرقام',
            'features.bulk.desc': 'ارفع ملف نصي وافحص جميع الأرقام دفعة واحدة',
            'features.country.title': 'معلومات البلد',
            'features.country.desc': 'اعرف البلد وعلمه لأي رقم هاتف',
            
            // Pricing
            'pricing.title': 'الباقات',
            'pricing.basic': 'الباقة الأساسية',
            'pricing.advanced': 'الباقة المتقدمة',
            'pricing.professional': 'الباقة الاحترافية',
            'pricing.subscribe': 'اشترك الآن',
            
            // Authentication
            'auth.username': 'اسم المستخدم',
            'auth.password': 'كلمة المرور',
            'auth.telegram': 'اسم المستخدم في التيليجرام (اختياري)',
            'auth.register': 'إنشاء حساب',
            'auth.login': 'تسجيل الدخول',
            'auth.forgot_password': 'نسيت كلمة المرور؟',
            'auth.activation_code': 'رمز التفعيل',
            'auth.activate': 'تفعيل الحساب',
            
            // Dashboard
            'dashboard.title': 'لوحة التحكم',
            'dashboard.credits': 'الرصيد المتبقي',
            'dashboard.checks_today': 'فحوصات اليوم',
            'dashboard.total_checks': 'إجمالي الفحوصات',
            'dashboard.notifications': 'الإشعارات',
            
            // Checker
            'checker.phone_number': 'رقم الهاتف',
            'checker.check': 'فحص',
            'checker.bulk_upload': 'رفع ملف',
            'checker.results': 'النتائج',
            'checker.export': 'تصدير',
            
            // Common
            'common.loading': 'جاري التحميل...',
            'common.error': 'خطأ',
            'common.success': 'نجح',
            'common.cancel': 'إلغاء',
            'common.save': 'حفظ',
            'common.delete': 'حذف',
            'common.edit': 'تعديل',
            'common.close': 'إغلاق'
        }
    },
    en: {
        name: 'English',
        dir: 'ltr',
        translations: {
            // Navigation
            'nav.home': 'Home',
            'nav.login': 'Login',
            'nav.register': 'Register',
            'nav.dashboard': 'Dashboard',
            
            // Homepage
            'home.title': 'Phone Number Checker',
            'home.hero.title': 'Welcome to Phone Number Checker',
            'home.hero.subtitle': 'Discover phone number information like network operator, country flag and WhatsApp status',
            'home.hero.start': 'Get Started',
            'home.hero.learn_more': 'Learn More',
            
            // Features
            'features.title': 'Features',
            'features.network.title': 'Network Operator Check',
            'features.network.desc': 'Discover the network operator for any phone number',
            'features.whatsapp.title': 'WhatsApp Filter',
            'features.whatsapp.desc': 'Check if a phone number exists on WhatsApp',
            'features.bulk.title': 'Bulk Number Check',
            'features.bulk.desc': 'Upload a text file and check all numbers at once',
            'features.country.title': 'Country Information',
            'features.country.desc': 'Know the country and flag for any phone number',
            
            // Pricing
            'pricing.title': 'Pricing Plans',
            'pricing.basic': 'Basic Plan',
            'pricing.advanced': 'Advanced Plan',
            'pricing.professional': 'Professional Plan',
            'pricing.subscribe': 'Subscribe Now',
            
            // Authentication
            'auth.username': 'Username',
            'auth.password': 'Password',
            'auth.telegram': 'Telegram Username (Optional)',
            'auth.register': 'Register',
            'auth.login': 'Login',
            'auth.forgot_password': 'Forgot Password?',
            'auth.activation_code': 'Activation Code',
            'auth.activate': 'Activate Account',
            
            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.credits': 'Remaining Credits',
            'dashboard.checks_today': 'Today\'s Checks',
            'dashboard.total_checks': 'Total Checks',
            'dashboard.notifications': 'Notifications',
            
            // Checker
            'checker.phone_number': 'Phone Number',
            'checker.check': 'Check',
            'checker.bulk_upload': 'Upload File',
            'checker.results': 'Results',
            'checker.export': 'Export',
            
            // Common
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.cancel': 'Cancel',
            'common.save': 'Save',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.close': 'Close'
        }
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'ar';
        this.init();
    }
    
    init() {
        this.applyLanguage(this.currentLanguage);
        this.addLanguageSwitcher();
    }
    
    switchLanguage(langCode) {
        if (LANGUAGES[langCode]) {
            this.currentLanguage = langCode;
            localStorage.setItem('language', langCode);
            this.applyLanguage(langCode);
            
            // Reload page to apply changes
            window.location.reload();
        }
    }
    
    applyLanguage(langCode) {
        const lang = LANGUAGES[langCode];
        if (!lang) return;
        
        // Set document attributes
        document.documentElement.lang = langCode;
        document.documentElement.dir = lang.dir;
        
        // Update body class for CSS styling
        document.body.className = document.body.className.replace(/lang-\w+/, '') + ` lang-${langCode}`;
        
        // Translate elements
        this.translateElements();
    }
    
    translateElements() {
        const lang = LANGUAGES[this.currentLanguage];
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update page title
        const titleKey = document.body.getAttribute('data-page-title');
        if (titleKey) {
            document.title = this.getTranslation(titleKey) || document.title;
        }
    }
    
    getTranslation(key) {
        const lang = LANGUAGES[this.currentLanguage];
        return lang?.translations?.[key] || key;
    }
    
    addLanguageSwitcher() {
        // Add language switcher to navigation
        const nav = document.querySelector('.nav-menu');
        if (nav && !document.querySelector('.language-switcher')) {
            const switcher = document.createElement('div');
            switcher.className = 'language-switcher';
            switcher.innerHTML = `
                <button class="lang-btn ${this.currentLanguage === 'ar' ? 'active' : ''}" data-lang="ar">
                    العربية
                </button>
                <button class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    English
                </button>
            `;
            
            nav.appendChild(switcher);
            
            // Add click handlers
            switcher.addEventListener('click', (e) => {
                if (e.target.classList.contains('lang-btn')) {
                    const lang = e.target.getAttribute('data-lang');
                    this.switchLanguage(lang);
                }
            });
        }
    }
    
    // Helper method for dynamic translations
    t(key) {
        return this.getTranslation(key);
    }
}

// Initialize language manager
window.LanguageManager = new LanguageManager();

// Export for use in other scripts
window.t = (key) => window.LanguageManager.getTranslation(key);