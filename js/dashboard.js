/**
 * Dashboard functionality for registered users
 */

class Dashboard {
    constructor() {
        this.apiEndpoint = 'api/index.php';
        this.userId = this.getUserId();
        this.resultsTable = null;
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.loadStats();
        this.loadNotifications();
        this.bindEvents();
        this.initializeDataTable();
    }
    
    getUserId() {
        // Get user ID from localStorage or session
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.user_id || null;
    }
    
    async loadUserData() {
        if (!this.userId) {
            this.redirectToLogin();
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = user.username || 'المستخدم';
        }
    }
    
    async loadStats() {
        if (!this.userId) return;
        
        try {
            const response = await fetch(`${this.apiEndpoint}?endpoint=stats&user_id=${this.userId}`);
            const result = await response.json();
            
            if (result.success) {
                const data = result.data;
                document.getElementById('remainingCredits').textContent = data.credits || 0;
                document.getElementById('todayChecks').textContent = data.today_checks || 0;
                document.getElementById('totalChecks').textContent = data.total_checks || 0;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    async loadNotifications() {
        if (!this.userId) return;
        
        try {
            const response = await fetch(`${this.apiEndpoint}?endpoint=notifications&user_id=${this.userId}`);
            const result = await response.json();
            
            if (result.success) {
                this.displayNotifications(result.data);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    displayNotifications(notifications) {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (notifications.length === 0) {
            container.innerHTML = '<div class="no-notifications">لا توجد إشعارات جديدة</div>';
            return;
        }
        
        container.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.is_read ? 'read' : 'unread'}">
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${this.formatDate(notification.created_at)}</span>
                </div>
                ${!notification.is_read ? '<div class="unread-indicator"></div>' : ''}
            </div>
        `).join('');
    }
    
    bindEvents() {
        // Single number form
        const singleForm = document.getElementById('singleNumberForm');
        if (singleForm) {
            singleForm.addEventListener('submit', (e) => this.handleSingleCheck(e));
        }
        
        // Bulk number form
        const bulkForm = document.getElementById('bulkNumberForm');
        if (bulkForm) {
            bulkForm.addEventListener('submit', (e) => this.handleBulkCheck(e));
        }
        
        // Export buttons
        const exportCSV = document.getElementById('exportCSV');
        const exportTXT = document.getElementById('exportTXT');
        
        if (exportCSV) exportCSV.addEventListener('click', () => this.exportResults('csv'));
        if (exportTXT) exportTXT.addEventListener('click', () => this.exportResults('txt'));
        
        // Mark all notifications as read
        const markAllRead = document.getElementById('markAllRead');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => this.markAllNotificationsRead());
        }
    }
    
    async handleSingleCheck(event) {
        event.preventDefault();
        
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const checkNetwork = document.getElementById('checkNetwork').checked;
        const checkWhatsapp = document.getElementById('checkWhatsapp').checked;
        const checkCountry = document.getElementById('checkCountry').checked;
        
        if (!phoneNumber) {
            this.showNotification('يرجى إدخال رقم هاتف', 'error');
            return;
        }
        
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> جاري الفحص...';
        submitBtn.disabled = true;
        
        try {
            const result = await this.callAPI('check', {
                phone_number: phoneNumber,
                user_id: this.userId,
                options: {
                    network: checkNetwork,
                    whatsapp: checkWhatsapp,
                    country: checkCountry
                }
            });
            
            if (result.success) {
                this.displaySingleResult(result.data);
                this.addResultToTable([result.data]);
                this.showResultsSection();
                document.getElementById('phoneNumber').value = '';
                this.showNotification('تم فحص الرقم بنجاح!', 'success');
                
                // Refresh stats
                this.loadStats();
            } else {
                this.showNotification(result.error || 'فشل في فحص الرقم', 'error');
            }
        } catch (error) {
            console.error('Error checking phone number:', error);
            this.showNotification('خطأ في الشبكة. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async handleBulkCheck(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById('numberFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showNotification('يرجى اختيار ملف', 'error');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.', 'error');
            return;
        }
        
        try {
            const text = await this.readFile(file);
            const phoneNumbers = this.parsePhoneNumbers(text);
            
            if (phoneNumbers.length === 0) {
                this.showNotification('لم يتم العثور على أرقام صحيحة في الملف', 'error');
                return;
            }
            
            if (phoneNumbers.length > 1000) {
                this.showNotification('الحد الأقصى 1000 رقم للمستخدمين المسجلين', 'error');
                return;
            }
            
            await this.processBulkNumbers(phoneNumbers);
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showNotification('خطأ في معالجة الملف', 'error');
        }
        
        // Reset file input
        fileInput.value = '';
    }
    
    async processBulkNumbers(phoneNumbers) {
        const progressSection = document.getElementById('bulkProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressSection.style.display = 'block';
        
        const checkNetwork = document.getElementById('bulkCheckNetwork').checked;
        const checkWhatsapp = document.getElementById('bulkCheckWhatsapp').checked;
        const checkCountry = document.getElementById('bulkCheckCountry').checked;
        
        try {
            const result = await this.callAPI('bulk_check', {
                phone_numbers: phoneNumbers,
                user_id: this.userId,
                options: {
                    network: checkNetwork,
                    whatsapp: checkWhatsapp,
                    country: checkCountry
                }
            });
            
            if (result.success) {
                this.addResultToTable(result.data.results);
                this.showResultsSection();
                this.showNotification(`تم معالجة ${result.data.total_processed} رقم بنجاح!`, 'success');
                
                // Refresh stats
                this.loadStats();
            } else {
                this.showNotification(result.error || 'فشل في معالجة الأرقام', 'error');
            }
        } catch (error) {
            console.error('Error processing bulk numbers:', error);
            this.showNotification('خطأ في الشبكة أثناء المعالجة المجمعة', 'error');
        } finally {
            progressSection.style.display = 'none';
        }
    }
    
    displaySingleResult(result) {
        const resultDiv = document.getElementById('singleResult');
        if (!resultDiv) return;
        
        resultDiv.innerHTML = `
            <div class="result-item">
                <h4>${result.phone_number.international}</h4>
                <div class="result-details">
                    <span class="badge ${result.valid ? 'success' : 'error'}">
                        ${result.valid ? 'صحيح' : 'غير صحيح'}
                    </span>
                    <span class="country">${result.location.flag_emoji} ${result.location.country_name}</span>
                    <span class="carrier">${result.carrier.name}</span>
                    <span class="type">${result.type.name}</span>
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
    }
    
    initializeDataTable() {
        if ($.fn.DataTable) {
            this.resultsTable = $('#resultsTable').DataTable({
                columns: [
                    { title: 'رقم الهاتف', data: 'phone_number.international' },
                    { 
                        title: 'صحيح', 
                        data: 'valid',
                        render: function(data) {
                            return data ? '<span class="badge success">صحيح</span>' : '<span class="badge error">غير صحيح</span>';
                        }
                    },
                    { title: 'البلد', data: 'location.country_name' },
                    { title: 'المشغل', data: 'carrier.name' },
                    { title: 'النوع', data: 'type.name' },
                    { 
                        title: 'العلم', 
                        data: 'location.flag_emoji',
                        render: function(data) {
                            return `<span style="font-size: 1.5rem;">${data || '🏳️'}</span>`;
                        }
                    },
                    { 
                        title: 'تاريخ الفحص',
                        data: null,
                        render: function() {
                            return new Date().toLocaleDateString('ar-SA');
                        }
                    }
                ],
                pageLength: 25,
                responsive: true,
                order: [[6, 'desc']],
                language: {
                    search: 'بحث:',
                    lengthMenu: 'عرض _MENU_ عنصر',
                    info: 'عرض _START_ إلى _END_ من _TOTAL_ عنصر',
                    paginate: {
                        first: 'الأول',
                        last: 'الأخير',
                        next: 'التالي',
                        previous: 'السابق'
                    }
                }
            });
        }
    }
    
    addResultToTable(results) {
        if (this.resultsTable && Array.isArray(results)) {
            this.resultsTable.rows.add(results).draw();
        }
    }
    
    showResultsSection() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    exportResults(format) {
        if (!this.resultsTable) {
            this.showNotification('لا توجد بيانات للتصدير', 'error');
            return;
        }
        
        const data = this.resultsTable.data().toArray();
        
        if (data.length === 0) {
            this.showNotification('لا توجد بيانات للتصدير', 'error');
            return;
        }
        
        if (format === 'csv') {
            this.exportToCSV(data);
        } else if (format === 'txt') {
            this.exportToTXT(data);
        }
    }
    
    exportToCSV(data) {
        const headers = ['رقم الهاتف', 'صحيح', 'البلد', 'المشغل', 'النوع', 'العلم'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                `"${row.phone_number?.international || ''}"`,
                row.valid ? 'صحيح' : 'غير صحيح',
                `"${row.location?.country_name || ''}"`,
                `"${row.carrier?.name || ''}"`,
                `"${row.type?.name || ''}"`,
                `"${row.location?.flag_emoji || ''}"`
            ].join(','))
        ].join('\\n');
        
        this.downloadFile(csvContent, 'dashboard-results.csv', 'text/csv');
    }
    
    exportToTXT(data) {
        const txtContent = data.map(row => 
            `${row.phone_number?.international || 'N/A'} | ${row.valid ? 'صحيح' : 'غير صحيح'} | ${row.location?.country_name || 'N/A'} | ${row.carrier?.name || 'N/A'} | ${row.type?.name || 'N/A'}`
        ).join('\\n');
        
        this.downloadFile(txtContent, 'dashboard-results.txt', 'text/plain');
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification(`تم تحميل الملف ${filename} بنجاح!`, 'success');
    }
    
    async callAPI(endpoint, data) {
        const response = await fetch(`${this.apiEndpoint}?endpoint=${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    parsePhoneNumbers(text) {
        const lines = text.split(/[\\r\\n,;]+/);
        const phoneNumbers = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && this.isValidPhoneFormat(trimmed)) {
                phoneNumbers.push(trimmed);
            }
        }
        
        return [...new Set(phoneNumbers)];
    }
    
    isValidPhoneFormat(number) {
        const phoneRegex = /^(\\+?[1-9]\\d{0,3})?[\\s\\-\\(\\)]?([1-9]\\d{6,14})$/;
        return phoneRegex.test(number.replace(/[\\s\\-\\(\\)]/g, ''));
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    showNotification(message, type = 'info') {
        const existing = document.querySelectorAll('.notification');
        existing.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    redirectToLogin() {
        window.location.href = 'login.html';
    }
    
    async markAllNotificationsRead() {
        // TODO: Implement mark all notifications as read
        this.showNotification('سيتم تنفيذ هذه الميزة قريباً', 'info');
    }
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Logout functionality
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('remainingCredits')) {
        window.dashboard = new Dashboard();
    }
});