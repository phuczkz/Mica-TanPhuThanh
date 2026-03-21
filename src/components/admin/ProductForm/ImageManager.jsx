import React from 'react';
import { Upload, X, Star, GripVertical } from 'lucide-react';

export function ImageManager({ formData, handleImageChange, handleDragStart, handleDragOver, handleDrop, setMainImage, removeImage, draggedIndex }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-1.5 h-5 bg-brand-orange mr-2 rounded"></span> Hình ảnh sản phẩm
      </h4>
      
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click để chọn ảnh</span> hoặc kéo thả vào đây</p>
            <p className="text-xs text-gray-500">Tối đa 5 ảnh (PNG, JPG, Giới hạn 5MB)</p>
          </div>
          <input type="file" id="productImage" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
        </label>
      </div>

      {formData.images.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-gray-700">Đã tải lên {formData.images.length}/5 ảnh:</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formData.images.map((image, index) => (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${image.isMain ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-gray-200'} ${draggedIndex === index ? 'opacity-50' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <img src={image.base64} alt={`Preview ${index}`} className="w-full aspect-square object-cover" />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing text-white" title="Kéo để sắp xếp"><GripVertical size={20} /></div>
                  <button type="button" onClick={() => removeImage(image.id)} className="absolute top-2 right-2 text-white hover:text-red-400" title="Xóa"><X size={20}/></button>
                  {!image.isMain && (
                    <button type="button" onClick={() => setMainImage(image.id)} className="bg-white text-gray-900 text-xs px-2 py-1 rounded font-medium hover:text-brand-orange">
                      Đặt ảnh chính
                    </button>
                  )}
                </div>
                
                {/* Main badge */}
                {image.isMain && (
                   <div className="absolute bottom-0 left-0 right-0 bg-brand-orange text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider flex items-center justify-center">
                     <Star size={10} className="mr-1 fill-current" /> Ảnh chính
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
