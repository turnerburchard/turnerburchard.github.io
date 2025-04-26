const fs = require('fs');
const path = require('path');

const galleryScriptPath = path.join(__dirname, 'js/gallery.js');
const baseFilesPath = path.join(__dirname, 'files');

const galleryDirs = {
    photos: path.join(baseFilesPath, 'photos'),
    wildlife: path.join(baseFilesPath, 'wildlife'),
    me: path.join(baseFilesPath, 'me'),
    art: path.join(baseFilesPath, 'art'),
};

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

function getGalleryImages(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            console.warn(`Directory not found: ${dirPath}, skipping.`);
            return [];
        }
        const files = fs.readdirSync(dirPath);
        return files
            .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
            // .sort(); // Removed alphabetical sort
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return [];
    }
}

console.log('Updating gallery definitions in js/gallery.js...');

const galleriesData = {};
for (const key in galleryDirs) {
    console.log(`Scanning ${galleryDirs[key]}...`);
    galleriesData[key] = {
        path: `files/${key}/`,
        images: getGalleryImages(galleryDirs[key]),
        containerId: `#${key} .gallery-container`
    };
}

// Construct the new galleries object string
let galleriesString = 'const galleries = {\n';
galleriesString += Object.entries(galleriesData).map(([key, data]) => {
    const imagesString = data.images.map(img => `'${img}'`).join(', ');
    return `    ${key}: {\n        path: '${data.path}',\n        images: [${imagesString}],\n        containerId: '${data.containerId}'\n    }`;
}).join(',\n');
galleriesString += '\n};';

// Read the existing script content
let scriptContent;
try {
    scriptContent = fs.readFileSync(galleryScriptPath, 'utf8');
} catch (error) {
    console.error(`Error reading ${galleryScriptPath}:`, error);
    process.exit(1);
}

// Define markers
const startMarker = '// START_GALLERY_DEFINITION';
const endMarker = '// END_GALLERY_DEFINITION';

// Find content before and after markers
const startIndex = scriptContent.indexOf(startMarker);
const endIndex = scriptContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Error: Could not find gallery definition markers in js/gallery.js.');
    process.exit(1);
}

const beforeText = scriptContent.substring(0, startIndex);
const afterText = scriptContent.substring(endIndex + endMarker.length);

// Assemble the new script content
const newScriptContent = 
    beforeText +
    startMarker + '\n' +
    galleriesString + '\n' +
    endMarker +
    afterText;

// Write the updated script back
try {
    fs.writeFileSync(galleryScriptPath, newScriptContent, 'utf8');
    console.log('Successfully updated js/gallery.js!');
} catch (error) {
    console.error(`Error writing updated ${galleryScriptPath}:`, error);
    process.exit(1);
} 