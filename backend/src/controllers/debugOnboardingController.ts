import { Request, Response } from 'express';
import SchoolSettings from '../models/SchoolSettings';

export const debugOnboarding = async (req: Request, res: Response) => {
    console.log('=== DEBUG ONBOARDING REQUEST ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    try {
        const {
            school_name,
            email,
            phone,
            country_code,
            country,
            address,
            language,
        } = req.body;

        console.log('Received fields:');
        console.log('  - school_name:', school_name);
        console.log('  - email:', email);
        console.log('  - phone:', phone);
        console.log('  - country_code:', country_code);
        console.log('  - country:', country);
        console.log('  - language:', language);

        // Validate required fields
        if (!school_name || !email || !phone || !country_code || !country || !language) {
            const missing = [];
            if (!school_name) missing.push('school_name');
            if (!email) missing.push('email');
            if (!phone) missing.push('phone');
            if (!country_code) missing.push('country_code');
            if (!country) missing.push('country');
            if (!language) missing.push('language');

            console.log('❌ Missing required fields:', missing);
            return res.status(400).json({
                message: 'Missing required fields: ' + missing.join(', '),
                missing_fields: missing
            });
        }

        console.log('✅ All required fields present');

        // Set date format based on language
        const date_format = language === 'en' ? 'mm/dd/yyyy' : 'dd/mm/yyyy';

        console.log('Creating settings with data:');
        console.log({
            school_name,
            email,
            phone,
            country_code,
            country,
            address: address || '',
            language,
            date_format,
            is_onboarding_complete: true,
            logo_url: ''
        });

        // Create settings
        const settings = await SchoolSettings.create({
            school_name,
            email,
            phone,
            country_code,
            country,
            address: address || '',
            language,
            date_format,
            is_onboarding_complete: true,
            logo_url: ''
        });

        console.log('✅ Settings created successfully with ID:', settings.id);
        console.log('=== DEBUG ONBOARDING SUCCESS ===');

        res.json({
            success: true,
            message: 'Debug onboarding completed successfully',
            settings: {
                id: settings.id,
                school_name: settings.school_name,
                email: settings.email
            }
        });

    } catch (error: any) {
        console.error('❌ DEBUG ONBOARDING ERROR:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
        if (error.original) {
            console.error('Original error:', error.original);
        }

        res.status(500).json({
            message: 'Debug onboarding failed',
            error: error.message,
            error_name: error.name,
            stack: error.stack
        });
    }
};
