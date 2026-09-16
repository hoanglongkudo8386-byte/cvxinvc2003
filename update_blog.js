const fs = require('fs');
const filePath = 'blog.html';
let content = fs.readFileSync(filePath, 'utf8');

const searchHtml = `
        <!-- Tìm kiếm & Danh mục -->
        <div class="blog-filters" style="max-width: 1200px; margin: 0 auto 40px; padding: 0 20px; display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; align-items: center;">
            <div class="search-box" style="display: flex; flex: 1; min-width: 300px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden;">
                <input type="text" placeholder="Tìm kiếm bài viết..." style="flex: 1; padding: 10px 15px; border: none; background: transparent; color: var(--text-primary); outline: none;">
                <button style="padding: 10px 20px; background: transparent; border: none; color: var(--accent-blue); cursor: pointer;"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div class="categories" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.9rem;">Tất cả</button>
                <button class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.9rem; background: transparent; border-color: transparent;">Marketing</button>
                <button class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.9rem; background: transparent; border-color: transparent;">AI Automation</button>
                <button class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.9rem; background: transparent; border-color: transparent;">SEO</button>
            </div>
        </div>
`;

if (!content.includes('blog-filters')) {
    let replaced = false;
    content = content.replace(/(<div class="blog-grid.*?>)/, (m) => { replaced = true; return searchHtml + '\n' + m; });
    if (replaced) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Added search and categories to blog.html');
    } else {
        console.log('Could not find blog-grid');
    }
} else {
    console.log('Search already exists');
}
