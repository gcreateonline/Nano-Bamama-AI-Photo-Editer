import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, ImageIcon } from './icons';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  preview: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, preview }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  }, [onImageChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter} // DragOver is needed to trigger drop
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-600' : ''}`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg p-1" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP, HEIC, etc.</p>
          </div>
        )}
      </label>
      <input
        ref={fileInputRef}
        id="dropzone-file"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp, image/heic, image/heif"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;