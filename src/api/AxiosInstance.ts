import axios, { AxiosInstance } from 'axios';

const customAxios: AxiosInstance = axios.create({
    // baseURL: 'https://vantanhly.io.vn/api',
    baseURL: 'http://localhost/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    timeout: 10000,
});



export default customAxios;
