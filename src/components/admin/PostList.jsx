export function PostList({
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
