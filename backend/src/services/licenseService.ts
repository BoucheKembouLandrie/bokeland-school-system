import { machineId } from 'node-machine-id';
import axios from 'axios';

// License Server URL (could be in .env in production)
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'http://localhost:5005';

export interface LicenseStatus {
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED' | 'NOT_REGISTERED' | 'OFFLINE_VALID' | 'OFFLINE_EXPIRED';
    school_name?: string;
    expiration_date?: Date;
    days_remaining?: number;
    message?: string;
    annual_subscription_rate?: string;
}

// In-memory cache for license status to avoid hitting the server on every request
let cachedLicenseStatus: LicenseStatus | null = null;
let lastCheckTime: number = 0;
const CHECK_INTERVAL = 1000 * 60 * 5; // 5 minutes (reduced from 1 hour for faster sync)

export const getMachineFingerprint = async (): Promise<string> => {
    try {
        const id = await machineId();
        return id;
    } catch (error) {
        console.error('Error generating machine ID:', error);
        return 'unknown-machine-id';
    }
};

import SchoolSettings from '../models/SchoolSettings';

export const checkLicense = async (force: boolean = false): Promise<LicenseStatus> => {
    // 1. Fetch Local Settings
    const settings = await SchoolSettings.findOne();
    const localStatus = settings?.license_status || 'NOT_REGISTERED';
    const localExpiration = settings?.license_expiration_date;

    // 2. Try to connect to Server
    try {
        const fingerPrint = await getMachineFingerprint();
        console.log('Checking license online for:', fingerPrint);

        const payload: any = {
            machine_id: fingerPrint
        };

        if (settings) {
            payload.school_name = settings.school_name;
            payload.email = settings.email;
        }

        const response = await axios.post(`${LICENSE_SERVER_URL}/api/license/check`, payload, { timeout: 5000 });
        const serverData = response.data;

        // SERVER AUTHORITY LOGIC:
        // Always trust the server. If server says expired, it's expired.
        // If server says active with new date, update local.

        if (settings) {
            settings.license_status = serverData.status;
            settings.license_expiration_date = serverData.expiration_date;
            settings.license_check_date = new Date(); // Update sync timestamp
            await settings.save();
            console.log('License synced with server:', serverData.status);
        }

        cachedLicenseStatus = serverData;
        lastCheckTime = Date.now();
        return cachedLicenseStatus as LicenseStatus;

    } catch (error: any) {
        console.warn('License Server unreachable, ensuring offline enforcement:', error.message);

        // OFFLINE LOGIC:
        // Use local settings but ENFORCE expiration strictly

        if (!settings) {
            return { status: 'NOT_REGISTERED', message: 'Pas de licence locale valide trouvé. Connexion internet requise.' };
        }

        if (!settings.license_expiration_date) {
            // New installation without expiration date yet -> Default to TRIAL
            return {
                status: 'TRIAL',
                message: 'Mode Essai - Licence Valide',
                days_remaining: 30
            };
        }

        const now = new Date();
        const expiration = new Date(settings.license_expiration_date);

        // Strict Offline Check
        if (now > expiration) {
            return {
                status: 'EXPIRED',
                expiration_date: expiration,
                days_remaining: 0,
                message: 'Licence expirée (Mode Hors Ligne). Veuillez vous connecter pour renouveler.'
            };
        }

        // Valid Offline Session
        const daysRemaining = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
            status: settings.license_status as any || 'ACTIVE',
            expiration_date: expiration,
            days_remaining: daysRemaining,
            message: 'Mode Hors Ligne - Licence Valide'
        };
    }
};

export const activateLicense = async (schoolName: string, email: string) => {
    try {
        const fingerPrint = await getMachineFingerprint();
        const response = await axios.post(`${LICENSE_SERVER_URL}/api/license/activate`, {
            machine_id: fingerPrint,
            school_name: schoolName,
            email: email
        });

        // Force refresh cache
        return await checkLicense(true);
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Activation failed');
    }
};

export const initiatePayment = async (amount: number, phoneNumber: string) => {
    try {
        const fingerPrint = await getMachineFingerprint();
        const response = await axios.post(`${LICENSE_SERVER_URL}/api/license/pay`, {
            machine_id: fingerPrint,
            amount: amount,
            phone_number: phoneNumber
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Payment initiation failed');
    }
};

export const getCachedLicenseStatus = () => cachedLicenseStatus;
