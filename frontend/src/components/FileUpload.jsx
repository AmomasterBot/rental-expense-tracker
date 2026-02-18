import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiCamera } from 'react-icons/fi';

function FileUpload({ onFileSelect, onError, allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'], maxSizeMB = 10 }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const validateFile = (file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const typesStr = allowedTypes.map(t => t.split('/')[1]).join(', ').toUpperCase();
      setError(`Invalid file type. Allowed types: ${typesStr}`);
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    setError(null);

    if (!validateFile(file)) {
      if (onError) onError();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    reader.onload = (event) => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setSelectedFile(file);
        setPreview(event.target.result);
        setIsUploading(false);
        setUploadProgress(0);
        
        if (onFileSelect) {
          onFileSelect({
            file,
            preview: event.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setError('Error reading file. Please try again.');
      setIsUploading(false);
      if (onError) onError();
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const openCameraOnMobile = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const isImage = preview && (preview.startsWith('data:image'));
  const isPDF = selectedFile && selectedFile.type === 'application/pdf';

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        } ${preview ? 'hidden' : ''}`}
      >
        {isUploading ? (
          // Upload Progress State
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - uploadProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-600">
                  {Math.round(uploadProgress)}%
                </div>
              </div>
            </div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          // Default State
          <div className="text-center space-y-3">
            <FiUpload size={32} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop your file here or
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                click to browse
              </button>
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG, HEIC, or PDF • Max 10MB
            </p>

            {/* Mobile Camera Button */}
            {isIPhone && (
              <div className="pt-2 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={openCameraOnMobile}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  <FiCamera size={16} />
                  Take Photo with Camera
                </button>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.map(type => {
            if (type === 'image/jpeg') return '.jpg,.jpeg';
            if (type === 'image/png') return '.png';
            if (type === 'image/heic') return '.heic,.heif';
            if (type === 'application/pdf') return '.pdf';
            return '';
          }).join(',')}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload file"
        />

        {/* Camera Input for Mobile */}
        {isIPhone && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Capture photo with camera"
          />
        )}
      </div>

      {/* Preview and Actions */}
      {preview && !isUploading && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Preview Thumbnail */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {isImage ? (
                  <img
                    src={preview}
                    alt="File preview"
                    className="max-h-48 rounded-lg object-cover max-w-xs"
                  />
                ) : isPDF ? (
                  <div className="flex items-center justify-center h-32 w-32 bg-red-100 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl text-red-600 font-bold">PDF</div>
                      <p className="text-xs text-gray-600 mt-1">Document</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 w-32 bg-gray-200 rounded-lg">
                    <FiUpload size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheck size={20} />
                  <span className="font-medium">File selected</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span> {selectedFile.name}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span> {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {selectedFile.type || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-gray-300">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-600 transition-colors"
              >
                Change File
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiX size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <FiAlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">{error}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-red-600 hover:text-red-700 font-medium mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
