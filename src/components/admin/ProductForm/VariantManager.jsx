import React, { useState } from "react";
import { Plus, X, Palette, Maximize } from "lucide-react";

export function VariantManager({ formData, setFormData }) {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newSize, setNewSize] = useState("");

  const addColor = () => {
    if (!newColorName.trim()) return;
    const newColor = { id: Date.now().toString(), name: newColorName.trim(), hex: newColorHex };
    setFormData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newColor]
    }));
    setNewColorName("");
  };

  const removeColor = (id) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c.id !== id)
    }));
  };

  const addSize = () => {
    if (!newSize.trim()) return;
    setFormData((prev) => ({
      ...prev,
      sizes: [...(prev.sizes || []), newSize.trim()]
    }));
    setNewSize("");
  };

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter(s => s !== sizeToRemove)
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6 shadow-sm">
      <h4 className="text-lg font-bold text-brand-navy mb-6 flex items-center border-b border-gray-200 pb-3">
        <Palette size={20} className="mr-2" />
        Thuộc tính Biến Thể (Màu sắc, Kích cỡ)
      </h4>

      <div className="space-y-8">
        {/* Colors Management */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Palette size={16} className="mr-2 text-brand-orange" />
            Màu Sắc (Tùy chọn)
          </label>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {(formData.colors || []).map((color) => (
              <div key={color.id} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-2 pr-1 py-1 text-sm shadow-sm group">
                <span className="w-4 h-4 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: color.hex }}></span>
                <span className="font-medium text-gray-700">{color.name}</span>
                <button 
                  type="button" 
                  onClick={() => removeColor(color.id)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {(!formData.colors || formData.colors.length === 0) && (
              <span className="text-sm text-gray-400 italic py-1">Chưa có màu nào được thêm.</span>
            )}
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Tên màu (VD: Đỏ đun, Xanh Navy...)"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
            </div>
            <div>
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-10 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                title="Chọn mã màu chuẩn"
              />
            </div>
            <button
              type="button"
              onClick={addColor}
              disabled={!newColorName.trim()}
              className="px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center"
            >
              <Plus size={16} className="mr-1" /> Thêm
            </button>
          </div>
        </div>

        {/* Sizes / Thickness Management */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
             <Maximize size={16} className="mr-2 text-brand-orange" />
             Kích thước / Độ dày (Tùy chọn)
          </label>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(formData.sizes || []).map((size, idx) => (
              <div key={idx} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded pl-3 pr-1 py-1 text-sm shadow-sm">
                <span className="font-medium text-gray-700">{size}</span>
                <button 
                  type="button" 
                  onClick={() => removeSize(size)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {(!formData.sizes || formData.sizes.length === 0) && (
              <span className="text-sm text-gray-400 italic py-1">Chưa có kích thước/độ dày nào.</span>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Nhập kích thước (VD: 1220x2440mm, 3mm, 5mm...)"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <button
              type="button"
              onClick={addSize}
              disabled={!newSize.trim()}
              className="px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 hidden sm:flex items-center"
            >
              <Plus size={16} className="mr-1" /> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
