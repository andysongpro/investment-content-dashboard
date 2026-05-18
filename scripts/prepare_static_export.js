const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'out');
const cleanUrlPages = ['admin'];

for (const page of cleanUrlPages) {
  const htmlPath = path.join(outDir, `${page}.html`);
  const dirPath = path.join(outDir, page);
  const indexPath = path.join(dirPath, 'index.html');
  if (!fs.existsSync(htmlPath)) continue;
  fs.mkdirSync(dirPath, { recursive: true });
  fs.copyFileSync(htmlPath, indexPath);
  console.log(`prepared clean URL: /${page} -> ${path.relative(outDir, indexPath)}`);
}
