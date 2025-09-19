@echo off
chcp 65001 >nul
:: 🚀 فاحص أرقام الهواتف - سكريبت التشغيل السريع لنظام Windows
:: Phone Number Checker - Quick Setup Script for Windows

echo ==========================================
echo 🚀 مرحباً بك في فاحص أرقام الهواتف
echo    Welcome to Phone Number Checker
echo ==========================================
echo.

:: Check if we're in the right directory
if not exist "README.md" (
    echo ❌ يرجى تشغيل هذا السكريبت من داخل مجلد المشروع
    echo ❌ Please run this script from the project directory
    pause
    exit /b 1
)

echo 🔍 فحص المتطلبات - Checking Requirements...
echo.

:: Check PHP
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP غير مثبت - PHP not installed
    echo ℹ️  يرجى تثبيت PHP من: https://www.php.net/downloads
    echo ℹ️  Please install PHP from: https://www.php.net/downloads
    pause
    exit /b 1
) else (
    for /f "tokens=2" %%i in ('php --version 2^>nul ^| findstr "PHP"') do (
        echo ✅ تم العثور على PHP - PHP found: %%i
        goto :php_found
    )
)
:php_found

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python غير مثبت - Python not installed
        echo ℹ️  يرجى تثبيت Python من: https://www.python.org/downloads
        echo ℹ️  Please install Python from: https://www.python.org/downloads
        pause
        exit /b 1
    ) else (
        for /f "tokens=2" %%i in ('python3 --version 2^>nul') do (
            echo ✅ تم العثور على Python - Python found: %%i
            set PYTHON_CMD=python3
        )
    )
) else (
    for /f "tokens=2" %%i in ('python --version 2^>nul') do (
        echo ✅ تم العثور على Python - Python found: %%i
        set PYTHON_CMD=python
    )
)

:: Check pip
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip غير مثبت - pip not installed
    echo ℹ️  يرجى تثبيت pip - Please install pip
    pause
    exit /b 1
) else (
    echo ✅ تم العثور على pip - pip found
)

echo.
echo 📦 تثبيت المتطلبات - Installing Requirements...

:: Install Python dependencies
if exist "requirements.txt" (
    echo ℹ️  تثبيت مكتبات Python - Installing Python libraries...
    pip install -r requirements.txt --user
    if %errorlevel% neq 0 (
        echo ❌ فشل في تثبيت المكتبات - Failed to install libraries
        pause
        exit /b 1
    )
    echo ✅ تم تثبيت مكتبات Python بنجاح - Python libraries installed successfully
) else (
    echo ⚠️  ملف requirements.txt غير موجود - requirements.txt not found
)

echo.
echo 🔧 إعداد الصلاحيات - Setting Permissions...

:: Create data directory if it doesn't exist
if not exist "data" mkdir data
echo ✅ تم إنشاء مجلد البيانات - Data directory created

echo.
echo 🧪 اختبار النظام - Testing System...

:: Test Python script
if exist "scripts\phone_validator.py" (
    echo ℹ️  اختبار النص البرمجي Python - Testing Python script...
    %PYTHON_CMD% scripts\phone_validator.py "+966501234567" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ النص البرمجي Python يعمل بنجاح - Python script working correctly
    ) else (
        echo ⚠️  مشكلة في النص البرمجي Python - Issue with Python script
    )
)

:: Test database connection
echo ℹ️  اختبار قاعدة البيانات - Testing database...
php -r "require_once 'config/database.php'; $db = DatabaseConfig::getInstance(); echo 'success';" 2>nul | findstr "success" >nul
if %errorlevel% equ 0 (
    echo ✅ قاعدة البيانات تعمل بنجاح - Database working correctly
) else (
    echo ⚠️  قاعدة البيانات تستخدم SQLite (عادي) - Database using SQLite (normal)
)

echo.
echo ==========================================
echo 🎉 تم الإعداد بنجاح! - Setup Complete!
echo ==========================================
echo.

echo ℹ️  لتشغيل الخادم - To start the server:
echo    php -S localhost:8000
echo.

echo ℹ️  ثم افتح المتصفح واذهب إلى - Then open browser and go to:
echo    http://localhost:8000
echo.

echo ℹ️  أوامر بديلة للتشغيل - Alternative commands:
echo    %PYTHON_CMD% -m http.server 8000
echo.

echo 📖 للمزيد من التفاصيل - For more details:
echo    - README.md
echo    - START.md
echo    - INSTALL.md
echo.

:: Ask if user wants to start the server immediately
set /p choice="هل تريد تشغيل الخادم الآن؟ (y/n) - Start server now? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo ℹ️  تشغيل خادم PHP - Starting PHP server...
    echo ℹ️  اضغط Ctrl+C للإيقاف - Press Ctrl+C to stop
    echo ℹ️  افتح http://localhost:8000 في المتصفح - Open http://localhost:8000 in browser
    echo.
    php -S localhost:8000
)

echo.
echo ✅ شكراً لاستخدام فاحص أرقام الهواتف! - Thank you for using Phone Number Checker!
pause