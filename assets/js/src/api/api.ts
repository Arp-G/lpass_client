import axios from 'axios';
import { get } from 'idb-keyval';
import { API_URL } from 'env';
export const API_BASE = `${API_URL}/api`;

const axiosInstance = axios.create({
    baseURL: API_BASE
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await get('token');
        if (config.headers && token) {
            config.headers.Authorization = `Bearer ${token}`; // Add token to header before requesting
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default axiosInstance;