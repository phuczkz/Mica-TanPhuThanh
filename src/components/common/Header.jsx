import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Search, ShoppingCart, User, Menu, X, Phone, Mail } from "lucide-react";

export function Header({ onSearch, products = [] }) {
  const { currentUser, logout } = useAuth();
  const { getCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();

  const filteredProducts = searchTerm.trim().length > 0
    ? products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  useEffect(() => {
    setShowDropdown(searchTerm.trim().length > 0 && filteredProducts.length > 0);
  }, [searchTerm, filteredProducts.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full bg-white shadow-sm z-50 relative">
      {/* Top Bar - Navy */}
      <div className="bg-brand-navy text-white text-sm py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone size={14} className="mr-2" /> 0901436234</span>
            <span className="flex items-center"><Mail size={14} className="mr-2" /> Tanphuthanh@gmail.com</span>
          </div>
          <div className="flex space-x-4 text-gray-300">
            <span>Uy tín - Chất lượng - Nhanh chóng</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-brand-navy p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          {/* Fallback text if logo image fails, else render logo */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-brand-navy leading-none tracking-tight">MICA TẤN PHÚ THÀNH</span>
            <span className="text-xs text-brand-orange font-semibold uppercase tracking-widest mt-1">Vật tư Quảng cáo</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={inputRef}>
          <form onSubmit={handleSearch} className="w-full flex">
            <input
              type="text"
              placeholder="Nhập tên vật tư (ALU, MICA...)"
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.trim().length > 0 && filteredProducts.length > 0) setShowDropdown(true);
              }}
            />
            <button type="submit" className="bg-brand-orange text-white px-6 py-2.5 rounded-r-md hover:bg-orange-600 transition-colors">
              <Search size={20} />
            </button>
          </form>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-14 mt-1 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden z-50">
              <ul className="max-h-80 overflow-y-auto">
                {filteredProducts.slice(0, 5).map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                      onClick={() => { setShowDropdown(false); setSearchTerm(""); }}
                    >
                      <img src={product.imageBase64 || product.image || "/logo.svg"} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-brand-orange mt-0.5">{product.inStock !== false ? "Còn hàng" : <span className="text-red-500">Hết hàng</span>}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {currentUser ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Chào, <span className="font-semibold text-brand-navy">{currentUser.displayName || currentUser.email}</span>
              </div>
              {currentUser.role === "admin" && (
                <Link to="/admin" className="text-sm font-medium text-brand-orange hover:underline">Quản lý</Link>
              )}
              <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center text-brand-navy hover:text-brand-orange transition-colors">
              <User size={22} className="mr-1" />
              <span className="text-sm font-medium">Đăng nhập</span>
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center text-brand-navy hover:text-brand-orange transition-colors">
            <ShoppingCart size={26} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`md:block bg-gray-50 border-t items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:space-x-8 py-2 md:py-0">
            {[
              { path: "/", label: "TRANG CHỦ" },
              { path: "/store", label: "CỬA HÀNG" },
              { path: "/products", label: "SẢN PHẨM" },
              { path: "/blog", label: "BÀI VIẾT" },
              { path: "/contact", label: "LIÊN HỆ" }
            ].map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-3 md:py-4 text-sm font-bold tracking-wide transition-colors border-b-2 md:border-b-4 ${location.pathname === link.path ? 'text-brand-orange border-brand-orange' : 'text-gray-700 border-transparent hover:text-brand-orange'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Mobile Auth Links */}
            {!currentUser && (
              <li className="md:hidden py-3">
                <Link to="/login" className="text-brand-navy font-bold">ĐĂNG NHẬP</Link>
              </li>
            )}
            {currentUser && (
              <li className="md:hidden py-3 border-t mt-2 flex justify-between">
                {currentUser.role === "admin" && (
                  <Link to="/admin" className="text-brand-orange font-bold">QUẢN LÝ</Link>
                )}
                <button onClick={logout} className="text-red-600 font-bold">ĐĂNG XUẤT</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
