import axios from 'axios';
import { makeStore } from '@/app/store/store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const store = makeStore();
        const token = store.getState().auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;

// import axios from 'axios';

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export const setAuthToken = (token) => {
//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         delete api.defaults.headers.common['Authorization'];
//     }
// };

// export default api;
