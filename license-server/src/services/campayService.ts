import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Token ${process.env.CAMPAY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

export const initiatePayment = async (amount: number, phoneNumber: string, description: string, externalReference: string) => {
    try {
        const response = await apiClient.post('/collect/', {
            amount: amount.toString(),
            currency: 'XAF',
            from: phoneNumber,
            description: description,
            external_reference: externalReference
        });
        return response.data;
    } catch (error: any) {
        console.error('CamPay Initiate Error:', error.response?.data || error.message);
        throw error;
    }
};

export const checkTransactionStatus = async (reference: string) => {
    try {
        const response = await apiClient.get(`/transaction/${reference}/`);
        return response.data;
    } catch (error: any) {
        console.error('CamPay Status Error:', error.response?.data || error.message);
        throw error;
    }
};
