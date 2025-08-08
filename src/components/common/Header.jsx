import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/Header.css";

export function Header({ onSearch, products = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  // Lọc sản phẩm theo searchTerm
  const filteredProducts =
    searchTerm.trim().length > 0
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };
  // Hiện dropdown khi nhập
  useEffect(() => {
    if (searchTerm.trim().length > 0 && filteredProducts.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, filteredProducts.length]);
  // Ẩn dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Đóng menu khi click outside hoặc resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".main-nav")) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Lock/unlock body scroll khi menu mở/đóng
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "unset";
    }

    // Cleanup khi component unmount
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="main-header">
      <div className="top-bar">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Tấn Phú Thành" className="logo-img" />
            </Link>
          </div>
          <div className="header-actions">
            <div className="cart-info">
              <span className="cart-icon">🛒</span>
              <span className="cart-count">2</span>
            </div>
            <div className="hotline-info">
              <span className="hotline-label">Hotline:</span>
              <a href="tel:0989305754" className="hotline-number">
                0989 305 754
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`header-main${
          showDropdown ? " search-dropdown-active" : ""
        }`}
      >
        <div className="container header-content">
          <div
            className="search-dropdown-wrapper"
            ref={inputRef}
            style={{ position: "relative", width: "100%", maxWidth: 400 }}
          >
            <form
              onSubmit={handleSearch}
              className="search-form"
              autoComplete="off"
            >
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                onFocus={() => {
                  if (
                    searchTerm.trim().length > 0 &&
                    filteredProducts.length > 0
                  )
                    setShowDropdown(true);
                }}
              />
              <button type="submit" className="search-btn">
                TÌM KIẾM
              </button>
            </form>

            {showDropdown && (
              <ul className="search-dropdown-menu">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="search-dropdown-item">
                    <Link
                      to={`/products/${product.id}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchTerm("");
                      }}
                      className="search-dropdown-link"
                    >
                      <img
                        src={
                          product.imageBase64 ||
                          product.image ||
                          "/no-image.png"
                        }
                        alt={product.name}
                        className="search-dropdown-thumb"
                      />
                      <div className="search-dropdown-info">
                        <div className="search-dropdown-name">
                          {product.name}
                        </div>
                        <div
                          className={`search-dropdown-status ${
                            product.inStock ? "in-stock" : "out-stock"
                          }`}
                        >
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
                {filteredProducts.length === 0 && (
                  <li className="search-dropdown-item no-result">
                    Không tìm thấy sản phẩm
                  </li>
                )}
              </ul>
            )}
          </div>
          <Link to="/login" className="admin-login-btn">
            👤
          </Link>
        </div>
      </div>
      <nav className="main-nav">
        <div className="container nav-content">
          <button
            className="mobile-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

          <ul className={`nav-menu ${isMenuOpen ? "nav-menu-open" : ""}`}>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                TRANG CHỦ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/store"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                CỬA HÀNG
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                SẢN PHẨM
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/blog"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                BÀI VIẾT
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Overlay khi menu mở */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}
