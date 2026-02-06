import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DATA_DIR = path.resolve('public/data');
const OUTPUT_DIR = path.resolve('public/api');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'reports.json');

// Ensure output directory exists
function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function scanDirectory(dir) {
    let results = [];
    const fullPath = path.resolve(dir);
    if (!fs.existsSync(fullPath)) return results;

    const list = fs.readdirSync(fullPath);
    list.forEach(file => {
        // Skip .git-like directories
        if (file.startsWith('.')) return;

        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(scanDirectory(filePath));
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            
            // Construct a relative path for frontend to fetch
            // e.g., /data/Semiconductor/2330/20260201.md
            const relativePath = 'data/' + path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
            
            results.push({
                ...data,
                filePath: relativePath,
                id: data.id || path.basename(path.dirname(filePath)), // Fallback to folder name
                stockName: data.stockName || 'Unknown',
                category: data.category || 'Uncategorized',
                date: data.date || 'Unknown'
            });
        }
    });
    return results;
}

export function generateReportsIndex() {
    console.log('Scanning data directory...');
    ensureDirectory(OUTPUT_DIR);
    const reports = scanDirectory(DATA_DIR);

    console.log(`Found ${reports.length} reports.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(reports, null, 2));
    console.log(`Index generated at ${OUTPUT_FILE}`);
}

// Run if called directly
if (process.argv[1] === path.resolve('scripts/generate-index.js')) {
    generateReportsIndex();
}
