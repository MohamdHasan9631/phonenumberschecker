#!/usr/bin/env python3
"""
Simple Telegram Bot Simulator for Phone Number Checker
This simulates sending activation codes via Telegram
"""

import json
import sys
import time
import logging
from datetime import datetime

class TelegramBotSimulator:
    def __init__(self):
        self.log_file = 'data/telegram_bot.log'
        self.setup_logging()
    
    def setup_logging(self):
        """Setup logging for bot activities"""
        logging.basicConfig(
            filename=self.log_file,
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
    
    def send_activation_code(self, telegram_username, activation_code, expires_in=30):
        """
        Simulate sending activation code via Telegram
        
        Args:
            telegram_username (str): Telegram username
            activation_code (str): 6-digit activation code
            expires_in (int): Expiry time in seconds
        
        Returns:
            dict: Result of the operation
        """
        try:
            # Log the activation attempt
            logging.info(f"Sending activation code to @{telegram_username}: {activation_code}")
            
            # Simulate message sending
            message = {
                'chat_id': f'@{telegram_username}',
                'text': f'''🔐 رمز تفعيل حساب فاحص أرقام الهواتف

رمز التفعيل: {activation_code}

⏰ صالح لمدة {expires_in} ثانية فقط
🔒 لا تشارك هذا الرمز مع أي شخص

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.''',
                'timestamp': datetime.now().isoformat(),
                'expires_at': datetime.fromtimestamp(time.time() + expires_in).isoformat()
            }
            
            # Save to log file for testing
            with open('data/telegram_messages.json', 'a') as f:
                f.write(json.dumps(message, ensure_ascii=False) + '\n')
            
            # Print to console for debugging
            print(f"📱 Telegram Message Sent to @{telegram_username}:")
            print(f"🔐 Activation Code: {activation_code}")
            print(f"⏰ Expires in: {expires_in} seconds")
            print(f"📝 Full message logged to: {self.log_file}")
            
            return {
                'success': True,
                'message_id': int(time.time()),
                'chat_id': f'@{telegram_username}',
                'sent_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Failed to send activation code to @{telegram_username}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def send_notification(self, telegram_username, title, message):
        """
        Send notification to user
        
        Args:
            telegram_username (str): Telegram username
            title (str): Notification title
            message (str): Notification message
        
        Returns:
            dict: Result of the operation
        """
        try:
            notification = {
                'chat_id': f'@{telegram_username}',
                'text': f'''📢 {title}

{message}

🌐 فاحص أرقام الهواتف
⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}''',
                'timestamp': datetime.now().isoformat(),
                'type': 'notification'
            }
            
            # Save to log file
            with open('data/telegram_messages.json', 'a') as f:
                f.write(json.dumps(notification, ensure_ascii=False) + '\n')
            
            logging.info(f"Notification sent to @{telegram_username}: {title}")
            
            return {
                'success': True,
                'message_id': int(time.time()),
                'chat_id': f'@{telegram_username}',
                'sent_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Failed to send notification to @{telegram_username}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

def main():
    """Command line interface for the bot simulator"""
    if len(sys.argv) < 3:
        print("Usage: python3 telegram_bot.py <action> <username> [code/title] [message]")
        print("Actions: activate, notify")
        print("Examples:")
        print("  python3 telegram_bot.py activate john_doe 123456")
        print("  python3 telegram_bot.py notify john_doe 'Bulk Check Complete' 'Your request has been processed'")
        sys.exit(1)
    
    action = sys.argv[1]
    username = sys.argv[2]
    
    bot = TelegramBotSimulator()
    
    if action == 'activate' and len(sys.argv) >= 4:
        code = sys.argv[3]
        result = bot.send_activation_code(username, code)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    elif action == 'notify' and len(sys.argv) >= 5:
        title = sys.argv[3]
        message = sys.argv[4]
        result = bot.send_notification(username, title, message)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    else:
        print("Invalid arguments")
        sys.exit(1)

if __name__ == '__main__':
    main()