import axios, { AxiosInstance } from 'axios';

const customAxios: AxiosInstance = axios.create({
    // baseURL: 'https://mazii.vantanhly.io.vn/api',
    baseURL: 'https://vantanhly.io.vn/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    timeout: 10000,
});

export default customAxios;
