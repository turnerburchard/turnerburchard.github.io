const fs = require('fs').promises; // Use promise-based fs
const path = require('path');
const sharp = require('sharp');

// --- Configuration ---
const imageDirs = [
    path.join(__dirname, 'files/photos'),
    path.join(__dirname, 'files/wildlife'),
    path.join(__dirname, 'files/me'),
    path.join(__dirname, 'files/art'),
];
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff']; // Add more if needed
const maxDimension = 1920; // Max width or height in pixels
const jpegQuality = 80;    // Quality setting for JPEG output (0-100)
// ---------------------

async function findImageFiles(dir) {
    let imageFiles = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                // Skip directories for now, but could recurse if needed
                // imageFiles = imageFiles.concat(await findImageFiles(fullPath));
            } else if (supportedExtensions.includes(path.extname(entry.name).toLowerCase())) {
                imageFiles.push(fullPath);
            }
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Directory not found, skipping: ${dir}`);
        } else {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    return imageFiles;
}

async function optimizeImage(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);
        const image = sharp(filePath);
        const metadata = await image.metadata();

        let needsResize = false;
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
            needsResize = true;
        }

        let sharpInstance = image;

        if (needsResize) {
            sharpInstance = sharpInstance.resize({
                width: maxDimension,
                height: maxDimension,
                fit: 'inside', // Maintains aspect ratio, fits within dimensions
                withoutEnlargement: true // Don't enlarge smaller images
            });
        }

        // Convert to JPEG with specified quality
        // Use toBuffer to process before overwriting
        const optimizedBuffer = await sharpInstance
            .jpeg({ quality: jpegQuality, progressive: true })
            .toBuffer();

        // Overwrite the original file
        await fs.writeFile(filePath, optimizedBuffer);
        console.log(`   Optimized: ${path.basename(filePath)}`);

    } catch (error) {
        console.error(`   Error processing ${path.basename(filePath)}:`, error.message);
    }
}

async function runOptimization() {
    console.log('--- Starting Image Optimization --- ');
    console.warn('WARNING: This script will OVERWRITE original image files!');
    console.warn('Please ensure you have backups before proceeding.');
    console.log(`Settings: Max Dimension=${maxDimension}px, JPEG Quality=${jpegQuality}`);
    console.log('-----------------------------------');

    let allImageFiles = [];
    for (const dir of imageDirs) {
        allImageFiles = allImageFiles.concat(await findImageFiles(dir));
    }

    if (allImageFiles.length === 0) {
        console.log('No images found in the specified directories.');
        return;
    }

    console.log(`Found ${allImageFiles.length} images to process.`);

    // Process images sequentially to avoid overwhelming resources
    for (const file of allImageFiles) {
        await optimizeImage(file);
    }

    console.log('--- Image Optimization Complete ---');
}

runOptimization(); 