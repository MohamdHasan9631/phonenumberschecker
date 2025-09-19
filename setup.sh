#!/bin/bash

# 🚀 فاحص أرقام الهواتف - سكريبت التشغيل السريع
# Phone Number Checker - Quick Setup Script

echo "=========================================="
echo "🚀 مرحباً بك في فاحص أرقام الهواتف"
echo "   Welcome to Phone Number Checker"
echo "=========================================="
echo

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -f "index.html" ]; then
    print_error "يرجى تشغيل هذا السكريبت من داخل مجلد المشروع"
    print_error "Please run this script from the project directory"
    exit 1
fi

echo "🔍 فحص المتطلبات - Checking Requirements..."
echo

# Check PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
    print_status "تم العثور على PHP - PHP found: $PHP_VERSION"
else
    print_error "PHP غير مثبت - PHP not installed"
    print_info "يرجى تثبيت PHP 8.0+ - Please install PHP 8.0+"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d ' ' -f 2)
    print_status "تم العثور على Python - Python found: $PYTHON_VERSION"
else
    print_error "Python3 غير مثبت - Python3 not installed"
    print_info "يرجى تثبيت Python 3.8+ - Please install Python 3.8+"
    exit 1
fi

# Check pip
if command -v pip &> /dev/null || command -v pip3 &> /dev/null; then
    print_status "تم العثور على pip - pip found"
else
    print_error "pip غير مثبت - pip not installed"
    exit 1
fi

echo
echo "📦 تثبيت المتطلبات - Installing Requirements..."

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    print_info "تثبيت مكتبات Python - Installing Python libraries..."
    if pip install -r requirements.txt --user; then
        print_status "تم تثبيت مكتبات Python بنجاح - Python libraries installed successfully"
    else
        print_warning "فشل في تثبيت بعض المكتبات، جاري المحاولة بـ pip3 - Failed with pip, trying pip3..."
        if pip3 install -r requirements.txt --user; then
            print_status "تم تثبيت مكتبات Python بنجاح - Python libraries installed successfully"
        else
            print_error "فشل في تثبيت المكتبات - Failed to install libraries"
            exit 1
        fi
    fi
else
    print_warning "ملف requirements.txt غير موجود - requirements.txt not found"
fi

echo
echo "🔧 إعداد الصلاحيات - Setting Permissions..."

# Set script permissions
if [ -d "scripts" ]; then
    chmod +x scripts/*.py 2>/dev/null
    print_status "تم تعيين صلاحيات النصوص البرمجية - Script permissions set"
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    mkdir data
fi
chmod 755 data/ 2>/dev/null
print_status "تم تعيين صلاحيات مجلد البيانات - Data directory permissions set"

echo
echo "🧪 اختبار النظام - Testing System..."

# Test Python script
if [ -f "scripts/phone_validator.py" ]; then
    print_info "اختبار النص البرمجي Python - Testing Python script..."
    if python3 scripts/phone_validator.py "+966501234567" >/dev/null 2>&1; then
        print_status "النص البرمجي Python يعمل بنجاح - Python script working correctly"
    else
        print_warning "مشكلة في النص البرمجي Python - Issue with Python script"
    fi
fi

# Test database connection
print_info "اختبار قاعدة البيانات - Testing database..."
if php -r "require_once 'config/database.php'; \$db = DatabaseConfig::getInstance(); echo 'success';" 2>/dev/null | grep -q "success"; then
    print_status "قاعدة البيانات تعمل بنجاح - Database working correctly"
else
    print_warning "قاعدة البيانات تستخدم SQLite (عادي) - Database using SQLite (normal)"
fi

echo
echo "=========================================="
echo "🎉 تم الإعداد بنجاح! - Setup Complete!"
echo "=========================================="
echo

print_info "لتشغيل الخادم - To start the server:"
echo -e "${BLUE}   php -S localhost:8000${NC}"
echo

print_info "ثم افتح المتصفح واذهب إلى - Then open browser and go to:"
echo -e "${BLUE}   http://localhost:8000${NC}"
echo

print_info "أوامر بديلة للتشغيل - Alternative commands:"
echo -e "${BLUE}   python3 -m http.server 8000${NC}"
echo -e "${BLUE}   npx http-server${NC}"
echo

echo "📖 للمزيد من التفاصيل - For more details:"
echo "   - README.md"
echo "   - START.md"
echo "   - INSTALL.md"
echo

# Ask if user wants to start the server immediately
read -p "هل تريد تشغيل الخادم الآن؟ (y/n) - Start server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo
    print_info "تشغيل خادم PHP - Starting PHP server..."
    print_info "اضغط Ctrl+C للإيقاف - Press Ctrl+C to stop"
    print_info "افتح http://localhost:8000 في المتصفح - Open http://localhost:8000 in browser"
    echo
    php -S localhost:8000
fi

echo
print_status "شكراً لاستخدام فاحص أرقام الهواتف! - Thank you for using Phone Number Checker!"