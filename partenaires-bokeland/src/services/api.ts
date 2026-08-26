import axios from 'axios';

// In production, this should point to your backend URL (e.g., https://licence.bokelandgroupservices.com/api)
// In development, we use localhost
const baseURL = import.meta.env.VITE_API_URL || 'https://licence.bokelandgroupservices.com/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('affiliateToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const affiliateApi = {
    // Auth
    requestOtp: (email: string) => api.post('/affiliate/otp/request', { email }),
    verifyOtp: (email: string, code: string) => api.post('/affiliate/otp/verify', { email, code }),
    setupAccount: (setupToken: string, password: string, phone_number: string, currency: string) => 
        api.post('/affiliate/setup', { setupToken, password, phone_number, currency }),
    login: (email: string, password: string) => api.post('/affiliate/login', { email, password }),
    
    // Dashboard
    getDashboard: () => api.get('/affiliate/dashboard'),
    requestWithdrawal: (amount: number) => api.post('/affiliate/withdraw', { amount })
};
