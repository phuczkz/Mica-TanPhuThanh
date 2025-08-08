import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";

export function CategorySection({ products }) {
  const [categories, setCategories] = useState([]);
  const [currentSlides, setCurrentSlides] = useState({}); // Track slide position for each category
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Initialize slide positions
        const initialSlides = {};
        categoriesData.forEach((category) => {
          initialSlides[category.id] = 0;
        });
        setCurrentSlides(initialSlides);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Group products by category
  const productsByCategory = {};
  products.forEach((product) => {
    const categoryId = product.category || "other";
    if (!productsByCategory[categoryId]) {
      productsByCategory[categoryId] = [];
    }
    productsByCategory[categoryId].push(product);
  });

  // Handle slide navigation
  const nextSlide = (categoryId, maxSlides) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [categoryId]:
        prev[categoryId] >= maxSlides - 1 ? 0 : prev[categoryId] + 1,
    }));
  };

  const prevSlide = (categoryId, maxSlides) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [categoryId]:
        prev[categoryId] <= 0 ? maxSlides - 1 : prev[categoryId] - 1,
    }));
  };

  return (
    <div>
      {categories.map((category) => {
        const categoryProducts = productsByCategory[category.id];

        if (!categoryProducts || categoryProducts.length === 0) {
          return null;
        }

        // Responsive products per slide: 2 on mobile, 3 on desktop
        const productsPerSlide = isMobile ? 2 : 3;
        const totalSlides = Math.ceil(
          categoryProducts.length / productsPerSlide
        );
        const currentSlideIndex = currentSlides[category.id] || 0;
        const startIndex = currentSlideIndex * productsPerSlide;
        const visibleProducts = categoryProducts.slice(
          startIndex,
          startIndex + productsPerSlide
        );

        return (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <span className="category-icon">🏷️</span>
              <h2 className="category-title">{category.name}</h2>
              <span className="product-count">
                ({categoryProducts.length} sản phẩm)
              </span>
            </div>

            <div className="products-carousel">
              {/* Previous Button - Desktop Only */}
              {totalSlides > 1 && !isMobile && (
                <button
                  className="carousel-btn prev-btn desktop-only"
                  onClick={() => prevSlide(category.id, totalSlides)}
                  title="Sản phẩm trước"
                >
                  ◀
                </button>
              )}

              {/* Products Grid */}
              <div className="products-grid">
                {visibleProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="product-card-link"
                  >
                    <div className="product-card">
                      {product.imageBase64 ? (
                        <img
                          src={product.imageBase64}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">Không có ảnh</div>
                      )}
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">
                        {product.price?.toLocaleString("vi-VN")} VND
                      </div>
                      <div className="product-stock">
                        {product.inStock !== false ? (
                          <span className="in-stock">✅ Còn hàng</span>
                        ) : (
                          <span className="out-stock">❌ Hết hàng</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Next Button - Desktop Only */}
              {totalSlides > 1 && !isMobile && (
                <button
                  className="carousel-btn next-btn desktop-only"
                  onClick={() => nextSlide(category.id, totalSlides)}
                  title="Sản phẩm tiếp theo"
                >
                  ▶
                </button>
              )}
            </div>

            {/* Navigation Controls - Mobile */}
            {totalSlides > 1 && (
              <div className="navigation-controls">
                {/* Previous Button - Mobile */}
                {isMobile && (
                  <button
                    className="carousel-btn prev-btn mobile-only"
                    onClick={() => prevSlide(category.id, totalSlides)}
                    title="Sản phẩm trước"
                  >
                    ◀
                  </button>
                )}

                {/* Slide Indicators */}
                <div className="slide-indicators">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      className={`indicator ${
                        index === currentSlideIndex ? "active" : ""
                      }`}
                      onClick={() =>
                        setCurrentSlides((prev) => ({
                          ...prev,
                          [category.id]: index,
                        }))
                      }
                    />
                  ))}
                </div>

                {/* Next Button - Mobile */}
                {isMobile && (
                  <button
                    className="carousel-btn next-btn mobile-only"
                    onClick={() => nextSlide(category.id, totalSlides)}
                    title="Sản phẩm tiếp theo"
                  >
                    ▶
                  </button>
                )}
              </div>
            )}

            {/* View All Link */}
            <div className="view-all-container">
              <Link
                to={`/products?category=${category.id}`}
                className="view-all-link"
              >
                Xem tất cả {categoryProducts.length} sản phẩm ▶
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
