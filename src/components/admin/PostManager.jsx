import { useState, useEffect } from "react";
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
} from "../../services/postService";
import { useAuth } from "../../context/AuthContext";

// PostForm Component
function PostForm({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    imageBase64: post?.imageBase64 || "",
    contentImages: post?.contentImages || [], // Array để lưu ảnh trong nội dung
    status: post?.status || "published",
    featured: post?.featured || false,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // "write" hoặc "preview"

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle main image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ File quá lớn! Tối đa 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, imageBase64: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle content images
  const handleContentImageAdd = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`❌ File ${file.name} quá lớn! Tối đa 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + Math.random(),
          base64: e.target.result,
          name: file.name,
          size: file.size,
        };

        setFormData((prev) => ({
          ...prev,
          contentImages: [...prev.contentImages, imageData],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  // Insert image into content
  const insertImageToContent = (imageData) => {
    const imageMarkdown = `\n\n![${imageData.name}](${imageData.base64})\n\n`;
    const textarea = document.querySelector('textarea[name="content"]');
    const cursorPos = textarea.selectionStart;
    const textBefore = formData.content.substring(0, cursorPos);
    const textAfter = formData.content.substring(cursorPos);

    setFormData((prev) => ({
      ...prev,
      content: textBefore + imageMarkdown + textAfter,
    }));

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPos + imageMarkdown.length,
        cursorPos + imageMarkdown.length
      );
    }, 100);
  };

  // Remove content image
  const removeContentImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: prev.contentImages.filter((img) => img.id !== imageId),
    }));
  };

  // Parse content for preview
  const parseContentForPreview = (content) => {
    return content.split("\n").map((line, index) => {
      // Handle images
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        return (
          <div key={index} className="preview-image">
            <img src={imageMatch[2]} alt={imageMatch[1]} />
            <p className="image-caption">{imageMatch[1]}</p>
          </div>
        );
      }

      // Handle line breaks
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular text
      return <p key={index}>{line}</p>;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("❌ Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="post-form enhanced">
      <div className="form-header">
        <h3>{post ? "✏️ Chỉnh sửa" : "✍️ Viết mới"}</h3>
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
          <label>🖼️ Hình ảnh chính</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
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
                <label className="btn btn-sm btn-outline add-image-btn">
                  📷 Thêm ảnh
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleContentImageAdd}
                    style={{ display: "none" }}
                  />
                </label>
                <small className="toolbar-help">
                  💡 Tip: Chọn ảnh → Click "Chèn" → Ảnh sẽ được thêm vào vị trí
                  con trỏ
                </small>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Viết nội dung chi tiết...&#10;&#10;💡 Bạn có thể:&#10;- Thêm ảnh bằng nút 'Thêm ảnh'&#10;- Viết text bình thường&#10;- Xuống dòng để tạo đoạn mới"
                rows="15"
                required
              />
              <small className="char-count">
                {formData.content.length} ký tự
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
              <h4>🖼️ Ảnh trong bài viết ({formData.contentImages.length})</h4>
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
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang lưu..." : post ? "💾 Cập nhật" : "📤 Xuất bản"}
          </button>
        </div>
      </form>
    </div>
  );
}

// PostList Component
function PostList({
  posts,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  totalPosts,
}) {
  const formatDate = (date) => {
    if (!date) return "Chưa xác định";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("vi-VN");
  };

  const truncate = (text, length = 120) =>
    text?.length > length ? text.substring(0, length) + "..." : text || "";

  const highlight = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      );
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: "✅ Xuất bản",
      draft: "📝 Nháp",
      private: "🔒 Riêng tư",
    };
    return badges[status] || "📝 Nháp";
  };

  return (
    <div className="post-list">
      {/* Search */}
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Tìm kiếm bài viết..."
          />
          {searchTerm && <button onClick={() => onSearchChange("")}>✖️</button>}
        </div>

        <div className="search-results">
          {searchTerm ? (
            <span className={posts.length > 0 ? "found" : "not-found"}>
              {posts.length > 0
                ? `🎯 ${posts.length}/${totalPosts} bài viết`
                : `❌ Không tìm thấy "${searchTerm}"`}
            </span>
          ) : (
            <span>📋 {totalPosts} bài viết</span>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="no-posts">
          {searchTerm ? (
            <>🔍 Không tìm thấy bài viết</>
          ) : (
            <>📝 Chưa có bài viết nào</>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.featured && <div className="featured">⭐</div>}

              <div className="post-image">
                {post.imageBase64 ? (
                  <img src={post.imageBase64} alt={post.title} />
                ) : (
                  <div className="no-image">📷</div>
                )}
              </div>

              <div className="post-content">
                <h3>{highlight(post.title, searchTerm)}</h3>

                {post.excerpt && (
                  <p className="excerpt">
                    {highlight(truncate(post.excerpt, 80), searchTerm)}
                  </p>
                )}

                <p className="preview">
                  {highlight(truncate(post.content, 100), searchTerm)}
                </p>

                <div className="post-meta">
                  <span>👤 {post.authorName || post.author}</span>
                  <span>📅 {formatDate(post.createdAt)}</span>
                </div>

                <div className="post-footer">
                  <span className={`status status-${post.status}`}>
                    {getStatusBadge(post.status)}
                  </span>

                  <div className="actions">
                    <button onClick={() => onEdit(post)} className="btn-edit">
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main PostManager Component
export function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postToEdit, setPostToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      alert("❌ Lỗi tải bài viết: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePost = async (postData) => {
    try {
      const authorData = {
        author: currentUser.email,
        authorName: currentUser.displayName || currentUser.email,
      };

      if (postToEdit) {
        await updatePost(postToEdit.id, postData);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postToEdit.id
              ? { ...p, ...postData, updatedAt: new Date() }
              : p
          )
        );
        alert("✅ Cập nhật thành công!");
      } else {
        const newPostId = await addPost({ ...postData, ...authorData });
        setPosts((prev) => [
          { id: newPostId, ...postData, ...authorData, createdAt: new Date() },
          ...prev,
        ]);
        alert("✅ Thêm bài viết thành công!");
      }
      resetForm();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Xóa bài viết này?")) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert("✅ Xóa thành công!");
    } catch (error) {
      alert("❌ Lỗi xóa: " + error.message);
    }
  };

  const resetForm = () => {
    setPostToEdit(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">⏳ Đang tải...</div>;

  return (
    <div className="post-manager">
      <div className="header">
        <h2>📝 Quản lý bài viết</h2>
        <p className="page-subtitle">
          Tạo và quản lý các bài viết giới thiệu cửa hàng
        </p>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ✍️ Viết bài mới
          </button>
        )}
      </div>

      {showForm ? (
        <PostForm
          post={postToEdit}
          onSave={handleSavePost}
          onCancel={resetForm}
        />
      ) : (
        <PostList
          posts={filteredPosts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={(post) => {
            setPostToEdit(post);
            setShowForm(true);
          }}
          onDelete={handleDeletePost}
          totalPosts={posts.length}
        />
      )}
    </div>
  );
}

// Export both components
export { PostForm, PostList };
