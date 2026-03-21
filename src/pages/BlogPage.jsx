import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

// Mock data (thay thế sau bằng DB)
const BLOG_POSTS = [
  {
    id: 1,
    title: "Hướng dẫn cách dán Decal Kính không bị bọt khí cực đơn giản",
    excerpt: "Dán decal kính là hạng mục thiết yếu để trang trí văn phòng làm việc. Áp dụng ngay mẹo nhỏ với xà phòng này để tự tay làm nhé.",
    date: "21 Mar 2026",
    author: "Admin Cửa Hàng",
    image: "https://images.unsplash.com/photo-1620023610034-77a83d7fca1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Hướng dẫn"
  },
  {
    id: 2,
    title: "Phân biệt các loại nhựa Mica trên thị trường hiện nay",
    excerpt: "Trên thị trường có Mica Đài Loan, Mica Trung Quốc... Làm sao để chọn đúng loại phù hợp cho vách ngăn, kệ siêu thị hay biển quảng cáo?",
    date: "15 Mar 2026",
    author: "Kỹ Thuật Viên",
    image: "https://images.unsplash.com/photo-1542157585-ef20bbcce178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Kiến thức vật liệu"
  },
  {
    id: 3,
    title: "Tấm Alu Alcorest và những ứng dụng phổ biến nhất",
    excerpt: "Aluminum Alcorest luôn là sự lựa chọn số 1 của anh em thợ quảng cáo. Khám phá lý do tại sao dòng vật liệu này lại thịnh hành đến vậy.",
    date: "05 Mar 2026",
    author: "Tân Phú Thành",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Tin tức"
  }
];

export function BlogPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-blue-100 text-brand-navy p-3 rounded-full mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight mb-4">TIN TỨC & KIẾN THỨC</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg hover:text-gray-700 transition-colors">
            Chia sẻ các mẹo thi công thực tế, thông tin vật liệu mới và cập nhật bảng giá từ Mica Tân Phú Thành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-200">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold uppercase px-3 py-1 rounded">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User size={14} className="mr-1" /> {post.author}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-navy transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link to="#" className="inline-flex items-center text-brand-orange font-semibold text-sm hover:text-orange-600 transition-colors">
                    Đọc tiếp <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">Đang cập nhật thêm bài viết mới...</p>
        </div>
      </div>
    </div>
  );
}
