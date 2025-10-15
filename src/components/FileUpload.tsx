import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "../hooks/useUpload";
import type { UploadOptions } from "../services/uploadService";

interface FileUploadProps {
  options?: UploadOptions;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  onSuccess?: (files: any[]) => void;
  onError?: (error: string) => void;
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  options = {},
  multiple = true,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className = "",
  onSuccess,
  onError,
  children,
}) => {
  const {
    files,
    progress,
    isUploading,
    error,
    uploadFiles,
    removeFile,
    reset,
  } = useUpload({
    ...options,
    maxFiles,
    maxFileSize: maxSize,
    onSuccess,
    onError,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      uploadFiles(acceptedFiles);
    },
    [uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    disabled: disabled || isUploading,
    maxFiles,
    maxSize,
  } as any);

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (mimetype: string): string => {
    if (mimetype.startsWith("image/")) return "🖼️";
    if (mimetype.startsWith("video/")) return "🎥";
    if (mimetype.startsWith("audio/")) return "🎵";
    if (mimetype === "application/pdf") return "📄";
    if (mimetype.includes("word")) return "📝";
    if (mimetype.includes("excel") || mimetype.includes("sheet")) return "📊";
    return "📎";
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          drop-zone p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...(getInputProps() as any)} />

        {children || (
          <div className="text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-lg font-medium text-gray-700 mb-1">
              {isDragActive
                ? "Solte os arquivos aqui"
                : "Clique ou arraste arquivos"}
            </p>
            <p className="text-sm text-gray-500">
              {multiple ? `Até ${maxFiles} arquivos` : "Um arquivo"} • Máximo{" "}
              {formatFileSize(maxSize)} cada
            </p>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="error-message mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Progresso de Upload */}
      {progress.length > 0 && (
        <div className="upload-progress mt-4 space-y-2">
          {progress.map((item, index) => (
            <div key={index} className="progress-item">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{item.filename}</span>
                <span className="text-sm text-gray-500">
                  {item.status === "uploading" && `${item.progress}%`}
                  {item.status === "processing" && "Processando..."}
                  {item.status === "completed" && "✅"}
                  {item.status === "error" && "❌"}
                </span>
              </div>
              {item.status !== "completed" && item.status !== "error" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.status === "processing"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.error && (
                <p className="text-red-500 text-xs mt-1">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lista de Arquivos Enviados */}
      {files.length > 0 && (
        <div className="uploaded-files mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Arquivos Enviados ({files.length})
            </h4>
            <button
              onClick={reset}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={isUploading}
            >
              Limpar Todos
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file._id}
                className="file-item flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(file.mimetype)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.mimetype}
                    </p>
                    {file.imageMetadata && (
                      <p className="text-xs text-gray-500">
                        {file.imageMetadata.width} × {file.imageMetadata.height}
                        px
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Ver
                    </a>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    disabled={isUploading}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente específico para upload de imagens
export const ImageUpload: React.FC<
  Omit<FileUploadProps, "accept" | "multiple"> & {
    multiple?: boolean;
    showPreview?: boolean;
  }
> = ({ multiple = false, showPreview = true, ...props }) => {
  return (
    <FileUpload
      {...props}
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      }}
      multiple={multiple}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          {multiple ? "Enviar Imagens" : "Enviar Imagem"}
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, GIF até{" "}
          {props.maxSize ? Math.round(props.maxSize / 1024 / 1024) : 10}MB
        </p>
      </div>
    </FileUpload>
  );
};

// Componente para upload de documentos
export const DocumentUpload: React.FC<Omit<FileUploadProps, "accept">> = (
  props
) => {
  return (
    <FileUpload
      {...props}
      accept={{
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "text/plain": [".txt"],
        "text/csv": [".csv"],
      }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">📄</div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          Enviar Documentos
        </p>
        <p className="text-sm text-gray-500">
          PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
        </p>
      </div>
    </FileUpload>
  );
};

export default FileUpload;
