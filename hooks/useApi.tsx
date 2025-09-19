import axios from "axios";


export function useApi() {
    const api = axios.create({
        baseURL: '/api',
        withCredentials: true
    });

    api.interceptors.response.use(
        res => res, //200, 201 success responses
        async err => {
            const originalRequest = err.config;
            if (err.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const request = await axios.post('/api/auth/refresh', {
                        withCredentials: true
                    });
                    return api(originalRequest);
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        }
    );

    return api;
}