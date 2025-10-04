'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string | null;
  onChange: (src: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-40 h-40 rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <button onClick={() => onChange('')} type="button" className="p-1 bg-red-600 text-white rounded-full shadow-sm hover:bg-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Uploaded image"
              src={value}
            />
          </div>
        )}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="ml_default"> // Make sure you have an 'ml_default' upload preset in Cloudinary
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition"
            >
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Dodaj zdjęcie</span>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
