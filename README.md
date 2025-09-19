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

### 1. Clone the repository
```bash
git clone https://github.com/MohamdHasan9631/phonenumberschecker.git
cd phonenumberschecker
```

### 2. Start a local server
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

### 3. Open in browser
Navigate to `http://localhost:8000`

## ملفات المشروع - Project Files

- `index.html` - الصفحة الرئيسية / Homepage
- `login.html` - صفحة تسجيل الدخول / Login page  
- `register.html` - صفحة التسجيل / Registration page
- `dashboard.html` - لوحة التحكم / Dashboard
- `orders.html` - الطلبات والدفع / Orders & Payment
- `styles.css` - التنسيقات / Stylesheets
- `script.js` - الوظائف / JavaScript functions

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

## المتطلبات التقنية - Technical Requirements

- Modern web browser with JavaScript enabled
- Internet connection for external resources (FontAwesome icons)
- For production: Web server (Apache/Nginx)

## الترخيص - License

This project is created for demonstration purposes. All rights reserved.

---

Made with ❤️ for Arabic phone number validation
