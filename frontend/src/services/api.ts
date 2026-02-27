import axios from 'axios';

const api = axios.create({
    // Use window.location.hostname to allow access from other devices in the network
    baseURL: `http://${window.location.hostname}:5006/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject selected school year
    const savedYear = localStorage.getItem('currentSchoolYear');
    if (savedYear) {
        try {
            const parsed = JSON.parse(savedYear);
            // Verify if parsed object has id property before injecting
            if (parsed && typeof parsed === 'object' && 'id' in parsed) {
                if (!config.headers['x-school-year-id']) {
                    config.headers['x-school-year-id'] = parsed.id;
                }
            }
        } catch (e) {
            // Passive failure - just don't inject header if parse fails
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuth');
            localStorage.removeItem('user');

            // Prevent infinite loop if already on login page or if performing onboarding/activation
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/welcome' && currentPath !== '/activation') {
                console.warn('Authentication/License error, redirecting to login from:', currentPath);
                window.location.href = '/login';
            } else {
                console.warn('Authentication/License error on protected page, ignoring redirect:', currentPath);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
