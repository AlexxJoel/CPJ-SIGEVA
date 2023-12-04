import AxiosClient from './axios';
import type {AxiosRequestConfig} from "axios";
import Vue from "vue";



AxiosClient.interceptors.request.use(
    (config) => {
        const auth_token = localStorage.idToken;
        if (auth_token !== undefined) {
            if (!config.url!.includes('auth')) {
                config.headers!.Authorization = `Bearer ${auth_token}`;
            }
        }
        return config;
        }
)
/*
AxiosClient.interceptors.response.use(
    (response)=>{
        return response
    },
    async (error)=>{
        if (!error.response) {
            const newError = await Vue.swal({
                title: 'El servidor no responde',
                text: 'El servidor no está respondiendo',
                icon: 'error',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                return {
                    ...error,
                    response: {
                        data: {
                            code: 503,
                            error: true,
                            message: 'Server no responding'
                        }
                    }
                }
            })
            return Promise.reject(newError);
        }
        if (error.response.status === 401) {
            const newError = await Vue.swal({
                title: 'Sesión expirada',
                text: 'Su sesión ha expirado',
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                return {
                    ...error,
                    response: {
                        data: {
                            code: 401,
                            error: true,
                            message: 'Session expired'
                        }
                    }
                }
            })
            return Promise.reject(newError);
        }
        if (error.response.status === 403) {
            const newError = await Vue.swal({
                title: 'Acceso no permitido',
                text: 'No puedes acceder a este recurso',
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                return {
                    ...error,
                    response: {
                        data: {
                            code: 403,
                            error: true,
                            message: 'Access denied'
                        }
                    }
                }
            })
            return Promise.reject(newError);
        }
        if (error.response.status === 500) {
            const newError = await Vue.swal({
                title: 'Error interno del servidor',
                text: 'El servidor no está respondiendo',
                icon: 'error',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                return {
                    ...error,
                    response: {
                        data: {
                            code: 500,
                            error: true,
                            message: 'Internal server error'
                        }
                    }
                }
            })
            return Promise.reject(newError);
        }
        return Promise.reject(error);
    }
)
*/

export default {
    doGet(url: string, config?: AxiosRequestConfig) {
        return AxiosClient.get(url, config);
    },
    doPost(url: string, data: any, config?: AxiosRequestConfig) {
        return AxiosClient.post(url, data, config);
    },
    doPut(url: string, data: any, config?: AxiosRequestConfig) {
        return AxiosClient.put(url, data, config);
    },
    doDelete(url: string, config?: AxiosRequestConfig) {
        return AxiosClient.delete(url, config);
    },
    doPatch(url: string, data: any, config?: AxiosRequestConfig) {
        return AxiosClient.patch(url, data, config);
    }
}