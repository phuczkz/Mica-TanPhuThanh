import { useState, useEffect } from "react";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../../services/categoryService";
import { useAuth } from "../../context/AuthContext";

export function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    if (
      categories.find(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
      )
    ) {
      alert("Danh mục này đã tồn tại!");
      return;
    }

    setLoading(true);
    try {
      const categoryData = {
        name: newCategoryName,
        isDefault: false,
        createdAt: new Date(),
        createdBy: currentUser.email,
      };

      const newCategoryDocId = await addCategory(categoryData);
      const newCategory = {
        id: newCategoryDocId,
        ...categoryData,
      };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryName("");
      alert("✅ Danh mục đã được thêm thành công!");
    } catch (error) {
      alert("❌ Lỗi khi thêm danh mục: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
      alert("✅ Danh mục đã được xóa thành công!");
    } catch (error) {
      alert("❌ Lỗi khi xóa danh mục: " + error.message);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="form-card">
      {/* <h3 className="form-title">🏷️ Quản lý danh mục</h3> */}

      {/* Add Category Section */}
      <div className="form-group">
        <label>Thêm danh mục mới</label>
        <div className="category-input-group">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="form-control"
            placeholder="Nhập tên danh mục..."
            onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="form-group">
        <label>🔍 Tìm kiếm danh mục</label>
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
            placeholder="Nhập tên danh mục cần tìm..."
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="btn btn-clear"
              title="Xóa tìm kiếm"
            >
              ✖️
            </button>
          )}
        </div>

        {/* Search Results Summary */}
        <div className="search-results-summary">
          {searchTerm ? (
            filteredCategories.length > 0 ? (
              <span className="search-found">
                🎯 Tìm thấy {filteredCategories.length} / {categories.length}{" "}
                danh mục
              </span>
            ) : (
              <span className="search-not-found">
                ❌ Không tìm thấy danh mục nào phù hợp với "{searchTerm}"
              </span>
            )
          ) : (
            <span className="search-total">
              📋 Hiển thị tất cả {categories.length} danh mục
            </span>
          )}
        </div>
      </div>

      {/* Category List Section */}
      <div className="form-group">
        <label>
          Danh sách danh mục
          {searchTerm && (
            <span className="search-indicator"> - Kết quả tìm kiếm</span>
          )}
        </label>

        <div className="category-list">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <span className="category-name">
                    {searchTerm
                      ? // Highlight search term
                        category.name
                          .split(new RegExp(`(${searchTerm})`, "gi"))
                          .map((part, index) =>
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <mark key={index} className="search-highlight">
                                {part}
                              </mark>
                            ) : (
                              part
                            )
                          )
                      : category.name}
                  </span>
                  {category.isDefault && (
                    <span className="default-badge">Mặc định</span>
                  )}
                </div>

                <div className="category-actions">
                  {category.createdBy && (
                    <span className="created-by">👤 {category.createdBy}</span>
                  )}
                  {!category.isDefault && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="btn-delete-category"
                      title="Xóa danh mục"
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-categories">
              {searchTerm ? (
                <div className="no-search-results">
                  <p>
                    🔍 Không tìm thấy danh mục nào với từ khóa "
                    <strong>{searchTerm}</strong>"
                  </p>
                  <button
                    onClick={clearSearch}
                    className="btn btn-secondary btn-sm"
                  >
                    📋 Hiển thị tất cả danh mục
                  </button>
                </div>
              ) : (
                <p>📝 Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
