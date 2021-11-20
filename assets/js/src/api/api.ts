import axios from 'axios';
export const API_BASE = 'http://localhost:4000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // const token = await AsyncStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`; // Add token to header before requesting
        // }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default axiosInstance;