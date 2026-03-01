import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Student from '../models/Student';
import Class from '../models/Class';
import SchoolYear from '../models/SchoolYear';

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.findAll({ include: [{ model: Student, as: 'student' }] });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByPk(req.params.id, { include: [{ model: Student, as: 'student' }] });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getPaymentsByStudent = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.findAll({ where: { eleve_id: req.params.studentId } });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { eleve_id, montant } = req.body;

        // 1. Get Student and their Class to find the Pension
        const student = await Student.findByPk(eleve_id, {
            include: [{ model: Class, as: 'class' }]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // @ts-ignore
        const pension = student.class?.pension || 0;

        // 2. Calculate total previously paid by the student
        const previousPayments = await Payment.findAll({
            where: { eleve_id }
        });

        const totalPaid = previousPayments.reduce((sum, p) => sum + p.montant, 0);

        // 3. Calculate new remaining balance
        const newTotalPaid = totalPaid + Number(montant);
        const reste = Math.max(0, Number(pension) - newTotalPaid);

        // Determine school_year_id from student's class OR active school year
        // @ts-ignore
        let school_year_id = student.class?.school_year_id;

        if (!school_year_id) {
            const activeYear = await SchoolYear.findOne({ where: { is_active: true } });
            if (activeYear) {
                school_year_id = activeYear.id;
            }
        }

        // Fallback: If still no ID, try to find the latest
        if (!school_year_id) {
            const latestYear = await SchoolYear.findOne({ order: [['end_year', 'DESC']] });
            if (latestYear) {
                school_year_id = latestYear.id;
            }
        }

        if (!school_year_id) {
            return res.status(400).json({ message: 'Impossible de déterminer l\'année scolaire (aucune année active trouvée).' });
        }

        // 4. Create the payment with the calculated reste
        const payment = await Payment.create({
            ...req.body,
            school_year_id,
            reste
        });

        res.status(201).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        await payment.update(req.body);
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        await payment.destroy();
        res.json({ message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
