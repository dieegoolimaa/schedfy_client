import React, { useState } from "react";
import {
  FileUpload,
  ImageUpload,
  DocumentUpload,
} from "../components/FileUpload";
// import { useUpload } from '../hooks/useUpload';
import type { UploadFile } from "../services/uploadService";

const UploadDemoPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "PROFILE_PICTURE" | "BUSINESS_LOGO" | "DOCUMENT"
  >("DOCUMENT");

  const handleUploadSuccess = (files: UploadFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    console.log("Upload bem-sucedido:", files);
  };

  const handleUploadError = (error: string) => {
    console.error("Erro no upload:", error);
    alert(`Erro: ${error}`);
  };

  return (
    <div className="upload-demo-page max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Sistema de Upload - Demonstração
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Geral */}
        <div className="upload-section">
          <h2 className="text-xl font-semibold mb-4">Upload Geral</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria:
            </label>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
            >
              <option value="DOCUMENT">Documento</option>
              <option value="PROFILE_PICTURE">Foto de Perfil</option>
              <option value="BUSINESS_LOGO">Logo da Empresa</option>
            </select>
          </div>

          <FileUpload
            options={{
              category: selectedCategory,
              isPublic: selectedCategory !== "DOCUMENT",
            }}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            className="mb-6"
          />
        </div>

        {/* Upload de Imagens */}
        <div className="upload-section">
          <h2 className="text-xl font-semibold mb-4">Upload de Imagens</h2>
          <ImageUpload
            multiple={true}
            options={{
              category: "SERVICE_IMAGE",
              isPublic: true,
              resizeOptions: {
                width: 1200,
                quality: 85,
              },
            }}
            maxFiles={3}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            className="mb-6"
          />
        </div>

        {/* Upload de Documentos */}
        <div className="upload-section">
          <h2 className="text-xl font-semibold mb-4">Upload de Documentos</h2>
          <DocumentUpload
            multiple={true}
            options={{
              category: "DOCUMENT",
              isPublic: false,
            }}
            maxFiles={2}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            className="mb-6"
          />
        </div>

        {/* Estatísticas */}
        <div className="stats-section">
          <h2 className="text-xl font-semibold mb-4">
            Estatísticas desta Sessão
          </h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {uploadedFiles.length}
                </p>
                <p className="text-sm text-gray-600">Arquivos Enviados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    (uploadedFiles.reduce((acc, file) => acc + file.size, 0) /
                      1024 /
                      1024) *
                      100
                  ) / 100}{" "}
                  MB
                </p>
                <p className="text-sm text-gray-600">Total de Dados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Arquivos Enviados */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-section mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Arquivos Enviados Nesta Sessão ({uploadedFiles.length})
          </h2>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arquivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedFiles.map((file) => (
                    <tr key={file._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {file.originalName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {file.mimetype}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {file.fileType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round((file.size / 1024) * 100) / 100} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Ver
                        </a>
                        {file.imageMetadata && (
                          <span className="text-gray-500">
                            {file.imageMetadata.width}×
                            {file.imageMetadata.height}px
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dicas de Uso */}
      <div className="tips-section mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          💡 Dicas de Uso
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            • <strong>Upload Geral:</strong> Aceita qualquer tipo de arquivo até
            10MB
          </li>
          <li>
            • <strong>Upload de Imagens:</strong> Processa automaticamente e
            cria versões redimensionadas
          </li>
          <li>
            • <strong>Upload de Documentos:</strong> Aceita PDF, DOC, XLS, TXT e
            CSV
          </li>
          <li>
            • <strong>Categorias:</strong> Organize seus arquivos por categoria
            para facilitar a busca
          </li>
          <li>
            • <strong>Duplicatas:</strong> O sistema detecta automaticamente
            arquivos duplicados
          </li>
          <li>
            • <strong>Processamento:</strong> Imagens são otimizadas
            automaticamente para diferentes tamanhos
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadDemoPage;
