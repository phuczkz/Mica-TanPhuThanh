import { useState, useRef } from "react";

import ReactQuill from "react-quill";
import "./quill-config";
import "./PostForm.css";
import { uploadImageToFirebase } from "../../services/imageUploadService";

// Định nghĩa modules cho ReactQuill (bên ngoài component)
function getQuillModules(quillRef, compressImage) {
  return {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: async function () {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();
          input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
              alert("❌ File quá lớn! Tối đa 10MB.");
              return;
            }
            // Nén ảnh trước khi upload
            const compressedBase64 = await compressImage(file, 150);
            const res = await fetch(compressedBase64);
            const blob = await res.blob();
            const nFile = new File([blob], file.name, { type: blob.type });
            const url = await uploadImageToFirebase(nFile, "post-content");
            const quill = quillRef.current?.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range ? range.index : 0, "image", url, "user");
          };

          // Handle adding images to content gallery (with compression)
          const handleContentImageAdd = async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            setLoading(true);
            const newImages = [];
            for (const file of files) {
              if (file.size > 10 * 1024 * 1024) {
                alert(`❌ File "${file.name}" quá lớn! Tối đa 10MB.`);
                continue;
              }
              const compressedBase64 = await compressImage(file, 150);
              newImages.push({
                id: Date.now() + Math.random(),
                name: file.name,
                base64: compressedBase64,
                size: compressedBase64.length,
              });
            }
            setFormData((prev) => ({
              ...prev,
              contentImages: [...prev.contentImages, ...newImages],
            }));
            setLoading(false);
            e.target.value = "";
          };
        },
      },
    },
  };
}

export function PostForm({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    imageBase64: post?.imageBase64 || "",
    contentImages: post?.contentImages || [],
    status: post?.status || "published",
    featured: post?.featured || false,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const quillRef = useRef(null);

  // Utility function to compress image
  const compressImage = (file, maxSizeKB = 300) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Start with quality 0.8 and reduce if needed
        let quality = 0.8;
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // Reduce quality until size is acceptable
        while (
          compressedDataUrl.length > maxSizeKB * 1024 * 1.37 &&
          quality > 0.1
        ) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressedDataUrl);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle main image with compression
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("❌ File quá lớn! Tối đa 10MB.");
      return;
    }

    try {
      const compressedImage = await compressImage(file, 300); // 300KB max for main image
      setFormData((prev) => ({ ...prev, imageBase64: compressedImage }));

      // Show compression info
      const originalSize = (file.size / 1024).toFixed(0);
      const compressedSize = (compressedImage.length / 1024 / 1.37).toFixed(0);
      console.log(`📊 Nén ảnh chính: ${originalSize}KB → ${compressedSize}KB`);
      setLoading(false);
      e.target.value = "";
    } catch (error) {
      console.error("Lỗi khi nén ảnh chính:", error);
      setLoading(false);
      alert("Đã xảy ra lỗi khi xử lý ảnh.");
    }
  };

  // Chèn ảnh vào ReactQuill editor
  const insertImageToContent = async (imageData) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      // Tạo file từ base64 để upload
      const res = await fetch(imageData.base64);
      const blob = await res.blob();
      const file = new File([blob], imageData.name, { type: blob.type });
      const url = await uploadImageToFirebase(file, "post-content");
      const range = quill.getSelection(true);
      quill.insertEmbed(range ? range.index : 0, "image", url, "user");
    }
  };

  // Remove content image (chỉ xóa khỏi gallery, không xóa trong nội dung quill)
  const removeContentImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: prev.contentImages.filter((img) => img.id !== imageId),
    }));
  };

  // Preview: render HTML từ ReactQuill
  const parseContentForPreview = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Calculate document size
  const calculateDocumentSize = () => {
    const dataStr = JSON.stringify(formData);
    const sizeInBytes = new Blob([dataStr]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(0);
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

    return {
      bytes: sizeInBytes,
      kb: sizeInKB,
    };
  };

  // Get current document size for display
  const currentSize = calculateDocumentSize();

  return (
    <div className="post-form enhanced">
      <div className="form-header">
        <h3>{post ? "✏️ Chỉnh sửa" : "✍️ Viết mới"}</h3>
        <div className="size-indicator">
          <span
            className={`size-badge ${
              currentSize.isValid ? "valid" : "invalid"
            }`}
          >
            📊 {currentSize.kb}KB / 1024KB
            {!currentSize.isValid && " ⚠️"}
          </span>
        </div>
        <button onClick={onCancel} className="btn btn-sm">
          ✖️
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>📝 Tiêu đề *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề..."
            maxLength="200"
            required
          />
          <small className="char-count">{formData.title.length}/200</small>
        </div>

        {/* Excerpt */}
        <div className="form-group">
          <label>📄 Tóm tắt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Tóm tắt ngắn..."
            rows="3"
            maxLength="300"
          />
          <small className="char-count">{formData.excerpt.length}/300</small>
        </div>

        {/* Main Image */}
        <div className="form-group">
          <label>🖼️ Hình ảnh chính (tự động nén xuống ~300KB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {formData.imageBase64 && (
            <div className="image-preview main-image">
              <img src={formData.imageBase64} alt="Preview" />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, imageBase64: "" }))
                }
                className="btn btn-sm btn-danger remove-btn"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Content with Images */}
        <div className="form-group content-section">
          <label>📰 Nội dung chi tiết *</label>

          {/* Content Tabs */}
          <div className="content-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "write" ? "active" : ""}`}
              onClick={() => setActiveTab("write")}
            >
              ✍️ Viết
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              👁️ Xem trước
            </button>
          </div>

          {/* Write Tab */}
          {activeTab === "write" && (
            <div className="write-section">
              <div className="content-toolbar">
                <label
                  className={`btn btn-sm btn-outline add-image-btn ${
                    loading ? "disabled" : ""
                  }`}
                >
                  📷 Thêm ảnh (tự động nén ~150KB)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleContentImageAdd}
                    style={{ display: "none" }}
                    disabled={loading}
                  />
                </label>
                <small className="toolbar-help">
                  💡 Ảnh sẽ được tự động nén để tối ưu kích thước
                </small>
              </div>
              <ReactQuill
                ref={quillRef}
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                modules={getQuillModules(quillRef, compressImage)}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "bullet",
                  "link",
                  "image",
                ]}
                placeholder="Viết nội dung chi tiết... Bạn có thể chèn ảnh trực tiếp vào bài viết. Ảnh sẽ tự động upload lên server."
              />
              <small className="char-count">
                {formData.content.replace(/<[^>]+>/g, "").length} ký tự
              </small>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === "preview" && (
            <div className="preview-section">
              <div className="content-preview">
                {formData.content.trim() ? (
                  parseContentForPreview(formData.content)
                ) : (
                  <p className="empty-preview">Chưa có nội dung để xem trước</p>
                )}
              </div>
            </div>
          )}

          {/* Content Images Gallery */}
          {formData.contentImages.length > 0 && (
            <div className="content-images-gallery">
              <h4>🖼️ Ảnh đã thêm ({formData.contentImages.length})</h4>
              <div className="images-grid">
                {formData.contentImages.map((image) => (
                  <div key={image.id} className="content-image-item">
                    <img src={image.base64} alt={image.name} />
                    <div className="image-actions">
                      <button
                        type="button"
                        onClick={() => insertImageToContent(image)}
                        className="btn btn-xs btn-primary"
                        title="Chèn vào nội dung"
                      >
                        📝 Chèn
                      </button>
                      <button
                        type="button"
                        onClick={() => removeContentImage(image.id)}
                        className="btn btn-xs btn-danger"
                        title="Xóa ảnh"
                      >
                        🗑️
                      </button>
                    </div>
                    <small className="image-name">{image.name}</small>
                    <small className="image-size">
                      {(image.size / 1024 / 1.37).toFixed(0)}KB
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post Options */}
        <div className="form-row">
          <div className="form-group">
            <label>📊 Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="published">✅ Xuất bản</option>
              <option value="draft">📝 Nháp</option>
              <option value="private">🔒 Riêng tư</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span className="checkmark"></span>⭐ Nổi bật
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            ❌ Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !currentSize.isValid}
            className={!currentSize.isValid ? "disabled" : ""}
          >
            {loading ? "⏳ Đang lưu..." : post ? "💾 Cập nhật" : "📤 Xuất bản"}
          </button>
        </div>
      </form>
    </div>
  );
}
