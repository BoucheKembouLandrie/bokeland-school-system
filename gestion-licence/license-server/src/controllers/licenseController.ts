import { Request, Response } from 'express';
import { Client } from '../models/Client';
import { Payment } from '../models/Payment';
import { Config } from '../models/Config';
import * as campayService from '../services/campayService';
import { Op } from 'sequelize';

export const checkLicense = async (req: Request, res: Response) => {
    try {
        const { machine_id, school_name, email, phone, address, city, country } = req.body;

        console.log('Check License Request:', { machine_id, school_name, has_phone: !!phone, has_address: !!address });

        if (!machine_id) {
            res.status(400).json({ error: 'Machine ID is required' });
            return;
        }

        let client = await Client.findOne({ where: { machine_id } });

        if (!client) {
            // Auto-register: if school_name + email are provided, create a TRIAL client automatically
            if (school_name && email) {
                console.log(`Auto-registering new client: ${school_name} (${machine_id})`);
                const now = new Date();
                const trialEnd = new Date();
                trialEnd.setDate(now.getDate() + 33); // 33 days trial

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
                    last_checkin: now
                });

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
        if (country) client.country = country;

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
        const { machine_id, school_name, email, phone, address, city, country } = req.body;

        console.log('Activate Trial Request:', { machine_id, school_name, email, phone, address });

        if (!machine_id || !school_name || !email) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Check if already exists
        let client = await Client.findOne({ where: { machine_id } });

        if (client) {
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

        // Create new trial
        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(now.getDate() + 33); // 33 days trial

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
            last_checkin: now
        });

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

export const initiateClientPayment = async (req: Request, res: Response) => {
    try {
        const { machine_id, amount, phone_number } = req.body;

        if (!machine_id) {
            return res.status(400).json({ error: 'Machine ID is required' });
        }

        const client = await Client.findOne({ where: { machine_id } });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const externalReference = `PAY-${Date.now()}-${client.id}`;
        const description = `Abonnement Leuana School - 444 Jours`;

        // Fetch current configured rate
        const config = await Config.findByPk('annual_subscription_rate');
        const configuredRate = config ? parseFloat(config.value) : 144400;

        // Use configured rate, ignore client-provided amount to ensure security and sync
        const paymentAmount = configuredRate;

        // 1. Create Pending Payment Record
        const payment = await Payment.create({
            client_id: client.id,
            amount: paymentAmount,
            payment_method: 'campay',
            status: 'pending',
            external_reference: externalReference,
            days_added: 444,
            payment_date: new Date()
        });

        // 2. Call CamPay API
        const campayResponse = await campayService.initiatePayment(
            paymentAmount,
            phone_number || client.phone || '237000000000',
            description,
            externalReference
        );

        // 3. Update with transaction reference
        if (campayResponse && campayResponse.reference) {
            payment.transaction_id = campayResponse.reference;
            await payment.save();
        }

        res.json({
            success: true,
            message: 'Payment initiated',
            payment_token: campayResponse.token,
            reference: campayResponse.reference,
            ussd_code: campayResponse.ussd_code
        });

    } catch (error: any) {
        console.error('Initiate Client Payment Error', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};
