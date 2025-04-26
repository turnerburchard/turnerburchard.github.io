document.addEventListener('DOMContentLoaded', function() {
    // START_GALLERY_DEFINITION
const galleries = {
    photos: {
        path: 'files/photos/',
        images: ['20230923-DSC_0700-Enhanced-NR.jpg', '20230929-DSC_0745.jpg', '20240310-DSC07552 Copy.JPG', '20240310-DSC07554.jpg', '20240310-DSC07557.jpg', '20240311-DSC08259.jpg', '20240721-DSC00967.jpg', '20240721-DSC01024.jpg', '20240721-DSC01059.jpg', '20241013-DSC09438-Enhanced-NR.jpg', 'Burchard_landscape-0450.JPG', 'photo1.jpg', 'photo10.jpg', 'photo11.jpg', 'photo12.jpg', 'photo14.jpg', 'photo20.jpg', 'photo8.jpg'],
        containerId: '#photos .gallery-container'
    },
    wildlife: {
        path: 'files/wildlife/',
        images: ['20231007-DSC_0851-Enhanced-NR-2.jpg', '20240310-DSC07647-Enhanced-NR-3.jpg', '20240310-DSC07694.jpg', '20240310-DSC07701-Enhanced-NR.jpg', '20240310-DSC07848.jpg', '20240311-DSC08814-Enhanced-NR.jpg', '20240311-DSC08990.jpg', '20240313-DSC09842.jpg', '20240721-DSC00950-Enhanced-NR.jpg', '20240812-DSC00676.jpg', '20240812-DSC00690.jpg', '20240819-DSC03782.jpg', '20240819-DSC04129.jpg', '20240819-DSC04373.jpg', '20240819-DSC04457.jpg', '20240819-DSC04533.jpg', '20240819-DSC04725.jpg', 'DSC_0311.JPG', 'DSC_0458.JPG', 'photo13.jpg', 'photo19.jpg', 'photo2.jpg', 'photo6.jpg', 'photo9.jpg', 'tetons-0167-Enhanced-NR.jpg'],
        containerId: '#wildlife .gallery-container'
    },
    me: {
        path: 'files/me/',
        images: ['20240310-DSC07164-Enhanced-NR.jpg', '20240314-DSC01675.jpg', '20240316-DSC02406.jpg', '20240814-DSC00838.jpg', '20240814-DSC00891.jpg', '20240814-DSC01267.jpg', 'DSC07126-2 Copy.JPG', 'DSC07164.jpg', 'DSC07494.jpg', 'photo15.jpg', 'photo18.jpg', 'tetons-0333-2.jpg'],
        containerId: '#me .gallery-container'
    },
    art: {
        path: 'files/art/',
        images: ['photo16.jpg', 'photo17.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo7.jpg'],
        containerId: '#art .gallery-container'
    }
};
// END_GALLERY_DEFINITION

    // Fisher-Yates (aka Knuth) Shuffle function
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        // while there remain elements to shuffle
        while (currentIndex !== 0) {
            // pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // and swap it with the current element
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function populateGallery(galleryKey) {
        const gallery = galleries[galleryKey];
        const container = document.querySelector(gallery.containerId);

        if (!container) {
            console.error(`Container not found for ${galleryKey}: ${gallery.containerId}`);
            return;
        }

        container.innerHTML = ''; // Clear existing content

        if (gallery.images.length === 0) {
            container.innerHTML = '<p class="text-muted col-12">No images in this category yet.</p>';
            return;
        }

        // Shuffle the images array before displaying
        const shuffledImages = shuffleArray([...gallery.images]); // Use spread operator to avoid modifying original array

        shuffledImages.forEach(imageName => {
            const imgElement = document.createElement('img');
            imgElement.src = gallery.path + imageName;
            imgElement.alt = `${galleryKey} image ${imageName}`;
            imgElement.className = 'gallery-image'; // Use only our custom class
            container.appendChild(imgElement); // Append image directly to container
        });
    }

    // Populate all galleries on initial load
    // The order here depends on the object key order, which isn't guaranteed.
    // But browsers often preserve insertion order, so 'photos' *should* load first.
    Object.keys(galleries).forEach(populateGallery);

});
