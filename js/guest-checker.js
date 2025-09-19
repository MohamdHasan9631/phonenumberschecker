/**
 * Guest Phone Number Checker
 * Handles anonymous phone number checking for non-registered users
 */

class GuestPhoneChecker {
    constructor() {
        this.apiEndpoint = 'api/index.php';
        this.resultsTable = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeDataTable();
    }
    
    bindEvents() {
        // Single phone number check
        const checkBtn = document.getElementById('guestCheckBtn');
        const phoneInput = document.getElementById('guestPhoneInput');
        
        if (checkBtn && phoneInput) {
            checkBtn.addEventListener('click', () => this.checkSingleNumber());
            phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkSingleNumber();
                }
            });
        }
        
        // File upload
        const fileInput = document.getElementById('guestFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // Export buttons
        const exportCSV = document.getElementById('exportCSV');
        const exportTXT = document.getElementById('exportTXT');
        
        if (exportCSV) exportCSV.addEventListener('click', () => this.exportResults('csv'));
        if (exportTXT) exportTXT.addEventListener('click', () => this.exportResults('txt'));
    }
    
    async checkSingleNumber() {
        const phoneInput = document.getElementById('guestPhoneInput');
        const checkBtn = document.getElementById('guestCheckBtn');
        
        if (!phoneInput || !checkBtn) return;
        
        const phoneNumber = phoneInput.value.trim();
        
        if (!phoneNumber) {
            this.showNotification('Please enter a phone number', 'error');
            return;
        }
        
        // Show loading state
        const originalText = checkBtn.innerHTML;
        checkBtn.innerHTML = '<span class="loading-spinner"></span> Checking...';
        checkBtn.disabled = true;
        
        try {
            const result = await this.callAPI('check', { phone_number: phoneNumber });
            
            if (result.success) {
                this.addResultToTable([result.data]);
                this.showResultsSection();
                phoneInput.value = '';
                this.showNotification('Phone number checked successfully!', 'success');
            } else {
                this.showNotification(result.error || 'Failed to check phone number', 'error');
            }
        } catch (error) {
            console.error('Error checking phone number:', error);
            this.showNotification('Network error. Please try again.', 'error');
        } finally {
            checkBtn.innerHTML = originalText;
            checkBtn.disabled = false;
        }
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            this.showNotification('File too large. Maximum size is 1MB.', 'error');
            return;
        }
        
        // Check file type
        const allowedTypes = ['text/plain', 'text/csv', 'application/csv'];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
            this.showNotification('Please upload a .txt or .csv file', 'error');
            return;
        }
        
        try {
            const text = await this.readFile(file);
            const phoneNumbers = this.parsePhoneNumbers(text);
            
            if (phoneNumbers.length === 0) {
                this.showNotification('No valid phone numbers found in file', 'error');
                return;
            }
            
            if (phoneNumbers.length > 100) {
                this.showNotification('Maximum 100 numbers allowed for guest users', 'error');
                return;
            }
            
            await this.checkBulkNumbers(phoneNumbers);
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showNotification('Error processing file', 'error');
        }
        
        // Reset file input
        event.target.value = '';
    }
    
    async checkBulkNumbers(phoneNumbers) {
        this.showNotification(`Processing ${phoneNumbers.length} phone numbers...`, 'info');
        
        try {
            const result = await this.callAPI('bulk_check', { phone_numbers: phoneNumbers });
            
            if (result.success) {
                this.addResultToTable(result.data.results);
                this.showResultsSection();
                this.showNotification(`Successfully processed ${result.data.total_processed} numbers!`, 'success');
            } else {
                this.showNotification(result.error || 'Failed to process phone numbers', 'error');
            }
        } catch (error) {
            console.error('Error checking bulk numbers:', error);
            this.showNotification('Network error during bulk processing', 'error');
        }
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
        // Extract phone numbers from text
        const lines = text.split(/[\r\n,;]+/);
        const phoneNumbers = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && this.isValidPhoneFormat(trimmed)) {
                phoneNumbers.push(trimmed);
            }
        }
        
        // Remove duplicates
        return [...new Set(phoneNumbers)];
    }
    
    isValidPhoneFormat(number) {
        // Basic phone number validation
        const phoneRegex = /^(\+?[1-9]\d{0,3})?[\s\-\(\)]?([1-9]\d{6,14})$/;
        return phoneRegex.test(number.replace(/[\s\-\(\)]/g, ''));
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }
    
    initializeDataTable() {
        if ($.fn.DataTable) {
            this.resultsTable = $('#resultsTable').DataTable({
                columns: [
                    { title: 'Phone Number', data: 'phone_number.international' },
                    { 
                        title: 'Valid', 
                        data: 'valid',
                        render: function(data) {
                            return data ? '<span class="badge bg-success">Valid</span>' : '<span class="badge bg-danger">Invalid</span>';
                        }
                    },
                    { title: 'Country', data: 'location.country_name' },
                    { title: 'Carrier', data: 'carrier.name' },
                    { title: 'Type', data: 'type.name' },
                    { 
                        title: 'Flag', 
                        data: 'location.flag_emoji',
                        render: function(data) {
                            return `<span style="font-size: 1.5rem;">${data || '🏳️'}</span>`;
                        }
                    }
                ],
                pageLength: 25,
                responsive: true,
                order: [[0, 'asc']],
                language: {
                    search: 'Search:',
                    lengthMenu: 'Show _MENU_ entries',
                    info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                    paginate: {
                        first: 'First',
                        last: 'Last',
                        next: 'Next',
                        previous: 'Previous'
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
            this.showNotification('No data to export', 'error');
            return;
        }
        
        const data = this.resultsTable.data().toArray();
        
        if (data.length === 0) {
            this.showNotification('No data to export', 'error');
            return;
        }
        
        if (format === 'csv') {
            this.exportToCSV(data);
        } else if (format === 'txt') {
            this.exportToTXT(data);
        }
    }
    
    exportToCSV(data) {
        const headers = ['Phone Number', 'Valid', 'Country', 'Carrier', 'Type', 'Flag'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                `"${row.phone_number?.international || ''}"`,
                row.valid ? 'Valid' : 'Invalid',
                `"${row.location?.country_name || ''}"`,
                `"${row.carrier?.name || ''}"`,
                `"${row.type?.name || ''}"`,
                `"${row.location?.flag_emoji || ''}"`
            ].join(','))
        ].join('\\n');
        
        this.downloadFile(csvContent, 'phone-check-results.csv', 'text/csv');
    }
    
    exportToTXT(data) {
        const txtContent = data.map(row => 
            `${row.phone_number?.international || 'N/A'} | ${row.valid ? 'Valid' : 'Invalid'} | ${row.location?.country_name || 'N/A'} | ${row.carrier?.name || 'N/A'} | ${row.type?.name || 'N/A'}`
        ).join('\\n');
        
        this.downloadFile(txtContent, 'phone-check-results.txt', 'text/plain');
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
        
        this.showNotification(`File ${filename} downloaded successfully!`, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize guest checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('guestCheckBtn')) {
        window.guestChecker = new GuestPhoneChecker();
    }
});