import React from 'react';

export function BasicInfoFields({ formData, handleChange, categories }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1.5 h-5 bg-brand-orange mr-2 rounded"></span> Thông tin cơ bản
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border" placeholder="Nhập tên sản phẩm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm</label>
            <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border" placeholder="VD: SP001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border">
              <option value="">Chọn danh mục</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border" placeholder="VD: Alcorest" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border" placeholder="Nhập giá" />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-5 w-5 text-brand-orange focus:ring-brand-orange border-gray-300 rounded" />
            <label htmlFor="inStock" className="ml-2 block text-sm font-medium text-gray-900">Sản phẩm còn hàng</label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1.5 h-5 bg-brand-orange mr-2 rounded"></span> Thông số kỹ thuật
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Xuất xứ", name: "origin", placeholder: "Việt Nam, Đài Loan..." },
            { label: "Chất liệu", name: "material", placeholder: "Mica, Nhôm nhựa" },
            { label: "Trọng lượng", name: "weight", placeholder: "VD: 2kg" },
            { label: "Bảo hành", name: "warranty", placeholder: "12 tháng" }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2 border" placeholder={field.placeholder} />
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange p-3 border" placeholder="Mô tả chi tiết vật tư, ứng dụng..."></textarea>
        </div>
      </div>
    </div>
  );
}
