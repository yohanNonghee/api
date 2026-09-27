// Unsplash API Configuration
const count = 10; // Number of photos to fetch per request
const apiKey = 'GpnQl1qUIvU24lcO-Wsd0vR6mF6j-M7_lH_CS69HVuo'; // Unsplash API Access Key
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`; // API Endpoint URL

// DOM Elements
const imageContainer = document.getElementById('img-container'); // Container to hold the images
const loader = document.getElementById('loader'); // Loading spinner element

// State Variables
let ready = false; // Flag to check if images are loaded and ready for infinite scroll
let imagesLoaded = 0; // Counter for loaded images
let totalImages = 0; // Total number of images in the current batch
let photoArray = []; // Array to store fetched photo data

// Check if all images in the current batch have finished loading
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true; // Set ready to true once all images are loaded
        loader.style.display = 'none'; // Hide the loader
    }
}

// Fetch photos from the Unsplash API asynchronously
async function getPhotos() {
    try {
        loader.style.display = 'flex'; // Show loader while fetching
        const response = await fetch(apiUrl);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        photoArray = await response.json(); // Parse response to JSON
        displayImages(); // Render images to the DOM
    }
    catch (err) {
        console.error('Error fetching photos:', err);
        loader.style.display = 'none'; // Hide loader on error
        ready = true; // Allow retry on scroll even if error occurs
    }
}

// Create DOM elements for links and photos, then add them to the container
function displayImages() {
    imagesLoaded = 0; // Reset loaded images counter
    totalImages = photoArray.length; // Set total images count

    // Loop through each photo object in the array
    photoArray.forEach((photo) => {
        // Create <a> element to link to Unsplash
        const item = document.createElement('a');
        item.setAttribute('href', photo.links.html);
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');

        // Create <img> element for the photo
        const img = document.createElement('img');
        img.setAttribute('src', photo.urls.regular);
        img.setAttribute('title', photo.alt_description || 'Unsplash Image');
        img.setAttribute('alt', photo.alt_description || 'Unsplash Image');

        // Event listener to check when each image is finished loading
        img.addEventListener('load', imageLoaded);

        // Put the image inside the <a> element, then put both inside the image container
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Initial call to load photos when the page loads
getPhotos();

// Infinite Scroll Event Listener
window.addEventListener('scroll', () => {
    // Check if scrolled near the bottom of the page and if the app is ready for more photos
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false; // Reset ready flag to prevent multiple fetches
        getPhotos(); // Fetch the next batch of photos
    }
});