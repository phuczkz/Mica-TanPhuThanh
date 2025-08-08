import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
// import { Header } from "../common/Header";
import "../../styles/ProductDetail.css";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        const foundProduct = productsData.find((p) => p.id === id);
        if (!foundProduct) {
          setError("Không tìm thấy sản phẩm");
          return;
        }

        const foundCategory = categoriesData.find(
          (c) => c.id === foundProduct.category
        );

        setProduct(foundProduct);
        setCategory(foundCategory);
      } catch (err) {
        setError("Có lỗi khi tải thông tin sản phẩm");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Auto play slideshow - FIX: Sử dụng useCallback để tránh re-render không cần thiết
  useEffect(() => {
    if (isAutoPlay && product) {
      const allImages = [
        product.imageBase64,
        ...(product.additionalImages?.map((img) => img.base64) || []),
      ].filter(Boolean);

      if (allImages.length > 1) {
        // Clear interval cũ trước khi tạo mới
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
        }

        const interval = setInterval(() => {
          setSelectedImage((prev) =>
            prev >= allImages.length - 1 ? 0 : prev + 1
          );
        }, 3000);

        setAutoPlayInterval(interval);

        return () => {
          clearInterval(interval);
        };
      }
    } else {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    }
    // FIX: Loại bỏ selectedImage khỏi dependency array để tránh reset interval liên tục
  }, [isAutoPlay, product, autoPlayInterval]);

  // FIX: Sử dụng useCallback cho handleKeyDown
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowImageModal(false);
      setShowNotification(false);
    }
  }, []); // Không có dependencies vì chỉ cần check key

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setShowNotification(true);
  };

  const handleBuyNow = () => {
    setShowNotification(true);
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    setIsAutoPlay(false); // Dừng auto play khi user click
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  // FIX: Thêm handleKeyDown vào dependency array
  useEffect(() => {
    if (showImageModal || showNotification) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal, showNotification, handleKeyDown]); // FIX: Thêm handleKeyDown

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  if (loading) {
    return (
      <div>
        <div className="loading-container">
          <div className="loading">Đang tải thông tin sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <div className="error-container">
          <div className="error-message">
            <h2>❌ {error || "Không tìm thấy sản phẩm"}</h2>
            <button onClick={() => navigate("/")} className="btn-back">
              ← Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tạo mảng ảnh (ảnh chính + ảnh bổ sung)
  const allImages = [
    product.imageBase64,
    ...(product.additionalImages?.map((img) => img.base64) || []),
  ].filter(Boolean);

  return (
    <div>
      <div className="product-detail-container">
        <div className="breadcrumb">
          <span onClick={() => navigate("/")} className="breadcrumb-link">
            Trang chủ
          </span>
          <span className="breadcrumb-separator"> › </span>
          {category && (
            <>
              <span className="breadcrumb-item">{category.name}</span>
              <span className="breadcrumb-separator"> › </span>
            </>
          )}
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-detail-content">
          {/* Phần ảnh sản phẩm */}
          <div className="product-images">
            <div className="main-image" onClick={handleImageClick}>
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="main-product-image"
                />
              ) : (
                <div className="no-main-image">Không có ảnh</div>
              )}
              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <div className="image-navigation">
                  <button
                    className="nav-btn prev-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage > 0
                          ? selectedImage - 1
                          : allImages.length - 1
                      );
                      setIsAutoPlay(false);
                    }}
                  >
                    &#8249;
                  </button>
                  <button
                    className="nav-btn next-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage < allImages.length - 1
                          ? selectedImage + 1
                          : 0
                      );
                      setIsAutoPlay(false);
                    }}
                  >
                    &#8250;
                  </button>
                </div>
              )}
              {allImages.length > 0 && (
                <div className="zoom-hint">🔍 Click để xem ảnh lớn</div>
              )}
              {allImages.length > 1 && (
                <div className="image-controls">
                  <button
                    className={`auto-play-btn ${isAutoPlay ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAutoPlay();
                    }}
                    title={
                      isAutoPlay ? "Tắt tự động chuyển" : "Bật tự động chuyển"
                    }
                  >
                    {isAutoPlay ? "⏸️" : "▶️"}
                  </button>
                  <div className="image-counter">
                    {selectedImage + 1} / {allImages.length}
                  </div>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="image-thumbnails">
                {allImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-info">
            {category && (
              <div className="product-category-badge">{category.name}</div>
            )}

            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-section">
              <span className="current-price">
                {product.price?.toLocaleString("vi-VN")} VND
              </span>
              <div className="stock-status">
                <span
                  className={`stock-badge ${
                    product.inStock !== false ? "in-stock" : "out-stock"
                  }`}
                >
                  {product.inStock !== false ? "✅ Còn hàng" : "❌ Hết hàng"}
                </span>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            {(product.productCode ||
              product.brand ||
              product.origin ||
              product.size ||
              product.color ||
              product.material ||
              product.weight ||
              product.warranty) && (
              <div className="product-specifications">
                <h3>📋 Thông tin cơ bản:</h3>
                <div className="spec-grid">
                  {product.productCode && (
                    <div className="spec-item">
                      <span className="spec-label">Mã sản phẩm:</span>
                      <span className="spec-value">{product.productCode}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="spec-item">
                      <span className="spec-label">Thương hiệu:</span>
                      <span className="spec-value">{product.brand}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="spec-item">
                      <span className="spec-label">Xuất xứ:</span>
                      <span className="spec-value">{product.origin}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="spec-item">
                      <span className="spec-label">Kích thước:</span>
                      <span className="spec-value">{product.size}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="spec-item">
                      <span className="spec-label">Màu sắc:</span>
                      <span className="spec-value">{product.color}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="spec-item">
                      <span className="spec-label">Chất liệu:</span>
                      <span className="spec-value">{product.material}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="spec-item">
                      <span className="spec-label">Trọng lượng:</span>
                      <span className="spec-value">{product.weight}</span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="spec-item">
                      <span className="spec-label">Bảo hành:</span>
                      <span className="spec-value">{product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chọn số lượng và mua hàng */}
            {product.inStock !== false && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Số lượng:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="quantity-btn"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-add-cart"
                  >
                    🛒 Thêm vào giỏ hàng
                  </button>
                  <button onClick={handleBuyNow} className="btn btn-buy-now">
                    💰 Mua ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        {product.description && (
          <div className="product-description-section">
            <h3>📝 Mô tả sản phẩm</h3>
            <div className="product-description">{product.description}</div>
          </div>
        )}

        {/* Nút quay lại */}
        <div className="back-button-section">
          <button onClick={() => navigate("/")} className="btn-back">
            ← Quay lại trang chủ
          </button>
        </div>

        {/* Image Modal */}
        {showImageModal && allImages.length > 0 && (
          <div className="image-modal" onClick={closeImageModal}>
            <div className="image-modal-content">
              <span className="image-modal-close" onClick={closeImageModal}>
                &times;
              </span>
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="modal-image"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="modal-image-info">
                <p>{product.name}</p>
                {allImages.length > 1 && (
                  <p>
                    Ảnh {selectedImage + 1} / {allImages.length}
                  </p>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="modal-navigation">
                  <button
                    className="modal-nav-btn prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage > 0
                          ? selectedImage - 1
                          : allImages.length - 1
                      );
                    }}
                  >
                    &#8249;
                  </button>
                  <button
                    className="modal-nav-btn next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage < allImages.length - 1
                          ? selectedImage + 1
                          : 0
                      );
                    }}
                  >
                    &#8250;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {showNotification && (
          <div className="notification-modal" onClick={closeNotification}>
            <div
              className="notification-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notification-icon">
                <div className="icon-circle">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H14V9H19V21Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <div className="notification-header">
                <h3>Thông báo quan trọng</h3>
                <button
                  className="notification-close"
                  onClick={closeNotification}
                  aria-label="Đóng thông báo"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="notification-body">
                <h4>Cửa hàng Mica Tấn Phú Thành</h4>
                <p>
                  Cảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi! Để được tư
                  vấn chi tiết và mua hàng với giá tốt nhất, bạn vui lòng ghé
                  thăm cửa hàng trực tiếp hoặc liên hệ tới số điện thoại
                  <strong> 0909 123 456</strong>. Chúng tôi luôn sẵn sàng
                  hỗ trợ bạn 24/7.
                </p>
                <div className="notification-features">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Tư vấn miễn phí</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Giá cả cạnh tranh</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🚚</span>
                    <span>Hỗ trợ vận chuyển</span>
                  </div>
                </div>
              </div>

              <div className="notification-footer">
                <button
                  className="btn btn-notification-secondary"
                  onClick={closeNotification}
                >
                  Để sau
                </button>
                <button
                  className="btn btn-notification-primary"
                  onClick={closeNotification}
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
