import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://moneyfeast.com'; // Replace with actual domain
const PUBLIC_DIR = path.join(__dirname, '../public');

const routes = [
    '/',
    '/search',
    // Add other static routes here
];

// In a real scenario, you might fetch dynamic routes from Supabase here
// For now, we'll just generate the static structure

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
        .map((route) => {
            return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
        })
        .join('\n')}
</urlset>`;

try {
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully!');
} catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
}
