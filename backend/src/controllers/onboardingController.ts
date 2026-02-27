import { Request, Response } from 'express';
import { machineId } from 'node-machine-id';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SchoolSettings from '../models/SchoolSettings';
import SchoolYear from '../models/SchoolYear';
import User from '../models/User';
import { sendWelcomeEmail } from '../services/emailService';

const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'http://localhost:5005';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Register or Update Client on License Server
 */
async function registerToLicenseServer(settings: any): Promise<void> {
    try {
        const mId = await machineId();
        const response = await axios.post(`${LICENSE_SERVER_URL}/api/license/activate`, {
            machine_id: mId,
            school_name: settings.school_name,
            email: settings.email,
            phone: `${settings.country_code || ''} ${settings.phone}`,
            country: settings.country,
            address: settings.address,
            city: '', // Optional
        }, { timeout: 5000 });

        console.log('✓ School registered/synced with License Server:', response.data.message);
    } catch (error: any) {
        console.warn('Could not register with license server:', error.message);
        // Do not block onboarding on license failure
    }
}

/**
 * Check if license is already registered in License Admin Dashboard
 */
async function checkLicenseRegistration(licenseKey: string): Promise<boolean> {
    try {
        const response = await axios.get(`${LICENSE_SERVER_URL}/api/license/check/${licenseKey}`, {
            timeout: 5000,
        });
        return response.data.exists || false;
    } catch (error) {
        console.warn('Could not check license registration:', error);
        // In case of error, assume false to allow offline onboarding
        return false;
    }
}

/**
 * Sync school information to License Admin Dashboard
 */
async function syncToLicenseServer(settings: any, licenseKey: string): Promise<void> {
    try {
        await axios.post(`${LICENSE_SERVER_URL}/api/license/update-client-info`, {
            license_key: licenseKey,
            school_name: settings.school_name,
            email: settings.email,
            phone: settings.phone,
            country_code: settings.country_code,
            country: settings.country,
            language: settings.language,
        }, {
            timeout: 5000,
        });
        console.log('✓ School information synced to License Admin Dashboard');
    } catch (error) {
        console.warn('Could not sync to license server:', error);
        // Don't fail onboarding if sync fails - data is saved locally
    }
}

/**
 * Complete onboarding process
 * POST /api/onboarding/complete
 */
export const completeOnboarding = async (req: Request, res: Response) => {
    try {
        const {
            school_name,
            email,
            phone,
            country_code,
            country,
            address,
            language,
            school_year, // New field
        } = req.body;

        // Validate required fields
        if (!school_name || !email || !phone || !country_code || !country || !language) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        // Validate language
        if (language !== 'fr' && language !== 'en') {
            return res.status(400).json({
                message: 'Invalid language. Must be "fr" or "en"',
            });
        }

        // PROTECTION: Block onboarding in development mode
        if (isDevelopment) {
            console.warn('⚠️  ONBOARDING SIMULATION: Allowing onboarding in development mode as requested.');
            // Protection bypassed for simulation
        }

        // DEBUG LOGGING
        const fs = require('fs');
        const appendLog = (msg: string) => fs.appendFileSync('debug_onboarding.log', `${new Date().toISOString()} - ${msg}\n`);

        appendLog('Onboarding request received');

        // Get current settings to check license key
        appendLog('Attempting to find existing settings...');
        let existingSettings;
        try {
            existingSettings = await SchoolSettings.findOne();
            appendLog(`Existing settings found: ${existingSettings ? 'yes' : 'no'}`);
        } catch (dbError: any) {
            appendLog(`DB Error in findOne: ${dbError.message} - ${dbError.stack}`);
            throw dbError;
        }

        // PROTECTION: Check if license is already registered
        if (existingSettings?.license_status && existingSettings.license_status !== 'NOT_REGISTERED') {
            const licenseKey = process.env.LICENSE_KEY || '';

            if (licenseKey) {
                const isRegistered = await checkLicenseRegistration(licenseKey);

                if (isRegistered) {
                    console.warn('⚠️  ONBOARDING BLOCKED: License already registered in License Admin Dashboard');
                    return res.status(409).json({
                        message: 'This license is already registered. Contact support if you need to update your information.',
                        alreadyRegistered: true,
                    });
                }
            }
        }

        // Set date format based on language
        const date_format = language === 'en' ? 'MM-DD-YYYY' : 'DD-MM-YYYY';

        // Get or create settings
        let settings = await SchoolSettings.findOne();

        if (!settings) {
            settings = await SchoolSettings.create({
                school_name,
                email,
                phone,
                country_code,
                country,
                address,
                language,
                date_format,
                is_onboarding_complete: true,
                logo_url: '/default-logo.png'
            });
        } else {
            await settings.update({
                school_name,
                email,
                phone,
                country_code,
                country,
                address,
                language,
                date_format,
                is_onboarding_complete: true,
                logo_url: '/default-logo.png'
            });
        }

        // Initialize School Year
        if (school_year) {
            const match = school_year.match(/^(\d{4})-(\d{4})$/);
            if (match) {
                const startYear = parseInt(match[1]);
                const endYear = parseInt(match[2]);

                await SchoolYear.destroy({ where: {} }); // Clear existing for fresh install simulation

                const newYear = await SchoolYear.create({
                    name: school_year,
                    startYear: startYear,  // camelCase
                    endYear: endYear,      // camelCase
                    isActive: true         // camelCase
                });
            }
        }

        // CREATE DEFAULT ADMIN USER if not exists
        let user = await User.findOne({ where: { username: 'admin' } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            user = await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                email: email,
                is_default: true
            });
            console.log('✅ Default admin user created');
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        // Sync to license server (with duplicate check)
        const licenseKey = process.env.LICENSE_KEY || '';
        if (licenseKey) {
            await syncToLicenseServer(settings, licenseKey);
        }

        // Always try to register/update machine info
        await registerToLicenseServer(settings);

        // Send Welcome Email
        if (email) {
            await sendWelcomeEmail(email, school_name, user.username);
        }

        res.json({
            message: 'Onboarding completed successfully',
            settings,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                is_default: user.is_default,
                permissions: user.permissions
            }
        });
    } catch (error: any) {
        console.error('Onboarding error:', error);

        // Log to file for debugging
        try {
            const fs = require('fs');
            const logMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
            fs.appendFileSync('error.log', logMessage);
        } catch (fsError) {
            console.error('Failed to write to error log:', fsError);
        }

        res.status(500).json({
            message: 'Failed to complete onboarding',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Check onboarding status
 * GET /api/onboarding/status
 */
export const getOnboardingStatus = async (req: Request, res: Response) => {
    try {
        const settings = await SchoolSettings.findOne();

        res.json({
            is_onboarding_complete: settings?.is_onboarding_complete || false,
            has_settings: !!settings,
            // Expose dev mode status so frontend can show appropriate message/handling
            is_development: isDevelopment
        });
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        res.status(500).json({
            message: 'Failed to check onboarding status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
