document.addEventListener("DOMContentLoaded", function () {
  const galleries = JSON.parse(
    document.getElementById("gallery-data").textContent,
  );

  function shuffleArray(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function populateGallery(galleryKey) {
    const gallery = galleries[galleryKey];
    const container = document.querySelector(gallery.containerId);

    if (gallery.images.length === 0) {
      container.innerHTML =
        '<p class="text-muted col-12">No images in this category yet.</p>';
      return;
    }

    const shuffledImages = shuffleArray([...gallery.images]);

    shuffledImages.forEach((imageName) => {
      const imgElement = document.createElement("img");
      const fullSrc = gallery.path + imageName;
      imgElement.src = fullSrc;
      imgElement.alt = `${galleryKey} image ${imageName}`;
      imgElement.className = "gallery-image";
      imgElement.loading = "lazy";

      imgElement.setAttribute("data-toggle", "modal");
      imgElement.setAttribute("data-target", "#galleryModal");
      imgElement.setAttribute("data-fullsrc", fullSrc);

      container.appendChild(imgElement);
    });
  }

  Object.keys(galleries).forEach(populateGallery);

  const modalImageElement = document.getElementById("modalImage");
  const galleryContainer = document.getElementById("galleryTabContent");

  galleryContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("gallery-image")) {
      modalImageElement.setAttribute(
        "src",
        event.target.getAttribute("data-fullsrc"),
      );
    }
  });

  // Release the full-size image when the modal closes.
  $("#galleryModal").on("hidden.bs.modal", function () {
    modalImageElement.setAttribute("src", "");
  });

  const footer = document.querySelector("footer");
  const year = new Date().getFullYear();
  const copyrightText = document.createElement("p");
  copyrightText.className = "mt-3 mb-0";
  copyrightText.textContent = `© ${year} Turner Burchard`;
  footer.appendChild(copyrightText);
});
