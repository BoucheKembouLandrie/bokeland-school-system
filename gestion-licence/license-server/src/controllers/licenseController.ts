import { Request, Response } from 'express';
import { Client } from '../models/Client';
import { Payment } from '../models/Payment';
import { Config } from '../models/Config';
import { Affiliate } from '../models/Affiliate';
import { Op } from 'sequelize';

const CURRENCY_COUNTRY_MAP: Record<string, string> = {
    CM: 'XAF', GA: 'XAF', CG: 'XAF', CF: 'XAF', TD: 'XAF', GQ: 'XAF',
    SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', BJ: 'XOF', TG: 'XOF', NE: 'XOF', GW: 'XOF',
    GN: 'GNF',
    CD: 'CDF',
    BI: 'BIF',
    KM: 'KMF',
    DJ: 'DJF',
    SC: 'SCR'
};

export function getCurrencyForCountry(countryCode?: string): string {
    if (!countryCode) return 'XAF';
    const cleanCode = countryCode.trim().toUpperCase();
    return CURRENCY_COUNTRY_MAP[cleanCode] || 'XAF';
}


export const checkLicense = async (req: Request, res: Response) => {
    try {
        const { machine_id, school_name, email, phone, address, city, country, affiliate_email } = req.body;

        console.log('Check License Request:', { machine_id, school_name, has_phone: !!phone, has_address: !!address, affiliate_email });

        if (!machine_id) {
            res.status(400).json({ error: 'Machine ID is required' });
            return;
        }

        let client = await Client.findOne({ where: { machine_id } });

        if (!client) {
            // Auto-register: if school_name + email are provided, create a TRIAL client automatically
            if (school_name && email) {
                console.log(`Auto-registering new client: ${school_name} (${machine_id})`);
                
                // Process Affiliate (Sponsor)
                let affiliateId: number | null = null;
                if (affiliate_email) {
                    const normalizedAffiliateEmail = affiliate_email.trim().toLowerCase();
                    if (normalizedAffiliateEmail !== email.trim().toLowerCase()) { // Prevent self-referral
                        let affiliate = await Affiliate.findOne({ where: { email: normalizedAffiliateEmail } });
                        if (!affiliate) {
                            affiliate = await Affiliate.create({
                                email: normalizedAffiliateEmail,
                                status: 'GHOST',
                                balance: 0
                            });
                            console.log(`[Affiliate] Created GHOST account for ${normalizedAffiliateEmail}`);
                        }
                        affiliateId = affiliate.id;
                    }
                }

                const now = new Date();
                const trialEnd = new Date();
                trialEnd.setDate(now.getDate() + 33); // 33 days trial

                try {
                    client = await Client.create({
                        machine_id,
                        school_name,
                        email,
                        phone: phone || null,
                        address: address || null,
                        city: city || null,
                        country: country || null,
                        trial_start_date: now,
                        subscription_end_date: trialEnd,
                        status: 'TRIAL',
                        last_checkin: now,
                        affiliate_id: affiliateId || undefined,
                        currency: getCurrencyForCountry(country)
                    });
                } catch (createErr: any) {
                    if (createErr.name === 'SequelizeUniqueConstraintError') {
                        client = await Client.findOne({ where: { machine_id } });
                        if (!client) throw createErr;
                        console.log(`[Concurrent Check] Client ${machine_id} was created by another request.`);
                    } else {
                        throw createErr;
                    }
                }

                const config = await Config.findByPk('annual_subscription_rate');
                const subscriptionRate = config ? config.value : '144000';

                res.status(201).json({
                    status: 'TRIAL',
                    school_name: client.school_name,
                    expiration_date: client.subscription_end_date,
                    days_remaining: 33,
                    annual_subscription_rate: subscriptionRate,
                    message: 'Client auto-registered as TRIAL'
                });
                return;
            }

            res.status(404).json({ status: 'NOT_REGISTERED', message: 'Client not found. Please activate your license.' });
            return;
        }

        // Update Client Info if provided
        if (school_name) client.school_name = school_name;
        if (email) client.email = email;
        if (phone) client.phone = phone;
        if (address) client.address = address;
        if (city) client.city = city;
        if (country) {
            client.country = country;
            client.currency = getCurrencyForCountry(country);
        }

        // Update last checkin
        client.last_checkin = new Date();


        const now = new Date();
        const expirationDate = new Date(client.subscription_end_date);

        if (now > expirationDate) {
            client.status = 'EXPIRED';
            await client.save();
            res.json({
                code: 'LICENSE_EXPIRED',
                status: 'EXPIRED',
                expiration_date: client.subscription_end_date,
                message: 'License expired. Please renew.'
            });
            return;
        }

        await client.save();

        const config = await Config.findByPk('annual_subscription_rate');
        const subscriptionRate = config ? config.value : '144000';

        res.json({
            status: client.status,
            school_name: client.school_name,
            expiration_date: client.subscription_end_date,
            days_remaining: Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            annual_subscription_rate: subscriptionRate
        });

    } catch (error) {
        console.error('Check license error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const activateTrial = async (req: Request, res: Response) => {
    try {
        const { machine_id, school_name, email, phone, address, city, country, affiliate_email } = req.body;

        console.log('Activate Trial Request:', { machine_id, school_name, email, phone, address, affiliate_email });

        if (!machine_id || !school_name || !email) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Check if already exists
        let client = await Client.findOne({ where: { machine_id } });

        if (client) {
            // FIX: If the client was auto-registered by /check milliseconds ago,
            // it won't have an affiliate_id. Set it now.
            if (!client.affiliate_id && affiliate_email) {
                const normalizedAffiliateEmail = affiliate_email.trim().toLowerCase();
                const normalizedClientEmail = (email || client.email || '').trim().toLowerCase();
                if (normalizedAffiliateEmail !== normalizedClientEmail) { // Prevent self-referral
                    let affiliate = await Affiliate.findOne({ where: { email: normalizedAffiliateEmail } });
                    if (!affiliate) {
                        affiliate = await Affiliate.create({
                            email: normalizedAffiliateEmail,
                            status: 'GHOST',
                            balance: 0
                        });
                        console.log(`[Affiliate] Created GHOST account for ${normalizedAffiliateEmail}`);
                    }
                    client.affiliate_id = affiliate.id;
                    await client.save();
                    console.log(`[Affiliate] Retroactively linked affiliate ${normalizedAffiliateEmail} to client ${client.school_name}`);
                }
            }

            res.json({
                message: 'Client already registered',
                client: {
                    school_name: client.school_name,
                    status: client.status,
                    expiration_date: client.subscription_end_date
                }
            });
            return;
        }

        // Process Affiliate (Sponsor)
        let affiliateId: number | null = null;
        if (affiliate_email) {
            const normalizedAffiliateEmail = affiliate_email.trim().toLowerCase();
            if (normalizedAffiliateEmail !== email.trim().toLowerCase()) { // Prevent self-referral
                let affiliate = await Affiliate.findOne({ where: { email: normalizedAffiliateEmail } });
                if (!affiliate) {
                    affiliate = await Affiliate.create({
                        email: normalizedAffiliateEmail,
                        status: 'GHOST',
                        balance: 0
                    });
                    console.log(`[Affiliate] Created GHOST account for ${normalizedAffiliateEmail}`);
                }
                affiliateId = affiliate.id;
            }
        }

        // Create new trial
        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(now.getDate() + 33); // 33 days trial

        try {
            client = await Client.create({
                machine_id,
                school_name,
                email,
                phone,
                address,
                city,
                country,
                trial_start_date: now,
                subscription_end_date: trialEnd,
                status: 'TRIAL',
                last_checkin: now,
                affiliate_id: affiliateId || undefined,
                currency: getCurrencyForCountry(country)
            });
        } catch (createErr: any) {
            if (createErr.name === 'SequelizeUniqueConstraintError') {
                client = await Client.findOne({ where: { machine_id } });
                if (client) {
                    // FIX: If the client was auto-registered by /check milliseconds ago,
                    // it won't have an affiliate_id. Set it now.
                    if (!client.affiliate_id && affiliate_email) {
                        const normalizedAffiliateEmail = affiliate_email.trim().toLowerCase();
                        const normalizedClientEmail = (email || client.email || '').trim().toLowerCase();
                        if (normalizedAffiliateEmail !== normalizedClientEmail) { // Prevent self-referral
                            let affiliate = await Affiliate.findOne({ where: { email: normalizedAffiliateEmail } });
                            if (!affiliate) {
                                affiliate = await Affiliate.create({
                                    email: normalizedAffiliateEmail,
                                    status: 'GHOST',
                                    balance: 0
                                });
                                console.log(`[Affiliate] Created GHOST account for ${normalizedAffiliateEmail}`);
                            }
                            client.affiliate_id = affiliate.id;
                            await client.save();
                            console.log(`[Affiliate] Retroactively linked affiliate ${normalizedAffiliateEmail} to client ${client.school_name}`);
                        }
                    }
                    res.status(201).json({
                        message: 'Trial activated successfully (recovered from race condition)',
                        client: {
                            id: client.id,
                            school_name: client.school_name,
                            status: client.status,
                            expiration_date: client.subscription_end_date
                        }
                    });
                    return;
                }
            }
            throw createErr;
        }

        res.status(201).json({
            message: 'Trial activated successfully',
            client: {
                id: client.id,
                school_name: client.school_name,
                status: client.status,
                expiration_date: client.subscription_end_date
            }
        });

    } catch (error) {
        console.error('Activate trial error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const extendSubscription = async (req: Request, res: Response) => {
    // This would typically be called by a payment webhook or admin dashboard
    try {
        const { machine_id, days } = req.body;

        const client = await Client.findOne({ where: { machine_id } });
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        const currentEnd = new Date(client.subscription_end_date);
        const now = new Date();

        // If expired, start from now. If active, extend from current end date.
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEnd = new Date(baseDate);
        newEnd.setDate(newEnd.getDate() + (days || 444)); // Default 444 days

        client.subscription_end_date = newEnd;
        client.status = 'ACTIVE';
        await client.save();

        res.json({
            message: 'Subscription extended',
            new_expiration_date: client.subscription_end_date
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// NOTE: Payment initiation is handled by paymentController via POST /api/license/payments/initiate
// This legacy route now redirects callers to the correct Swychr-based endpoint.
export const initiateClientPayment = async (req: Request, res: Response) => {
    return res.status(308).json({
        error: 'This endpoint is deprecated. Use POST /api/license/payments/initiate with { machine_id, currency, phone, payment_method, amount } instead.',
        redirect: '/api/license/payments/initiate'
    });
};
