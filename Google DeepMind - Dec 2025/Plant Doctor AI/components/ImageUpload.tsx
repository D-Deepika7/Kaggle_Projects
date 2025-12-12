import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  onClear: () => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group rounded-2xl overflow-hidden shadow-md border border-stone-200">
        <img 
          src={selectedImage} 
          alt="Uploaded Plant" 
          className="w-full h-64 md:h-96 object-cover"
        />
        {!isLoading && (
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-stone-700 p-2 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-emerald-800 font-semibold animate-pulse">Analyzing leaf patterns...</p>
                 </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="border-2 border-dashed border-stone-300 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-2xl p-8 md:p-12 transition-all cursor-pointer bg-white text-center"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-stone-800 mb-2">Upload Plant Photo</h3>
      <p className="text-stone-500 max-w-sm mx-auto mb-6">
        Drag and drop or click to select a photo of your plant. Close-ups of spots or damaged leaves work best.
      </p>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-colors inline-flex items-center">
        <ImageIcon className="w-4 h-4 mr-2" />
        Select Photo
      </button>
    </div>
  );
};

export default ImageUpload;
