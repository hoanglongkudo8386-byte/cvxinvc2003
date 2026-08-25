---
name: web-builder
description: Đóng gói toàn bộ kinh nghiệm xây dựng website cá nhân chuẩn Portfolio/Personal Brand cho Hoàng Thế Long. Dùng khi tạo mới website, cải tiến, hoặc clone website theo phong cách đã xây dựng.
---

# Web Builder Skill - Kinh Nghiem Xay Dung Website HTL

Skill nay duc ket toan bo qua trinh xay dung website hoangthelong.com.

## 1. KIEN TRUC TONG THE

Stack: HTML5 + CSS3 + Vanilla JavaScript (khong framework)
- LocalStorage lam CSDL → hoat dong ngay khi mo file
- Supabase-ready → de nang cap len cloud database sau
- AI Engine SDK → cho phep AI Agent dang bai truc tiep

### Cau truc file
```
web ca nhan/
├── index.html          ← Trang chu (Single Page App)
├── admin.html          ← Trang quan tri (password protected)
├── view.htm            ← Doc bai blog chi tiet
├── css/
│   ├── style.css       ← Variables, reset, base styles
│   ├── components.css  ← Component UI (card, button, form)
│   └── responsive.css  ← Mobile breakpoints
├── js/
│   ├── supabase-config.js ← Database layer + seed data
│   ├── ai-api.js          ← AI Engine SDK
│   ├── main.js            ← Core: navbar, scroll, form
│   ├── portfolio.js       ← Render portfolio + blog
│   └── animations.js      ← Scroll animations
└── blog/               ← HTML files tung bai viet
```

## 2. DESIGN SYSTEM

### CSS Variables - Dark Mode
```css
:root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --bg-card: #1a1a28;
    --text-primary: #f0f0f5;
    --text-secondary: #8888aa;
    --accent-blue: #6c63ff;     /* Mau chu dao */
    --accent-cyan: #00d4ff;
    --accent-green: #00ff88;    /* Metric tich cuc */
    --accent-pink: #ff6b9d;
    --gradient-brand: linear-gradient(135deg, #6c63ff, #00d4ff);
}
```

### Font
- Heading: Space Grotesk (tech feel) - weight 600/700
- Body: Inter (professional) - weight 400/500
- Responsive size: clamp(2.5rem, 6vw, 5rem) cho h1

## 3. CAU TRUC TRANG CHU

Thu tu sections (da kiem chung):
1. #hero    - Tagline manh + CTA button
2. #about   - Gioi thieu + 3-4 so lieu an tuong
3. #services- 3-4 card dich vu
4. #portfolio - Du an (filter theo category)
5. #blog    - Bai viet moi nhat
6. #contact - Form + thong tin lien he
7. footer

### Hero Section Pattern
```html
<section id="hero">
    <div class="hero-badge"><span class="badge-dot"></span>Trang thai ngan</div>
    <h1>Chuc danh<br><span class="text-gradient">Diem khac biet</span></h1>
    <p class="hero-subtitle">1-2 cau gia tri cot loi</p>
    <div class="hero-cta">
        <a href="#portfolio" class="btn btn-primary">CTA Chinh</a>
        <a href="#contact" class="btn btn-secondary">CTA Phu</a>
    </div>
    <div class="hero-glow"></div>
</section>
```

## 4. DATABASE LAYER (LocalStorage)

### Nguyen tac
- Seed data hardcode → website co noi dung ngay tu dau
- Global instance: window.HTLDatabase
- Supabase-ready: co slot URL + anonKey

### Schema Blog Post
```javascript
{
    id: 'blog-' + Date.now(),
    title, slug,                 // slug tu dong sinh tu title
    category,                    // 'Content' | 'Facebook Ads' | 'AI'
    excerpt,                     // 120-140 ky tu
    content,                     // HTML content
    image_url,                   // Unsplash URL
    published_at: 'YYYY-MM-DD',
    status: 'published',
    views: Number
}
```

### Schema Portfolio Project
```javascript
{
    id: 'proj-' + Date.now(),
    title,
    category,        // 'website' | 'branding' | 'content' | 'ads'
    category_name,   // Ten hien thi tieng Viet
    image_url, description,
    metric_value,    // '+250%', '3x', '-45%'
    metric_label     // 'Chuyen doi', 'Toc do san xuat'
}
```

### Schema Lead/Contact
```javascript
{
    id: 'lead-' + Date.now(),
    name, email, subject, message,
    status: 'new' | 'processing' | 'completed',
    created_at: ISO String
}
```

### Ham slugify tieng Viet
```javascript
slugify(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
}
```

## 5. AI ENGINE SDK

Cho phep AI Agent (Antigravity, Claude, n8n) dang bai ma khong can UI.

### Dang bai blog
```javascript
window.HTLAIEngine.publishBlog({
    title: "Tieu de chuan SEO",
    category: "Content | Facebook Ads | AI",
    excerpt: "Tom tat 1-2 cau...",
    content: "<h3>Muc 1</h3><p>Noi dung...</p>",
    cover_image: "https://images.unsplash.com/photo-XXX?auto=format&fit=crop&w=800&q=80"
});
```

### Dang du an portfolio
```javascript
window.HTLAIEngine.publishProject({
    title: "Ten du an",
    category: "website",     // website | ads | content | branding
    category_name: "Website",
    description: "Ket qua dat duoc...",
    image_url: "https://...",
    metric_value: "+200%",
    metric_label: "Ty le chuyen doi"
});
```

### Lay thong ke
```javascript
window.HTLAIEngine.getDashboardStats();
// → { total_leads, new_leads, total_blogs, total_projects, latest_lead }
```

## 6. ANIMATION PATTERN (IntersectionObserver)

```javascript
// animations.js
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate 1 lan
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```css
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
```

## 7. MOBILE RESPONSIVE

### Hamburger Menu Pattern
```javascript
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
// Dong menu khi click link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});
```

### Breakpoints
```css
@media (max-width: 768px) {
    .nav-links { display: none; }
    .services-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
    .hero-cta { flex-direction: column; }
}
```

## 8. NGUON ANH CHUAN (Unsplash)

Format: https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=800&q=80

| Chu de | Photo ID |
|--------|----------|
| Marketing/Content | 1499750310107-5fef28a66643 |
| Facebook/Social | 1611162618071-b39a2ec055fb |
| AI/Technology | 1677442136019-21780efad99a |
| Website/Laptop | 1507238691740-187a5b1d37b8 |
| Branding/Product | 1542744094-3a31f272c490 |
| Data/Analytics | 1611162617474-5b21e879e113 |

Doi size: thay w=800 thanh w=400 (thumbnail) hoac w=1200 (fullsize)

## 9. BAI HOC & LOI DA GAP

| Loi | Nguyen nhan | Giai phap |
|-----|-------------|-----------|
| Blog khong hien thi | supabase-config.js load sau main.js | Load truoc trong head |
| Font khong load | Google Fonts bi block | Dung preconnect + font-display:swap |
| Animation khong chay | Thieu class CSS | Them animate-on-scroll vao HTML |
| Form khong luu | JS chay truoc DOM | Boc trong DOMContentLoaded |
| Mobile menu khong dong | Thieu click outside | Them document.addEventListener |
| Slug loi ky tu Viet | Khong normalize | Dung normalize('NFD') |
| CSV xuat loi encoding | Thieu BOM | Them \uFEFF dau chuoi |

### Quyet dinh kien truc dung
1. LocalStorage → khong can backend, deploy tinh mien phi
2. AI Engine SDK (window.HTLAIEngine) → AI publish khong can UI
3. Seed data hardcode → website co san noi dung
4. CSS Variables → doi theme chi sua 1 cho
5. clamp() → responsive typography khong can media query

## 10. TRANG ADMIN

### Tinh nang da xay dung
- Dashboard: thong ke leads, blogs, projects
- Leads: xem danh sach, doi trang thai, xoa, export CSV
- Blogs: xem, them bang form, xoa
- Portfolio: xem, them du an, xoa
- AI Engine: playground test, nut Quick Publish

### Bao mat toi thieu
```javascript
// Doi mat khau truoc khi deploy
if (pass === 'MATKHAU_MANH_CUA_BAN') { ... }
// Dung sessionStorage (reset khi dong tab)
sessionStorage.setItem('htl_admin_logged', 'true');
```

## 11. DEPLOY (Khong can server)

### Netlify (khuyen nghi)
1. Keo tha thu muc vao netlify.com/drop
2. Co link *.netlify.app ngay lap tuc
3. Ket noi custom domain: CNAME → Netlify

### GitHub Pages
Settings → Pages → Source: main branch, /root

### Luu y LocalStorage
- Moi domain la 1 LocalStorage rieng
- localhost va domain that KHONG share data
- Seed data hardcode giai quyet van de nay

## 12. BIEN CAN THAY KHI CLONE

```
[TEN]          → Hoang The Long
[CHUC_DANH]   → AI-Driven Marketer
[TAGLINE]     → Tang x3 hieu suat marketing bang AI
[DOMAIN]      → hoangthelong.com
[EMAIL]       → long@hoangthelong.com
[ADMIN_PASS]  → doi tu admin123 thanh mat khau manh
[AI_KEY]      → HTL_SECRET_AI_KEY_2026
```

## 13. CHECKLIST TAO WEBSITE MOI

Phase 1 - Setup (30 phut):
- [ ] index.html voi meta SEO day du
- [ ] CSS variables, import Google Fonts + Font Awesome

Phase 2 - Sections (2-3 gio):
- [ ] Hero + About + Services + Portfolio + Blog + Contact + Footer

Phase 3 - JavaScript (1-2 gio):
- [ ] supabase-config.js (seed data + CRUD)
- [ ] ai-api.js (AI Engine SDK)
- [ ] main.js (navbar, form, scroll)
- [ ] portfolio.js (render dynamic)
- [ ] animations.js (scroll reveal)

Phase 4 - Admin (1 gio):
- [ ] admin.html + admin.js + admin.css

Phase 5 - Kiem tra:
- [ ] Test mobile responsive
- [ ] Test form lien he
- [ ] Test AI Engine publishBlog/publishProject
- [ ] SEO: meta tags, heading, alt text

---
Skill tao ngay 2026-08-19 - Duc ket tu du an thuc te hoangthelong.com
## 14. QUY TRÌNH CHUYỂN ĐỔI MULTI-PAGE & DEPLOY TỰ ĐỘNG (2026)
Quy trình này được đúc kết từ yêu cầu khắt khe của Hoàng Thế Long: ""Website không được ở dạng cuộn, phải tách trang hoàn toàn"".

### 14.1. Kiến trúc Đa trang (Multi-page)
- Mỗi section (About, Services, Portfolio, Blog, Contact) được tách thành một file .html riêng biệt.
- File index.html chỉ chứa DUY NHẤT một màn hình Hero (Split-screen 100vh) và Navbar, cấm cuộn (overflow: hidden).
- Điều hướng: Thay vì dùng Scroll Anchor (#id), dùng đường dẫn tuyệt đối/tương đối (ví dụ: href=""about.html"").
- Navbar Logic: Bỏ IntersectionObserver, dùng window.location.pathname để xác định trang hiện tại và thêm class .active cho Nav link.
- UX mượt mà: Thêm hiệu ứng chuyển trang adeIn (ody.page-transition) bằng CSS để tránh chớp trắng.

### 14.2. Xử lý Hình ảnh Cá nhân & AI Minh họa
- Avatar: Luôn dùng thuộc tính CSS object-position: top center hoặc ackground-position: top center cho ảnh chân dung để không bị cắt mất phần tóc (lỗi từng gặp).
- Ảnh Blog/Dự án: Thay vì dùng ảnh mạng (Unsplash) nhàm chán, sử dụng tool sinh ảnh AI (generate_image) tạo minh họa 3D riêng biệt, tone màu Cyberpunk (xanh/tím) hợp với Dark Mode.

### 14.3. Kết nối Supabase & FormSubmit
- Cấu hình Supabase (Database tương lai): Nhúng Project URL và Anon Key vào supabase-config.js để làm nền móng sẵn sàng.
- Email Khách hàng: Dùng <form action=""https://formsubmit.co/email@domain.com"" method=""POST""> để đẩy trực tiếp thông tin liên hệ về hòm thư người dùng mà không cần code Backend hay xây bảng Supabase phức tạp.

### 14.4. Quy trình Đẩy code Tự động lên GitHub (Via API)
Thay vì bắt người dùng (không biết code) cài Git, ta dùng sức mạnh của API:
1. Yêu cầu người dùng cung cấp **GitHub Personal Access Token** (quyền epo).
2. Dùng PowerShell Invoke-RestMethod gọi API GitHub tạo kho chứa (Repository) tự động.
3. Chạy script duyệt qua từng file (HTML, CSS, JS, Ảnh) chuyển sang Base64 và PUT thẳng vào API GitHub.
4. Yêu cầu người dùng vào Vercel Import kho Github đó để có link .vercel.app.

### 14.5. Đẩy tạm (Preview) siêu nhanh bằng Surge.sh
Nếu người dùng không thể lấy GitHub Token, AI có thể dùng môi trường Node.js Portable (nếu có sẵn trên máy):
1. Cài đặt package surge thông qua npm.
2. Dùng command line surge + truyền vào Email & Token ẩn danh.
3. Đẩy file tạo ra đường link live (ví dụ: hoangthelong.surge.sh) ngay lập tức mà không cần tài khoản!
