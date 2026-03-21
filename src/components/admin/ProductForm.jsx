import { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import { addProduct, updateProduct } from "../../services/productService";
import { compressImage } from "../../utils/imageUtils";
import { BasicInfoFields } from "./ProductForm/BasicInfoFields";
import { ImageManager } from "./ProductForm/ImageManager";
import { ProductPreview } from "./ProductForm/ProductPreview";
import { VariantManager } from "./ProductForm/VariantManager";
import { Save, RefreshCw, XCircle } from "lucide-react";

export function ProductForm({ productToEdit, onSave, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    inStock: true,
    images: [], 
    imagePreview: null,
    additionalImages: [], 
    productCode: "",
    origin: "",
    sizes: [],
    colors: [],
    material: "",
    weight: "",
    warranty: "",
    brand: "",
  });
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (productToEdit) {
      const allImages = [];
      if (productToEdit.imageBase64) {
        allImages.push({
          base64: productToEdit.imageBase64,
          name: "Ảnh chính",
          isMain: true,
          id: Date.now() + Math.random(),
        });
      }
      if (productToEdit.additionalImages) {
        allImages.push(
          ...productToEdit.additionalImages.map((img, index) => ({
            base64: img.base64,
            name: img.name || `Ảnh ${index + 2}`,
            isMain: false,
            id: Date.now() + Math.random() + index,
          }))
        );
      }

      setFormData({
        name: productToEdit.name || "",
        category: productToEdit.category || "",
        price: productToEdit.price || "",
        description: productToEdit.description || "",
        inStock: productToEdit.inStock !== false,
        images: allImages,
        imagePreview: productToEdit.imageBase64 || null,
        additionalImages: productToEdit.additionalImages || [],
        productCode: productToEdit.productCode || "",
        origin: productToEdit.origin || "",
        sizes: productToEdit.sizes || (productToEdit.size ? [productToEdit.size] : []),
        colors: productToEdit.colors || (productToEdit.color ? [{ id: "legacy-color", name: productToEdit.color, hex: "#CCCCCC"}] : []),
        material: productToEdit.material || "",
        weight: productToEdit.weight || "",
        warranty: productToEdit.warranty || "",
        brand: productToEdit.brand || "",
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 5) {
      alert("Chỉ được chọn tối đa 5 ảnh!");
      e.target.value = "";
      return;
    }

    try {
      const processedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`Ảnh ${file.name} quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.`);
          continue;
        }
        const compressedImage = await compressImage(file, 600, 0.7);
        processedImages.push({
          file: file,
          base64: compressedImage,
          name: file.name,
          isMain: i === 0 && formData.images.length === 0,
          id: Date.now() + Math.random() + i,
        });
      }

      if (processedImages.length > 0) {
        const newImages = [...formData.images, ...processedImages];
        if (!newImages.some(img => img.isMain)) newImages[0].isMain = true;
        updateImageOrder(newImages);
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xử lý ảnh.");
    }
  };

  const updateImageOrder = (images) => {
    let mainImg = images.find(img => img.isMain);
    if (!mainImg && images.length > 0) {
      mainImg = images[0];
      images[0].isMain = true;
    }
    
    setFormData((prev) => ({
      ...prev,
      images,
      imagePreview: mainImg ? mainImg.base64 : null,
      additionalImages: images.filter(img => !img.isMain).map(img => ({ base64: img.base64, name: img.name }))
    }));
  };

  const setMainImage = (id) => {
    updateImageOrder(formData.images.map(img => ({ ...img, isMain: img.id === id })));
  };

  const removeImage = (id) => {
    const newImages = formData.images.filter((img) => img.id !== id);
    if (newImages.length > 0 && !newImages.some(img => img.isMain)) newImages[0].isMain = true;
    updateImageOrder(newImages);
  };

  const handleDragStart = (e, index) => { setDraggedIndex(index); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null); return;
    }
    const newImages = [...formData.images];
    const draggedImg = newImages.splice(draggedIndex, 1)[0];
    newImages.splice(dropIndex, 0, draggedImg);
    updateImageOrder(newImages);
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category || !formData.price || formData.price <= 0) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: parseInt(formData.price),
        inStock: formData.inStock,
        imageBase64: formData.imagePreview,
        imageType: "image/jpeg",
        additionalImages: formData.additionalImages,
        updatedAt: new Date(),
        productCode: formData.productCode.trim(),
        origin: formData.origin.trim(),
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        material: formData.material.trim(),
        weight: formData.weight.trim(),
        warranty: formData.warranty.trim(),
        brand: formData.brand.trim(),
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
        alert("✅ Cập nhật thay đổi thành công!");
      } else {
        productData.createdAt = new Date();
        await addProduct(productData);
        alert("✅ Thêm sản phẩm mới thành công!");
      }
      onSave();
      resetForm();
    } catch (error) {
       alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", category: "", price: "", description: "", inStock: true,
      images: [], imagePreview: null, additionalImages: [], productCode: "",
      origin: "", sizes: [], colors: [], material: "", weight: "", warranty: "", brand: "",
    });
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
        <h3 className="text-xl font-extrabold text-brand-navy flex items-center">
           {productToEdit ? "✏️ Chỉnh Sửa Sản Phẩm" : "➕ Thêm Sản Phẩm Mới"}
        </h3>
        {productToEdit && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Đang sửa: {productToEdit.name}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form Fields */}
          <div className="flex-1">
            <div className="space-y-6">
              <BasicInfoFields formData={formData} handleChange={handleChange} categories={categories} />
              
              <ImageManager 
                formData={formData} handleImageChange={handleImageChange}
                handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}
                setMainImage={setMainImage} removeImage={removeImage} draggedIndex={draggedIndex}
              />
            </div>
            
            <VariantManager formData={formData} setFormData={setFormData} />
          </div>

          {/* Right Column: Preview & Actions */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
             <ProductPreview formData={formData} getCategoryName={getCategoryName} />
             
             {/* Actions */}
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 sticky top-[450px]">
               <button type="submit" disabled={loading} className="w-full flex items-center justify-center bg-brand-orange hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-bold rounded-lg px-5 py-3 transition-all disabled:opacity-70 shadow-sm">
                 {loading ? "Đang lưu..." : (
                   <><Save size={20} className="mr-2"/> {productToEdit ? "Cập Nhật" : "Lưu Sản Phẩm"}</>
                 )}
               </button>
               
               {productToEdit && (
                 <button type="button" onClick={onCancel} className="w-full flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold rounded-lg px-5 py-3 transition-all shadow-sm">
                   <XCircle size={20} className="mr-2"/> Hủy Bỏ
                 </button>
               )}
               
               {!productToEdit && (
                 <button type="button" onClick={resetForm} className="w-full flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold rounded-lg px-5 py-3 transition-all shadow-sm">
                   <RefreshCw size={20} className="mr-2"/> Làm Mới
                 </button>
               )}
             </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
