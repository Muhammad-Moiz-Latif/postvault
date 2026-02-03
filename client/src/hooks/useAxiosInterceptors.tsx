import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { privateApi, publicApi } from "../app/axios";
import { useNavigate } from "react-router";


export const useAxiosInterceptors = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = privateApi.interceptors.request.use(
            function (config) {
                if (auth.access_token) {
                    config.headers.Authorization = `Bearer ${auth.access_token}`;
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
                if (error.response.status === 401) {
                    setAuth({
                        access_token: "",
                        user_id: ""
                    });
                    navigate('/');
                    return Promise.reject(error);
                };

                if (error.response.status === 403 && !originalRequest._retry) {
                    try {
                        originalRequest._retry = true;
                        const res = await publicApi.get('/api/auth/refresh');
                        if (res.data.access_token && res.data.success) {
                            setAuth({
                                ...auth, access_token: res.data.access_token
                            });
                            originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
                            return privateApi(originalRequest);
                        }
                    } catch (error) {
                        setAuth({ access_token: '', user_id: '' });
                        navigate('/');
                        return Promise.reject(error);
                    };
                    return Promise.reject(error);
                };
            }
        );

        return () => {
            privateApi.interceptors.request.eject(requestInterceptor);
            privateApi.interceptors.response.eject(responseInterceptor);
        };

    }, [auth.access_token, setAuth, navigate]);

};