// scripts/copy-webviewer.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const sourcePath = path.resolve(__dirname, '../node_modules/@pdftron/pdfjs-express-viewer/public/');
const targetPath = path.resolve(__dirname, '../public/webviewer/lib');

if (!fs.existsSync(targetPath)) {
    console.log('📦 Copying WebViewer files to public/webviewer/lib...');
    fse.copySync(sourcePath, targetPath);
    console.log('✅ WebViewer files copied successfully!');
} else {
    console.log('✅ WebViewer lib already exists, skipping copy.');
}
