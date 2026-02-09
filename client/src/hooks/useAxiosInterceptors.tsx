import { useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import { privateApi } from "../app/axios";


export const useAxiosInterceptors = () => {
    const { setAuth } = useAuth();
    const isRefreshing = useRef(false);

    useEffect(() => {
        const requestInterceptor = privateApi.interceptors.request.use(
            function (config) {
                const token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                };
                return config;
            }, function (error) {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = privateApi.interceptors.response.use(
            function (response) {
                return response
            },
            async function (error) {
                const originalRequest = error.config;

                // Handle both 401 (unauthorized) and 403 (forbidden) for token issues
                if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Prevent multiple simultaneous refresh attempts
                    if (isRefreshing.current) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const token = localStorage.getItem('access_token');
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return privateApi(originalRequest);
                        }
                        return Promise.reject(error);
                    }

                    try {
                        isRefreshing.current = true;
                        // Use privateApi to send cookies with the request
                        const res = await privateApi.get('/api/auth/refresh');

                        if (res.data.access_token && res.data.success) {
                            const newToken = res.data.access_token;
                            const userId = res.data.data?.userId || '';

                            // Store in localStorage to persist across refreshes
                            localStorage.setItem('access_token', newToken);
                            localStorage.setItem('user_id', userId);

                            setAuth({
                                access_token: newToken,
                                user_id: userId
                            });

                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return privateApi(originalRequest);
                        }

                        // If no valid token in response, clear auth
                        throw new Error('No valid token received');

                    } catch (refreshError) {
                        // Refresh failed, clear everything and force re-login
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user_id');
                        setAuth({ access_token: '', user_id: '' });
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing.current = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            privateApi.interceptors.request.eject(requestInterceptor);
            privateApi.interceptors.response.eject(responseInterceptor);
        };

    }, [setAuth]); // Only depend on setAuth, not the auth state itself

};