import axios, { AxiosInstance } from 'axios';
import { Toastify } from '../toastify/Toastify';


const customAxios: AxiosInstance = axios.create({
  baseURL: 'https://backend.vantanhly.io.vn/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  timeout: 10000,
});

const refreshAccessToken = async () => {
await customAxios.post('/refresh', {
		refreshToken: localStorage.getItem('refresh_token')
	}).then((res) => {
        const newAccessToken = res.data.access_token;
		const newRefreshToken = res.data.refresh_token;
        customAxios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
	localStorage.setItem('access_token', newAccessToken);
	localStorage.setItem('refresh_token', newRefreshToken);
    }).catch((err) => {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('username');
			localStorage.removeItem('email');
			Toastify.error(`${err.response.data.message}. Please login again`);
			window.location.href = '/login';
	})

	
};
customAxios.interceptors.response.use(
	response => response,
	error => {
		const originalRequest = error.config;

		// Check if the error is due to an expired token
		if (error.response.status === 401 && error.response.data.message === "Unauthorized" && !originalRequest._retry) {
			console.log(error.response);

			originalRequest._retry = true;

			// Refresh the access token
			return refreshAccessToken()
				.then(() => {
					// Retry the original request with the new access token
					originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
					return customAxios(originalRequest);
				});
		}

		return Promise.reject(error);
	}
);


export default customAxios;