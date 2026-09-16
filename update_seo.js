const fs = require('fs');
const path = require('path');

const filesToProcess = [
    'index.html',
    'about.html',
    'services.html',
    'portfolio.html',
    'blog.html',
    'blog-detail.html',
    'contact.html'
];

const DIR = __dirname;

const canonicalDomain = "https://hoangthelong.io.vn/";

const navHTML = `
    <!-- NAVBAR -->
    <nav id="navbar">
        <div class="nav-container">
            <a class="nav-logo" href="index.html">HTL</a>
            <div class="nav-links">
                <a class="nav-link {INDEX_ACTIVE}" href="index.html">Trang chủ</a>
                <a class="nav-link {ABOUT_ACTIVE}" href="about.html">Giới thiệu</a>
                <a class="nav-link {SERVICES_ACTIVE}" href="services.html">Dịch vụ</a>
                <a class="nav-link {PORTFOLIO_ACTIVE}" href="portfolio.html">Dự án</a>
                <a class="nav-link {BLOG_ACTIVE}" href="blog.html">Blog</a>
                <a class="nav-link {CONTACT_ACTIVE}" href="contact.html">Liên hệ</a>
            </div>
            <div class="hamburger">
                <span></span><span></span><span></span>
            </div>
        </div>
    </nav>
`;

const footerHTML = `
    <!-- FOOTER -->
    <footer id="footer">
        <div class="footer-content">
            <p class="footer-text">© 2026 Hoàng Thế Long. All rights reserved.</p>
            <div class="footer-links">
                <a href="index.html">Trang chủ</a> |
                <a href="services.html">Dịch vụ</a> |
                <a href="portfolio.html">Dự án</a> |
                <a href="blog.html">Blog</a> |
                <a href="contact.html">Liên hệ</a>
            </div>
        </div>
    </footer>
`;

const backToTopHTML = `
    <button class="back-to-top" aria-label="Back to top">
        <i class="fa-solid fa-arrow-up"></i>
    </button>
`;

filesToProcess.forEach(filename => {
    const filePath = path.join(DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Sync Navbar
    let customNav = navHTML
        .replace('{INDEX_ACTIVE}', filename === 'index.html' ? 'active' : '')
        .replace('{ABOUT_ACTIVE}', filename === 'about.html' ? 'active' : '')
        .replace('{SERVICES_ACTIVE}', filename === 'services.html' ? 'active' : '')
        .replace('{PORTFOLIO_ACTIVE}', filename === 'portfolio.html' ? 'active' : '')
        .replace('{BLOG_ACTIVE}', filename.includes('blog') ? 'active' : '')
        .replace('{CONTACT_ACTIVE}', filename === 'contact.html' ? 'active' : '');
    
    // Use regex to replace existing nav
    content = content.replace(/<nav id="navbar">[\s\S]*?<\/nav>/, customNav.trim());

    // 2. Sync Footer
    content = content.replace(/<footer id="footer">[\s\S]*?<\/footer>/, footerHTML.trim());

    // Ensure back to top exists right before </body>
    if (!content.includes('class="back-to-top"')) {
        content = content.replace('</body>', backToTopHTML + '\n</body>');
    }

    // 3. Update Title & Meta Description
    let pageTitle = "Hoàng Thế Long | Chuyên gia Digital Marketing & AI Automation";
    let desc = "Hoàng Thế Long - Chuyên gia Digital Marketing & AI Automation. Giải pháp tăng tốc doanh thu và hiệu suất bằng dữ liệu và trí tuệ nhân tạo. Liên hệ ngay!";
    
    if (filename === 'about.html') pageTitle = "Giới thiệu | Hoàng Thế Long - Digital Marketer";
    if (filename === 'services.html') pageTitle = "Dịch vụ Marketing & AI | Hoàng Thế Long - Digital Marketer";
    if (filename === 'portfolio.html') pageTitle = "Dự án Nổi bật | Hoàng Thế Long - Digital Marketer";
    if (filename === 'blog.html') pageTitle = "Blog Kiến thức & AI | Hoàng Thế Long - Digital Marketer";
    if (filename === 'contact.html') pageTitle = "Liên hệ | Hoàng Thế Long - Digital Marketer";
    if (filename === 'blog-detail.html') pageTitle = "Chi tiết bài viết | Hoàng Thế Long - Digital Marketer";

    content = content.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
    
    if (content.match(/<meta name="description" content=".*?">/)) {
        content = content.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}">`);
    } else {
        content = content.replace('</title>', `</title>\n    <meta name="description" content="${desc}">`);
    }

    // 4. Canonical & OG Tags
    const canonicalUrl = canonicalDomain + (filename === 'index.html' ? '' : filename);
    const ogTags = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="${filename.includes('blog') ? 'article' : 'website'}">
    <meta property="og:image" content="${canonicalDomain}assets/images/og-image.webp">
    `;

    // Remove existing og: and canonical tags to avoid duplicates
    content = content.replace(/<meta property="og:.*?">/g, '');
    content = content.replace(/<link rel="canonical".*?>/g, '');
    
    // Insert new tags after description
    content = content.replace(/<meta name="description".*?>/, `$&${ogTags}`);

    // 5. Schema JSON-LD
    let schemaType = filename === 'index.html' ? 'Person' : (filename.includes('blog') ? 'BlogPosting' : 'WebPage');
    let schemaJson = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "${schemaType}",
      "name": "Hoàng Thế Long",
      "url": "${canonicalUrl}",
      "description": "${desc}"
    }
    </script>
    `;
    
    // Remove existing schema if any, though likely none
    if (!content.includes('application/ld+json')) {
        content = content.replace('</head>', `${schemaJson}</head>`);
    }

    // 6. Image Optimization
    // Convert .jpg/.png to .webp in src, add loading="lazy" (if not already there), and alt if missing.
    content = content.replace(/<img([^>]*)>/g, (match, p1) => {
        let newAttrs = p1;
        // Convert ext to webp
        newAttrs = newAttrs.replace(/\.(jpg|jpeg|png)(["'])/gi, '.webp$2');
        
        // Add loading lazy if not hero/avatar
        if (!newAttrs.includes('loading=') && !newAttrs.includes('hero-avatar')) {
            newAttrs += ' loading="lazy"';
        }

        // Add alt if missing
        if (!newAttrs.includes('alt=')) {
            // Try to extract name from src
            let srcMatch = newAttrs.match(/src=["'](.*?)["']/);
            let altText = "Hoàng Thế Long image";
            if (srcMatch) {
                let basename = srcMatch[1].split('/').pop().split('.')[0];
                altText = basename.replace(/[-_]/g, ' ');
            }
            newAttrs += ` alt="${altText}"`;
        }

        return `<img${newAttrs}>`;
    });

    // 7. Blog Detail Enhancements
    if (filename === 'blog-detail.html') {
        const breadcrumb = `
        <div class="breadcrumb" style="padding: 20px 0; max-width: 800px; margin: 0 auto; color: var(--text-secondary);">
            <a href="index.html" style="color: var(--accent-1);">Trang chủ</a> > 
            <a href="blog.html" style="color: var(--accent-1);">Blog</a> > 
            <span>Chi tiết bài viết</span>
        </div>`;
        
        if (!content.includes('class="breadcrumb"')) {
            content = content.replace('<main>', `<main>\n${breadcrumb}`);
        }

        const relatedArticles = `
        <section class="related-articles" style="max-width: 800px; margin: 40px auto; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <h3>Bài viết liên quan</h3>
            <ul style="list-style: none; padding-left: 0; margin-top: 15px;">
                <li style="margin-bottom: 10px;"><a href="blog-detail.html" style="color: var(--accent-1);">Tương lai của AI trong Marketing</a></li>
                <li style="margin-bottom: 10px;"><a href="blog-detail.html" style="color: var(--accent-1);">Làm thế nào để tăng tỷ lệ chuyển đổi?</a></li>
            </ul>
        </section>`;
        
        if (!content.includes('class="related-articles"')) {
            content = content.replace('</article>', `</article>\n${relatedArticles}`);
        }
        
        // Social Share
        const socialShare = `
        <div class="social-share" style="margin: 20px 0; display: flex; gap: 10px;">
            <span style="font-weight: 500;">Chia sẻ:</span>
            <a href="#" style="color: #1877F2;"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" style="color: #0A66C2;"><i class="fa-brands fa-linkedin"></i></a>
        </div>`;
        
        if (!content.includes('class="social-share"')) {
            // Insert before content or after title
            content = content.replace('</h1>', `</h1>\n${socialShare}`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filename}`);
});
