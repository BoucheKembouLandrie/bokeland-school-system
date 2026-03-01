import { Request, Response, NextFunction } from 'express';
import { getCachedLicenseStatus, checkLicense } from '../services/licenseService';

export const licenseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Skip license check for activation route and static files
    console.log(`[LicenseMiddleware] Checking request: ${req.method} ${req.path}`);
    if (req.path === '/api/license/activate' ||
        req.path === '/api/license/status' ||
        req.path.startsWith('/uploads') ||
        req.path.startsWith('/api/onboarding') ||
        req.path === '/api/settings') {
        console.log(`[LicenseMiddleware] Exempted path: ${req.path}`);
        return next();
    }

    try {
        // Always call checkLicense which now handles: Local Cache, Server Sync, and Offline Logic internally
        let status = await checkLicense(); // No params needed, service manages optimization

        if (!status) {
            console.warn('[License Middleware] License service returned null, allowing request to proceed');
            return next(); // Allow request to proceed if license check fails
        }

        // Add license headers for frontend notifications
        if (status.days_remaining !== undefined) {
            res.setHeader('X-Days-Remaining', status.days_remaining.toString());
        }
        if (status.annual_subscription_rate) {
            res.setHeader('X-Subscription-Rate', status.annual_subscription_rate.toString());
        }

        // Blocking Conditions
        if (status.status === 'EXPIRED') {
            res.status(403).json({
                code: 'LICENSE_EXPIRED',
                message: 'Votre période d\'essai ou abonnement est expiré. Veuillez renouveler.',
                expiration_date: status.expiration_date
            });
            return;
        }

        if (status.status === 'BANNED') {
            res.status(403).json({
                code: 'LICENSE_BANNED',
                message: 'Cette licence a été bloquée. Contactez le support.'
            });
            return;
        }

        // NOT_REGISTERED should probably block everything except setup/activation
        if (status.status === 'NOT_REGISTERED') {
            res.status(403).json({
                code: 'LICENSE_NOT_ACTIVATED',
                message: 'Application non activée. Configuration requise.'
            });
            return;
        }

        next();
    } catch (error) {
        // CRITICAL: Don't block the application if license check fails
        console.error('[License Middleware] Error checking license, allowing request to proceed:', error);
        next(); // Allow the request to continue even if license check fails
    }
};

