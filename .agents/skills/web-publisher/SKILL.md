---
name: web-publisher
description: Tự động biên tập và đăng ngay bài viết Blog hoặc dự án Portfolio lên trang web của Hoàng Thế Long (hoangthelong.com) thông qua AI Engine API SDK.
---

# Web Publisher Skill - Hoàng Thế Long Personal Website

Skill này cho phép Antigravity tự động biên tập bài viết chuẩn SEO, định dạng HTML/Markdown và đăng tức thì bài viết hoặc dự án Portfolio lên hệ thống CSDL của Hoàng Thế Long.

## Khi nào sử dụng:
- Khi người dùng (Hoàng Thế Long) yêu cầu: *"Viết cho tôi 1 bài blog về X và đăng ngay lên web"*, *"Thêm dự án Y vào portfolio giúp tôi"*, *"Đăng bài viết mới lên trang hoangthelong.com"*.

## Hướng dẫn thực thi:

### 1. Xuất bản bài viết Blog mới
Để tạo bài viết mới và đăng trực tiếp lên website, sử dụng mã Javascript gọi `HTLAIEngine.publishBlog`:

```javascript
window.HTLAIEngine.publishBlog({
    title: "Tiêu đề bài viết chuẩn SEO",
    category: "Danh mục (ví dụ: Content, Facebook Ads, AI Automation)",
    excerpt: "Tóm tắt ngắn gọn bài viết trong 1-2 câu...",
    content: "<h3>1. Tiêu đề mục 1</h3><p>Nội dung chi tiết...</p>",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80"
});
```

### 2. Xuất bản dự án Portfolio mới
Đưa dự án mới vào trang chủ:

```javascript
window.HTLAIEngine.publishProject({
    title: "Tên dự án mới",
    category: "website", // website | ads | content | branding
    category_name: "Website",
    description: "Mô tả kết quả công việc đạt được...",
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    metric_value: "+200%",
    metric_label: "Tỷ lệ tăng trưởng"
});
```

### 3. Quy trình thực hiện tự động:
1. Sáng tạo nội dung hấp dẫn, chuẩn SEO theo văn phong Marketing chuyên nghiệp của Long.
2. Thêm bài viết vào CSDL bằng API Engine.
3. Thông báo cho Long link hoặc kết quả bài viết đã được đăng công khai trên website ngay lập tức.
