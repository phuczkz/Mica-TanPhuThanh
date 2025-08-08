import { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import { addProduct, updateProduct } from "../../services/productService";
import { compressImage } from "../../utils/imageUtils";

export function ProductForm({ productToEdit, onSave, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    inStock: true,
    images: [], // Mảng ảnh với thông tin index và isMain
    imagePreview: null, // Ảnh chính (đầu tiên)
    additionalImages: [], // Các ảnh bổ sung
    productCode: "",
    origin: "",
    size: "",
    color: "",
    material: "",
    weight: "",
    warranty: "",
    brand: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    fetchCategories();
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
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        description: productToEdit.description,
        inStock: productToEdit.inStock !== false,
        images: allImages,
        imagePreview: productToEdit.imageBase64,
        additionalImages: productToEdit.additionalImages || [],
        productCode: productToEdit.productCode || "",
        origin: productToEdit.origin || "",
        size: productToEdit.size || "",
        color: productToEdit.color || "",
        material: productToEdit.material || "",
        weight: productToEdit.weight || "",
        warranty: productToEdit.warranty || "",
        brand: productToEdit.brand || "",
      });
      setShowPreview(true);
    }
  }, [productToEdit]);

  useEffect(() => {
    if (
      formData.name ||
      formData.category ||
      formData.description ||
      formData.price ||
      formData.imagePreview
    ) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setFormData((prev) => ({
        ...prev,
        images: [],
        imagePreview: null,
        additionalImages: [],
      }));
      return;
    }

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

        const sizeInBytes = compressedImage.length * 0.75;
        if (sizeInBytes > 1000000) {
          alert(`Ảnh ${file.name} vẫn quá lớn sau khi nén.`);
          continue;
        }

        processedImages.push({
          file: file,
          base64: compressedImage,
          name: file.name,
          isMain: i === 0, // Ảnh đầu tiên mặc định là ảnh chính
          id: Date.now() + Math.random() + i,
        });
      }

      if (processedImages.length > 0) {
        updateImageOrder(processedImages);
      }
    } catch (error) {
      console.error("Image processing error:", error);
      alert("Có lỗi khi xử lý ảnh. Vui lòng thử lại.");
    }
  };

  // Cập nhật thứ tự ảnh và xác định ảnh chính
  const updateImageOrder = (images) => {
    const mainImageIndex = images.findIndex((img) => img.isMain);
    const mainImage = mainImageIndex >= 0 ? images[mainImageIndex] : images[0];

    // Đánh dấu tất cả ảnh không phải ảnh chính
    const updatedImages = images.map((img) => ({
      ...img,
      isMain: img.id === mainImage.id,
    }));

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      imagePreview: mainImage.base64,
      additionalImages: updatedImages
        .filter((img) => !img.isMain)
        .map((img) => ({
          base64: img.base64,
          name: img.name,
        })),
    }));
  };

  // Đặt ảnh làm ảnh chính
  const setMainImage = (targetId) => {
    const updatedImages = formData.images.map((img) => ({
      ...img,
      isMain: img.id === targetId,
    }));

    updateImageOrder(updatedImages);
  };

  // Xóa ảnh
  const removeImage = (targetId) => {
    const newImages = formData.images.filter((img) => img.id !== targetId);

    if (newImages.length === 0) {
      setFormData((prev) => ({
        ...prev,
        images: [],
        imagePreview: null,
        additionalImages: [],
      }));

      const fileInput = document.getElementById("productImage");
      if (fileInput) fileInput.value = "";
    } else {
      // Nếu xóa ảnh chính, đặt ảnh đầu tiên làm ảnh chính
      const currentMainExists = newImages.some((img) => img.isMain);
      if (!currentMainExists) {
        newImages[0].isMain = true;
      }

      updateImageOrder(newImages);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...formData.images];
    const draggedImage = newImages[draggedIndex];

    // Xóa ảnh từ vị trí cũ
    newImages.splice(draggedIndex, 1);
    // Chèn ảnh vào vị trí mới
    newImages.splice(dropIndex, 0, draggedImage);

    updateImageOrder(newImages);
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }
    if (!formData.category) {
      alert("Vui lòng chọn danh mục!");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Vui lòng nhập giá hợp lệ!");
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
        size: formData.size.trim(),
        color: formData.color.trim(),
        material: formData.material.trim(),
        weight: formData.weight.trim(),
        warranty: formData.warranty.trim(),
        brand: formData.brand.trim(),
      };

      if (!productToEdit) {
        productData.createdAt = new Date();
      }

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
        alert("✅ Sản phẩm đã được cập nhật thành công!");
      } else {
        await addProduct(productData);
        alert("✅ Sản phẩm đã được thêm thành công!");
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Có lỗi khi lưu sản phẩm: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
      size: "",
      color: "",
      material: "",
      weight: "",
      warranty: "",
      brand: "",
    });
    setShowPreview(false);

    const fileInput = document.getElementById("productImage");
    if (fileInput) fileInput.value = "";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="form-card">
      <h3 className="form-title">
        {productToEdit ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Thông tin cơ bản */}
        <div className="form-section">
          <h4 className="section-title">📝 Thông tin cơ bản</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: SP001, DAG001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Thương hiệu</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: Samsung, Apple, Nike"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá (VND) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập giá sản phẩm"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Tình trạng kho</label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                <label htmlFor="inStock">Còn hàng</label>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="form-section">
          <h4 className="section-title">📋 Thông tin chi tiết</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Xuất xứ</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: Trung Quốc, Việt Nam, Hàn Quốc"
              />
            </div>

            <div className="form-group">
              <label>Kích thước</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: 30x20x10 cm, Size M, XL"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Màu sắc</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: Đỏ, Xanh dương, Đa màu"
              />
            </div>

            <div className="form-group">
              <label>Chất liệu</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: Nhựa, Kim loại, Cotton"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Trọng lượng</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: 500g, 1.2kg, 2.5kg"
              />
            </div>

            <div className="form-group">
              <label>Bảo hành</label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                className="form-control"
                placeholder="VD: 12 tháng, 2 năm, 5 năm"
              />
            </div>
          </div>
        </div>

        <div className="form-group form-row-full">
          <label>Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Mô tả chi tiết sản phẩm..."
            rows="4"
          />
        </div>

        <div className="form-group form-row-full">
          <label>Ảnh sản phẩm (Tối đa 5 ảnh)</label>
          <div className="file-input">
            <input
              type="file"
              id="productImage"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <label htmlFor="productImage" className="file-input-label">
              {formData.images.length > 0
                ? `Đã chọn ${formData.images.length} ảnh`
                : "Chọn ảnh sản phẩm"}
            </label>
          </div>
          <small style={{ color: "#6c757d", fontSize: "12px" }}>
            💡 Bạn có thể kéo thả để sắp xếp ảnh hoặc click "Đặt làm ảnh chính"
            để chọn ảnh chính
          </small>
        </div>

        {/* Quản lý ảnh nâng cao */}
        {formData.images.length > 0 && (
          <div className="images-manager">
            <h5>📸 Quản lý ảnh sản phẩm:</h5>
            <div className="images-grid-advanced">
              {formData.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`image-item-advanced ${
                    image.isMain ? "main-image-item" : ""
                  } ${draggedIndex === index ? "dragging" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="image-container">
                    <img
                      src={image.base64}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />

                    {image.isMain && (
                      <div className="main-badge">
                        <span>⭐ Ảnh chính</span>
                      </div>
                    )}

                    <div className="image-overlay">
                      <div className="drag-handle" title="Kéo để sắp xếp">
                        ⋮⋮
                      </div>
                    </div>
                  </div>

                  <div className="image-controls">
                    <div className="image-info">
                      <span className="image-name">{image.name}</span>
                      <span className="image-position">
                        Vị trí: {index + 1}
                      </span>
                    </div>

                    <div className="image-actions">
                      {!image.isMain && (
                        <button
                          type="button"
                          onClick={() => setMainImage(image.id)}
                          className="btn-set-main"
                          title="Đặt làm ảnh chính"
                        >
                          ⭐ Đặt làm ảnh chính
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="btn-remove"
                        title="Xóa ảnh"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="images-help">
              <p>
                💡 <strong>Hướng dẫn:</strong>
              </p>
              <ul>
                <li>
                  Ảnh được đánh dấu ⭐ sẽ là ảnh chính hiển thị trên danh sách
                  sản phẩm
                </li>
                <li>Kéo thả ảnh để thay đổi thứ tự hiển thị</li>
                <li>Click "Đặt làm ảnh chính" để chọn ảnh chính</li>
                <li>Các ảnh khác sẽ hiển thị trong trang chi tiết sản phẩm</li>
              </ul>
            </div>
          </div>
        )}

        {/* Product Preview */}
        {showPreview && (
          <div className="preview-section">
            <h4>👁️ Xem trước sản phẩm:</h4>
            <div className="preview-product">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                />
              ) : (
                <div
                  className="no-image"
                  style={{ height: "150px", marginBottom: "15px" }}
                >
                  Không có ảnh
                </div>
              )}

              {formData.category && (
                <div className="product-category">
                  {getCategoryName(formData.category)}
                </div>
              )}

              <div className="product-name">
                {formData.name || "Tên sản phẩm"}
              </div>

              {formData.description && (
                <div className="product-description">
                  {formData.description}
                </div>
              )}

              <div className="product-price">
                {formData.price
                  ? parseInt(formData.price).toLocaleString("vi-VN") + " VND"
                  : "Giá sản phẩm"}
              </div>

              <div
                className={`product-stock ${
                  formData.inStock ? "in-stock" : "out-of-stock"
                }`}
              >
                {formData.inStock ? "✅ Còn hàng" : "❌ Hết hàng"}
              </div>

              {(formData.productCode ||
                formData.origin ||
                formData.size ||
                formData.color ||
                formData.material ||
                formData.weight ||
                formData.warranty ||
                formData.brand) && (
                <div className="product-details">
                  <h5>📋 Thông tin chi tiết:</h5>
                  <div className="detail-grid">
                    {formData.productCode && (
                      <div className="detail-item">
                        <strong>Mã sản phẩm:</strong> {formData.productCode}
                      </div>
                    )}
                    {formData.brand && (
                      <div className="detail-item">
                        <strong>Thương hiệu:</strong> {formData.brand}
                      </div>
                    )}
                    {formData.origin && (
                      <div className="detail-item">
                        <strong>Xuất xứ:</strong> {formData.origin}
                      </div>
                    )}
                    {formData.size && (
                      <div className="detail-item">
                        <strong>Kích thước:</strong> {formData.size}
                      </div>
                    )}
                    {formData.color && (
                      <div className="detail-item">
                        <strong>Màu sắc:</strong> {formData.color}
                      </div>
                    )}
                    {formData.material && (
                      <div className="detail-item">
                        <strong>Chất liệu:</strong> {formData.material}
                      </div>
                    )}
                    {formData.weight && (
                      <div className="detail-item">
                        <strong>Trọng lượng:</strong> {formData.weight}
                      </div>
                    )}
                    {formData.warranty && (
                      <div className="detail-item">
                        <strong>Bảo hành:</strong> {formData.warranty}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Đang lưu..."
              : productToEdit
              ? "Cập nhật sản phẩm"
              : "Thêm sản phẩm"}
          </button>

          {productToEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Hủy chỉnh sửa
            </button>
          )}

          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            Làm mới form
          </button>
        </div>
      </form>
    </div>
  );
}
