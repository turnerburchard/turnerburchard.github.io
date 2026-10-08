const fs = require("node:fs");
const path = require("node:path");

const categories = ["photos", "wildlife", "me", "art"];
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".gif"]);
const dataPath = path.join(__dirname, "_data", "gallery.json");

function getGalleryImages(directory) {
  try {
    if (!fs.existsSync(directory)) {
      console.warn(`Directory not found: ${directory}, skipping.`);
      return [];
    }
    return fs
      .readdirSync(directory)
      .filter((file) =>
        supportedExtensions.has(path.extname(file).toLowerCase()),
      );
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

const galleries = Object.fromEntries(
  categories.map((category) => [
    category,
    {
      path: `/files/${category}/`,
      images: getGalleryImages(path.join(__dirname, "files", category)),
      containerId: `#${category} .gallery-container`,
    },
  ]),
);

fs.writeFileSync(dataPath, JSON.stringify(galleries, null, 2) + "\n");
console.log("Updated _data/gallery.json.");
