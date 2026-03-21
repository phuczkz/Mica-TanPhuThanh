import React from 'react';

export function ProductPreview({ formData, getCategoryName }) {
  if (!formData.name && !formData.imagePreview && !formData.price && !formData.category) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200 h-full flex items-center justify-center text-gray-400">
        Nhập thông tin sản phẩm để xem trước hiển thị
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
      <div className="bg-brand-navy px-4 py-3 border-b">
         <h4 className="text-white font-bold text-sm uppercase tracking-wide">👁️ Xem trước thẻ sản phẩm</h4>
      </div>
      <div className="p-6 bg-gray-50 flex justify-center">
        {/* Card Mockup */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm w-full max-w-sm overflow-hidden flex flex-col">
          <div className="aspect-square w-full bg-gray-100 relative">
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-gray-400 text-sm">Chưa có ảnh</div>
            )}
            {formData.inStock === false && (
              <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white font-bold tracking-widest uppercase">Hết hàng</div>
            )}
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            {formData.category && (
              <span className="text-xs text-brand-orange font-bold uppercase mb-1">{getCategoryName(formData.category)}</span>
            )}
            <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">{formData.name || "Tên sản phẩm"}</h5>
            
            {/* Variant Preview */}
            {(formData.colors?.length > 0 || formData.sizes?.length > 0) && (
               <div className="flex gap-1 mb-3">
                 {formData.colors?.slice(0, 4).map(c => (
                   <span key={c.id} className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{backgroundColor: c.hex}} title={c.name}></span>
                 ))}
                 {formData.colors?.length > 4 && <span className="text-xs text-gray-400">+{formData.colors.length - 4}</span>}
                 
                 {formData.sizes?.length > 0 && (
                   <span className="text-xs text-brand-navy font-bold ml-A bg-gray-100 rounded px-1">{formData.sizes.length} Cỡ</span>
                 )}
               </div>
            )}

            <div className="mt-auto">
               <div className="font-bold text-brand-orange text-lg">
                 {formData.price ? `${parseInt(formData.price).toLocaleString('vi-VN')} đ` : "Giá sản phẩm"}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
