import React from 'react';
import { ImageIcon, DownloadIcon } from './icons';

interface ImageDisplayProps {
  label: string;
  imageUrl?: string | null;
  isLoading?: boolean;
  textOverlay?: string | null;
  isDownloadable?: boolean;
  isSharpened?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageUrl, isLoading, textOverlay, isDownloadable, isSharpened }) => {
  const handleDownload = () => {
    if (!imageUrl) return;

    const triggerDownload = (blob: Blob) => {
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const extension = (blob.type.split('/')[1] || 'png').split('+')[0];
        const filename = isSharpened ? `enhanced-edit-${Date.now()}` : `edit-${Date.now()}`;
        a.download = `${filename}.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Failed to trigger download:', error);
        alert('Could not prepare the image for download.');
      }
    };

    if (isSharpened) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = 'contrast(1.25) saturate(1.1)';
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              triggerDownload(blob);
            } else {
              alert('Could not process the enhanced image for download.');
            }
          }, 'image/png');
        } else {
            alert('Could not get canvas context to process the image.');
        }
      };
      img.onerror = () => {
        alert('Failed to load image onto canvas for processing.');
      }
      img.src = imageUrl;
    } else {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(triggerDownload)
        .catch(error => {
          console.error('Failed to download image:', error);
          alert('Could not download the image. Please try again.');
        });
    }
  };


  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-center text-gray-400 mb-2">{label}</h3>
      <div className="relative flex-grow w-full bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-700">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3">Generating...</p>
          </div>
        ) : imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={label} 
              className={`w-full h-full object-contain transition-all duration-300 ${isSharpened ? 'filter contrast-125 saturate-110' : ''}`}
            />
            {textOverlay && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white backdrop-blur-sm">
                    <p>{textOverlay}</p>
                </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <ImageIcon className="w-16 h-16" />
            <p className="mt-2">{label} image will appear here</p>
          </div>
        )}
        {isDownloadable && imageUrl && !isLoading && (
            <button
              onClick={handleDownload}
              className="absolute top-3 right-3 p-2 bg-gray-900/60 backdrop-blur-sm rounded-full text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-200"
              aria-label={`Download ${label} image`}
              title={`Download ${label} image`}
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;