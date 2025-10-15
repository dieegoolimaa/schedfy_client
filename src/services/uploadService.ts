import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Upload
export interface UploadFile {
    _id: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    fileType: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
    category: 'PROFILE_PICTURE' | 'BUSINESS_LOGO' | 'SERVICE_IMAGE' | 'APPOINTMENT_ATTACHMENT' | 'DOCUMENT' | 'OTHER';
    path: string;
    url: string;
    hash: string;
    isPublic: boolean;

    // Metadata específica de imagem
    imageMetadata?: {
        width: number;
        height: number;
        format: string;
        hasAlpha: boolean;
        channels: number;
        density: number;
    };

    // Versões de imagem (thumbnails, etc)
    versions?: {
        thumbnail: string;
        medium: string;
        large: string;
    };

    // Relacionamentos
    userId?: string;
    businessId?: string;
    professionalId?: string;
    serviceId?: string;

    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
}

export interface UploadOptions {
    category?: UploadFile['category'];
    isPublic?: boolean;
    businessId?: string;
    professionalId?: string;
    serviceId?: string;
    resizeOptions?: {
        width?: number;
        height?: number;
        quality?: number;
    };
}

export interface UploadProgress {
    filename: string;
    progress: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    error?: string;
}

export interface UploadFilter {
    fileType?: UploadFile['fileType'];
    category?: UploadFile['category'];
    businessId?: string;
    professionalId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'size' | 'filename';
    sortOrder?: 'asc' | 'desc';
}

export interface StorageStats {
    totalFiles: number;
    totalSize: number;
    totalSizeFormatted: string;
    byFileType: {
        [key in UploadFile['fileType']]: {
            count: number;
            size: number;
            sizeFormatted: string;
        };
    };
    byCategory: {
        [key in UploadFile['category']]: {
            count: number;
            size: number;
            sizeFormatted: string;
        };
    };
}

class UploadService {
    private baseUrl = '/uploads';

    // Upload de arquivo único
    async uploadFile(
        file: File,
        options?: UploadOptions,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<UploadFile> {
        const formData = new FormData();
        formData.append('file', file);

        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'resizeOptions') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
        }

        try {
            const response = await apiUtils.upload<ApiResponse<UploadFile>>(
                `${this.baseUrl}/single`,
                formData,
                (progress) => {
                    onProgress?.({
                        filename: file.name,
                        progress,
                        status: progress < 100 ? 'uploading' : 'processing'
                    });
                }
            );

            onProgress?.({
                filename: file.name,
                progress: 100,
                status: 'completed'
            });

            return response.data.data;
        } catch (error: any) {
            onProgress?.({
                filename: file.name,
                progress: 0,
                status: 'error',
                error: error.response?.data?.message || 'Erro no upload'
            });
            throw error;
        }
    }

    // Upload de múltiplos arquivos
    async uploadMultipleFiles(
        files: File[],
        options?: UploadOptions,
        onProgress?: (progress: UploadProgress[]) => void
    ): Promise<UploadFile[]> {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });

        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'resizeOptions') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
        }

        try {
            const response = await apiUtils.upload<ApiResponse<UploadFile[]>>(
                `${this.baseUrl}/multiple`,
                formData,
                (progress) => {
                    const progressList = files.map(file => ({
                        filename: file.name,
                        progress,
                        status: progress < 100 ? 'uploading' as const : 'processing' as const
                    }));
                    onProgress?.(progressList);
                }
            );

            const finalProgress = files.map(file => ({
                filename: file.name,
                progress: 100,
                status: 'completed' as const
            }));
            onProgress?.(finalProgress);

            return response.data.data;
        } catch (error: any) {
            const errorProgress = files.map(file => ({
                filename: file.name,
                progress: 0,
                status: 'error' as const,
                error: error.response?.data?.message || 'Erro no upload'
            }));
            onProgress?.(errorProgress);
            throw error;
        }
    }

    // Listar uploads
    async getUploads(filter?: UploadFilter): Promise<PaginatedResponse<UploadFile>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<UploadFile>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter upload por ID
    async getUploadById(id: string): Promise<UploadFile> {
        const response = await apiUtils.get<ApiResponse<UploadFile>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Deletar upload
    async deleteUpload(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Deletar múltiplos uploads
    async deleteMultipleUploads(ids: string[]): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/bulk`, {
            data: { ids }
        });
    }

    // Download de arquivo
    async downloadFile(id: string, filename?: string): Promise<void> {
        await apiUtils.download(`${this.baseUrl}/${id}/download`, filename);
    }

    // Redimensionar imagem
    async resizeImage(id: string, options: { width?: number; height?: number; quality?: number }): Promise<string> {
        const response = await apiUtils.post<ApiResponse<{ url: string }>>(
            `${this.baseUrl}/${id}/resize`,
            options
        );
        return response.data.data.url;
    }

    // Obter estatísticas de storage
    async getStorageStats(): Promise<StorageStats> {
        const response = await apiUtils.get<ApiResponse<StorageStats>>(`${this.baseUrl}/stats`);
        return response.data.data;
    }

    // Limpeza de arquivos temporários (admin)
    async cleanupTempFiles(): Promise<{ deletedCount: number; freedSpace: string }> {
        const response = await apiUtils.post<ApiResponse<{ deletedCount: number; freedSpace: string }>>(
            `${this.baseUrl}/cleanup`
        );
        return response.data.data;
    }

    // Utilitários para validação
    isImageFile(file: File): boolean {
        return file.type.startsWith('image/');
    }

    isDocumentFile(file: File): boolean {
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv'
        ];
        return documentTypes.includes(file.type);
    }

    isVideoFile(file: File): boolean {
        return file.type.startsWith('video/');
    }

    isAudioFile(file: File): boolean {
        return file.type.startsWith('audio/');
    }

    getFileType(file: File): UploadFile['fileType'] {
        if (this.isImageFile(file)) return 'IMAGE';
        if (this.isDocumentFile(file)) return 'DOCUMENT';
        if (this.isVideoFile(file)) return 'VIDEO';
        if (this.isAudioFile(file)) return 'AUDIO';
        return 'OTHER';
    }

    formatFileSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

export const uploadService = new UploadService();
export default uploadService;