import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';

// Configuração base do Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Tratamento de erros globais
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }

        // Log do erro para debug
        console.error('API Error:', error.response?.data || error.message);

        return Promise.reject(error);
    }
);

// Tipos para APIs
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// Utilitários para chamadas de API
export const apiUtils = {
    // Método GET genérico
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return api.get<T>(url, config);
    },

    // Método POST genérico
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return api.post<T>(url, data, config);
    },

    // Método PUT genérico
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return api.put<T>(url, data, config);
    },

    // Método PATCH genérico
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return api.patch<T>(url, data, config);
    },

    // Método DELETE genérico
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return api.delete<T>(url, config);
    },

    // Upload de arquivos
    async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
        return api.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
    },

    // Download de arquivos
    async download(url: string, filename?: string): Promise<void> {
        const response = await api.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    },
};

export default api;