#!/usr/bin/env python3
"""
Phone Number Validation Script using libphonenumbers
This script provides phone number validation, country detection, and carrier information
"""

import json
import sys
import phonenumbers
from phonenumbers import carrier, geocoder, timezone
from phonenumbers.phonenumberutil import number_type, PhoneNumberType
import argparse

class PhoneNumberValidator:
    def __init__(self):
        self.supported_regions = [
            'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 
            'EG', 'MA', 'TN', 'DZ', 'LY', 'US', 'GB', 'FR', 'DE', 'IT'
        ]
    
    def validate_phone_number(self, phone_number, default_region=None):
        """
        Validate and get information about a phone number
        
        Args:
            phone_number (str): The phone number to validate
            default_region (str): Default region code if number doesn't include country code
            
        Returns:
            dict: Validation results and phone number information
        """
        try:
            # Parse the phone number
            if default_region:
                parsed_number = phonenumbers.parse(phone_number, default_region)
            else:
                parsed_number = phonenumbers.parse(phone_number, None)
            
            # Basic validation
            is_valid = phonenumbers.is_valid_number(parsed_number)
            is_possible = phonenumbers.is_possible_number(parsed_number)
            
            # Get number information
            country_code = parsed_number.country_code
            national_number = parsed_number.national_number
            
            # Format the number
            international_format = phonenumbers.format_number(
                parsed_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL
            )
            national_format = phonenumbers.format_number(
                parsed_number, phonenumbers.PhoneNumberFormat.NATIONAL
            )
            e164_format = phonenumbers.format_number(
                parsed_number, phonenumbers.PhoneNumberFormat.E164
            )
            
            # Get location information
            country_name = geocoder.description_for_number(parsed_number, "en")
            country_name_ar = geocoder.description_for_number(parsed_number, "ar")
            region_code = geocoder.region_code_for_number(parsed_number)
            
            # Get carrier information
            carrier_name = carrier.name_for_number(parsed_number, "en")
            carrier_name_ar = carrier.name_for_number(parsed_number, "ar")
            
            # Get number type
            phone_type = number_type(parsed_number)
            type_name = self._get_phone_type_name(phone_type)
            
            # Get timezone
            timezones = timezone.time_zones_for_number(parsed_number)
            
            # Country flag emoji
            flag_emoji = self._get_country_flag(region_code)
            
            return {
                'success': True,
                'valid': is_valid,
                'possible': is_possible,
                'phone_number': {
                    'original': phone_number,
                    'international': international_format,
                    'national': national_format,
                    'e164': e164_format,
                    'country_code': country_code,
                    'national_number': str(national_number)
                },
                'location': {
                    'country_name': country_name,
                    'country_name_ar': country_name_ar if country_name_ar else country_name,
                    'region_code': region_code,
                    'flag_emoji': flag_emoji
                },
                'carrier': {
                    'name': carrier_name if carrier_name else 'Unknown',
                    'name_ar': carrier_name_ar if carrier_name_ar else carrier_name
                },
                'type': {
                    'code': phone_type,
                    'name': type_name
                },
                'timezones': list(timezones) if timezones else []
            }
            
        except phonenumbers.NumberParseException as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': e.error_type,
                'phone_number': {'original': phone_number}
            }
        except Exception as e:
            return {
                'success': False,
                'error': f"Unexpected error: {str(e)}",
                'phone_number': {'original': phone_number}
            }
    
    def _get_phone_type_name(self, phone_type):
        """Get human-readable phone type name"""
        type_mapping = {
            PhoneNumberType.FIXED_LINE: 'Fixed Line',
            PhoneNumberType.MOBILE: 'Mobile',
            PhoneNumberType.FIXED_LINE_OR_MOBILE: 'Fixed Line or Mobile',
            PhoneNumberType.TOLL_FREE: 'Toll Free',
            PhoneNumberType.PREMIUM_RATE: 'Premium Rate',
            PhoneNumberType.SHARED_COST: 'Shared Cost',
            PhoneNumberType.VOIP: 'VoIP',
            PhoneNumberType.PERSONAL_NUMBER: 'Personal Number',
            PhoneNumberType.PAGER: 'Pager',
            PhoneNumberType.UAN: 'UAN',
            PhoneNumberType.VOICEMAIL: 'Voicemail',
            PhoneNumberType.UNKNOWN: 'Unknown'
        }
        return type_mapping.get(phone_type, 'Unknown')
    
    def _get_country_flag(self, region_code):
        """Get flag emoji for country code"""
        if not region_code or len(region_code) != 2:
            return '🏳️'
        
        # Convert country code to flag emoji
        flag_emoji = ''.join(chr(ord(c) + 127397) for c in region_code.upper())
        return flag_emoji
    
    def validate_bulk(self, phone_numbers, default_region=None):
        """
        Validate multiple phone numbers
        
        Args:
            phone_numbers (list): List of phone numbers to validate
            default_region (str): Default region code
            
        Returns:
            list: List of validation results
        """
        results = []
        for phone_number in phone_numbers:
            result = self.validate_phone_number(phone_number.strip(), default_region)
            results.append(result)
        
        return results

def main():
    parser = argparse.ArgumentParser(description='Validate phone numbers using libphonenumbers')
    parser.add_argument('phone_number', help='Phone number to validate')
    parser.add_argument('--region', help='Default region code (e.g., SA, US)')
    parser.add_argument('--bulk', action='store_true', help='Treat input as comma-separated list')
    parser.add_argument('--format', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    validator = PhoneNumberValidator()
    
    if args.bulk:
        phone_numbers = [num.strip() for num in args.phone_number.split(',')]
        results = validator.validate_bulk(phone_numbers, args.region)
    else:
        results = validator.validate_phone_number(args.phone_number, args.region)
    
    if args.format == 'json':
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        if args.bulk:
            for result in results:
                print(f"Number: {result['phone_number']['original']}")
                print(f"Valid: {'Yes' if result.get('valid', False) else 'No'}")
                if result.get('success'):
                    print(f"Country: {result['location']['country_name']}")
                    print(f"Carrier: {result['carrier']['name']}")
                print("-" * 40)
        else:
            print(f"Number: {results['phone_number']['original']}")
            print(f"Valid: {'Yes' if results.get('valid', False) else 'No'}")
            if results.get('success'):
                print(f"Country: {results['location']['country_name']}")
                print(f"Carrier: {results['carrier']['name']}")

if __name__ == '__main__':
    main()