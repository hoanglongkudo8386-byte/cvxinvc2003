const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const filesToProcess = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'blog.html', 'blog-detail.html', 'contact.html'];

filesToProcess.forEach(filename => {
    let filePath = path.join(DIR, filename);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Revert .webp to .jpg (or png) if it was ai_marketing_illustration or avatar
        content = content.replace(/avatar\.webp/g, 'avatar.jpg');
        content = content.replace(/ai_marketing_illustration\.webp/g, 'ai_marketing_illustration.jpg');
        // And fix padding in hero
        content = content.replace(/padding-top: 80px;/, 'padding-top: 120px; padding-bottom: 60px;');
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
console.log('Fixed image paths');
