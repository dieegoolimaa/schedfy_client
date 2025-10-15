import { useState, useCallback } from 'react';
import { uploadService } from '../services/uploadService';
import type { UploadFile, UploadOptions, UploadProgress } from '../services/uploadService';

interface UseUploadOptions extends UploadOptions {
    maxFiles?: number;
    maxFileSize?: number; // em bytes
    acceptedTypes?: string[]; // mimetypes aceitos
    onSuccess?: (files: UploadFile[]) => void;
    onError?: (error: string) => void;
}

interface UseUploadReturn {
    // Estado
    files: UploadFile[];
    progress: UploadProgress[];
    isUploading: boolean;
    error: string | null;

    // Funções
    uploadFiles: (filesToUpload: File[]) => Promise<void>;
    uploadSingleFile: (file: File) => Promise<UploadFile | null>;
    clearFiles: () => void;
    removeFile: (index: number) => void;
    reset: () => void;

    // Validação
    validateFiles: (filesToValidate: File[]) => { valid: File[]; errors: string[] };
}

export const useUpload = (options: UseUploadOptions = {}): UseUploadReturn => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [progress, setProgress] = useState<UploadProgress[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        maxFiles = 10,
        maxFileSize = 10 * 1024 * 1024, // 10MB por padrão
        acceptedTypes = [],
        onSuccess,
        onError,
        ...uploadOptions
    } = options;

    // Validação de arquivos
    const validateFiles = useCallback((filesToValidate: File[]) => {
        const errors: string[] = [];
        const validFiles: File[] = [];

        // Verificar número máximo de arquivos
        if (files.length + filesToValidate.length > maxFiles) {
            errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
            return { valid: [], errors };
        }

        filesToValidate.forEach((file) => {
            // Verificar tamanho
            if (file.size > maxFileSize) {
                errors.push(`${file.name}: Arquivo muito grande (máximo ${uploadService.formatFileSize(maxFileSize)})`);
                return;
            }

            // Verificar tipo de arquivo
            if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
                errors.push(`${file.name}: Tipo de arquivo não suportado`);
                return;
            }

            // Verificar se já existe um arquivo com o mesmo nome
            if (files.some(f => f.originalName === file.name)) {
                errors.push(`${file.name}: Arquivo já foi enviado`);
                return;
            }

            validFiles.push(file);
        });

        return { valid: validFiles, errors };
    }, [files, maxFiles, maxFileSize, acceptedTypes]);

    // Upload de múltiplos arquivos
    const uploadFiles = useCallback(async (filesToUpload: File[]) => {
        const { valid, errors } = validateFiles(filesToUpload);

        if (errors.length > 0) {
            const errorMessage = errors.join('; ');
            setError(errorMessage);
            onError?.(errorMessage);
            return;
        }

        if (valid.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            const uploadedFiles = await uploadService.uploadMultipleFiles(
                valid,
                uploadOptions,
                (progressUpdates) => {
                    setProgress(progressUpdates);
                }
            );

            setFiles(prev => [...prev, ...uploadedFiles]);
            setProgress([]);
            onSuccess?.(uploadedFiles);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro no upload dos arquivos';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsUploading(false);
        }
    }, [validateFiles, uploadOptions, onSuccess, onError]);

    // Upload de arquivo único
    const uploadSingleFile = useCallback(async (file: File): Promise<UploadFile | null> => {
        const { valid, errors } = validateFiles([file]);

        if (errors.length > 0) {
            const errorMessage = errors.join('; ');
            setError(errorMessage);
            onError?.(errorMessage);
            return null;
        }

        if (valid.length === 0) return null;

        setIsUploading(true);
        setError(null);

        try {
            const uploadedFile = await uploadService.uploadFile(
                file,
                uploadOptions,
                (progressUpdate) => {
                    setProgress([progressUpdate]);
                }
            );

            setFiles(prev => [...prev, uploadedFile]);
            setProgress([]);
            onSuccess?.([uploadedFile]);
            return uploadedFile;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro no upload do arquivo';
            setError(errorMessage);
            onError?.(errorMessage);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [validateFiles, uploadOptions, onSuccess, onError]);

    // Limpar lista de arquivos
    const clearFiles = useCallback(() => {
        setFiles([]);
        setProgress([]);
        setError(null);
    }, []);

    // Remover arquivo específico
    const removeFile = useCallback((index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Reset completo
    const reset = useCallback(() => {
        setFiles([]);
        setProgress([]);
        setError(null);
        setIsUploading(false);
    }, []);

    return {
        files,
        progress,
        isUploading,
        error,
        uploadFiles,
        uploadSingleFile,
        clearFiles,
        removeFile,
        reset,
        validateFiles,
    };
};

// Hook específico para upload de imagens
export const useImageUpload = (options: Omit<UseUploadOptions, 'acceptedTypes'> = {}) => {
    return useUpload({
        ...options,
        acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    });
};

// Hook específico para upload de documentos
export const useDocumentUpload = (options: Omit<UseUploadOptions, 'acceptedTypes'> = {}) => {
    return useUpload({
        ...options,
        acceptedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv'
        ],
    });
};

export default useUpload;