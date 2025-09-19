# فاحص أرقام الهواتف - Phone Numbers Checker

A comprehensive phone number checking system with Arabic RTL interface for detecting network operators, WhatsApp status, and country information.

## نظرة عامة - Overview

هذا النظام يوفر فحص شامل لأرقام الهواتف مع واجهة عربية متكاملة تدعم:
- فحص مشغلات الشبكة
- فلترة أرقام الواتساب  
- معلومات البلدان والأعلام
- رفع ملفات جماعية
- نظام الاشتراكات والدفع

This system provides comprehensive phone number checking with Arabic interface supporting:
- Network operator detection
- WhatsApp filtering
- Country information with flags
- Bulk file processing  
- Subscription and payment system

## المميزات - Features

### 🔍 فحص الأرقام - Number Checking
- **مشغل الشبكة**: تحديد مشغل الشبكة (STC، موبايلي، زين، إلخ)
- **فلترة الواتساب**: التحقق من وجود الرقم على الواتساب
- **معلومات البلد**: عرض اسم البلد والعلم
- **الفحص الجماعي**: رفع ملفات نصية أو CSV لفحص عدة أرقام

### 🔐 النظام الإداري - Management System  
- **تسجيل المستخدمين**: نظام تسجيل دخول كامل
- **باقات الاشتراك**: أساسية (10$)، متقدمة (25$)، احترافية (50$)
- **نظام الدفع**: دعم البطاقات الائتمانية وPayPal
- **تتبع الاستخدام**: نظام نقاط وحدود الاستخدام

### 🎨 التصميم - Design
- **واجهة عربية**: تدعم الكتابة من اليمين إلى اليسار
- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **تدرجات حديثة**: ألوان جذابة مع تأثيرات بصرية

## كيفية التشغيل - How to Run

### 🚀 التشغيل السريع - Quick Start

#### 📁 التثبيت التلقائي - Automated Setup

##### لنظام Linux/Mac:
```bash
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git
cd phonenumberschecker
chmod +x setup.sh
./setup.sh
```

##### لنظام Windows:
```cmd
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git
cd phonenumberschecker
setup.bat
```

#### 📋 التثبيت اليدوي - Manual Setup

#### 1. تحميل المشروع - Download Project
```bash
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git
cd phonenumberschecker
```

#### 2. تثبيت المتطلبات - Install Requirements
```bash
# تثبيت مكتبات Python - Install Python libraries
pip install -r requirements.txt

# تعيين الصلاحيات (Linux/Mac) - Set permissions (Linux/Mac)
chmod +x scripts/*.py
chmod 755 data/
```

#### 3. تشغيل الخادم - Start Server
```bash
# تشغيل خادم PHP (الطريقة المفضلة) - PHP Server (Recommended)
php -S localhost:8000

# أو استخدام Python - Or use Python
python3 -m http.server 8000

# أو استخدام Node.js - Or use Node.js
npx http-server
```

#### 4. فتح المتصفح - Open Browser
انتقل إلى: `http://localhost:8000`

### ⚡ تشغيل سريع بأمر واحد - One Command Setup
```bash
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git && cd phonenumberschecker && pip install -r requirements.txt && chmod +x scripts/*.py && chmod 755 data/ && php -S localhost:8000
```

### 🔧 متطلبات النظام - System Requirements
- **PHP 8.0+** مع امتداد PDO
- **Python 3.8+** مع pip
- **خادم ويب** (Apache/Nginx) أو خادم PHP المدمج
- **قاعدة بيانات** (MySQL مستحسن، SQLite مدمج)

## ملفات المشروع - Project Files

```
phonenumberschecker/
├── 📁 api/                    # واجهة برمجة التطبيقات - API Interface
│   └── index.php              # نقطة الدخول الرئيسية - Main API endpoint
├── 📁 config/                 # ملفات التكوين - Configuration files
│   └── database.php           # إعدادات قاعدة البيانات - Database settings
├── 📁 css/                    # ملفات التنسيق - Style files
│   └── 3d-effects.css         # التأثيرات والتحريك - Effects and animations
├── 📁 js/                     # ملفات JavaScript
│   ├── language.js            # دعم اللغات - Language support
│   ├── guest-checker.js       # وظائف الزوار - Guest functionality
│   └── dashboard.js           # لوحة التحكم - User dashboard
├── 📁 scripts/                # النصوص البرمجية - Scripts
│   ├── phone_validator.py     # محرك التحقق - Validation engine
│   └── telegram_bot.py        # بوت تيليجرام - Telegram bot
├── 📁 data/                   # قاعدة البيانات والسجلات - Database and logs
├── 📄 index.html              # الصفحة الرئيسية - Homepage
├── 📄 register.html           # صفحة التسجيل - Registration page
├── 📄 login.html              # صفحة تسجيل الدخول - Login page
├── 📄 activate.html           # تفعيل الحساب - Account activation
├── 📄 dashboard.html          # لوحة التحكم - User control panel
├── 📄 orders.html             # الطلبات والدفع - Orders & Payment
└── 📄 styles.css              # التنسيقات الأساسية - Base styles
```

## 🔧 حل المشاكل الشائعة - Troubleshooting

### مشكلة: "Database connection failed"
```bash
# التحقق من صلاحيات مجلد data - Check data folder permissions
chmod 755 data/

# اختبار الاتصال بقاعدة البيانات - Test database connection
php -r "require_once 'config/database.php'; \$db = DatabaseConfig::getInstance(); echo 'نجح الاتصال بقاعدة البيانات';"
```

### مشكلة: "Python script not found"
```bash
# التحقق من مسار Python - Check Python path
which python3

# تعيين صلاحيات التنفيذ - Set execution permissions
chmod +x scripts/*.py

# اختبار النص البرمجي - Test script
python3 scripts/phone_validator.py "+966501234567"
```

### مشكلة: "libphonenumbers not found"
```bash
# تثبيت المكتبات المطلوبة - Install required libraries
pip install phonenumbers==8.13.27

# أو تثبيت من ملف المتطلبات - Or install from requirements file
pip install -r requirements.txt
```

### مشكلة: الخادم لا يعمل - Server not working
```bash
# التحقق من أن المنفذ غير مستخدم - Check if port is available
lsof -i :8000

# تشغيل على منفذ مختلف - Run on different port
php -S localhost:8080
```

### مشكلة: الواجهة لا تظهر بشكل صحيح - Interface not displaying correctly
- تأكد من وجود اتصال بالإنترنت لتحميل الخطوط والأيقونات
- امسح ذاكرة التخزين المؤقت للمتصفح (Ctrl+F5)
- تحقق من وحدة تحكم المطور (F12) للأخطاء

## التطوير المستقبلي - Future Development

### Backend Integration
- RESTful API for phone number validation
- Database integration (MySQL/PostgreSQL)
- Real WhatsApp API integration
- Payment gateway integration (Stripe/PayPal)

### Additional Features  
- API access for developers
- Advanced reporting and analytics
- Bulk export functionality
- Admin dashboard for management

### 🎯 اختبار سريع - Quick Test

بعد تشغيل الخادم، جرب هذا الرقم للتأكد من عمل النظام:

```
+966501234567
```

يجب أن تحصل على النتيجة التالية:
- **الدولة**: السعودية 🇸🇦
- **المشغل**: STC  
- **النوع**: جوال
- **صالح**: نعم ✅

## المتطلبات التقنية - Technical Requirements

- Modern web browser with JavaScript enabled
- Internet connection for external resources (FontAwesome icons)
- For production: Web server (Apache/Nginx)

## الترخيص - License

This project is created for demonstration purposes. All rights reserved.

---

Made with ❤️ for Arabic phone number validation
