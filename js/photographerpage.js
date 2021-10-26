// ============================== DOM ELEMENTS ==============================

const pageTitle = document.querySelector(".page_title");

const presentation = document.querySelector(".presentation");
const gallery = document.querySelector(".gallery");
const galleryElement = document.querySelector(".gallery_element");
const bottomBar = document.querySelector(".bottom_bar");

const contactButton = document.querySelector(".presentation_contact");
const contactModalBackground = document.querySelector(".contact_background");
const contactModalContent = document.querySelector(".contact_content");
const contactModalCloseCross = document.querySelector(".contact_close");
const contactModalPhotographerName = document.querySelector(".contact_text_photographer");
const contactModalSubmitButton = document.querySelector(".contact_submit");


// ============================== FUNCTIONS ==============================

/**
 * Apply the data taken from the JSON file to the HTML elements on the photographer page
 * @param {array} photographer 
 * @param {HTML element} presentation
 * @param {HTML element} bottomBar
 * @param {array} media
 * @param {HTML element} contactModalPhotographerName
 */
function applyDataToPhotographerPage(photographer, media) {

    // Get all HTML children
    [photographerPresentation, contactForm, photographerProfilePicture] = presentation.children;
    [photographerName, photographerLocation, photographerDescription, photographerTags] = photographerPresentation.children;
    
    [photographerLikes, photographerPrice] = bottomBar.children;
    photographerTotalLikes = photographerLikes.children[0];

    // Change text in HTML by data in JSON
    photographerProfilePicture.src = "assets/pictures/photographers/" + photographer.portrait;
    photographerName.innerHTML = photographer.name;
    contactModalPhotographerName.innerHTML = photographer.name;
    pageTitle.innerHTML += " - " + photographer.name;
    photographerLocation.innerHTML = photographer.city + ', ' + photographer.country;
    photographerDescription.innerHTML = photographer.tagline;
    photographerPrice.innerHTML = photographer.price + " € / jour";
    // Empty tags
    photographerTags.innerHTML = '';
    for (let j = 0; j < photographer.tags.length; j++) {
        // Create a new span for each tag
        const photographerCardTag = document.createElement("span");
        photographerCardTag.innerHTML = "#" + photographer.tags[j];
        photographerTags.appendChild(photographerCardTag);
    }

    const photographerId = photographer.id;
    let photographerSumLikes = 0;
    let photographerMedias = [];
    for (let k = 0; k < media.length; k++) {
        if (media[k].photographerId == photographerId) {
            // Pictures
            photographerMedias.push(media[k]);
            // Total likes
            photographerSumLikes += media[k].likes;
        }
    }
    photographerTotalLikes.innerHTML = photographerSumLikes;

    // Get photographer pictures in HTML
    for (let l = 0; l < photographerMedias.length; l++) {

        let photographerMedia = photographerMedias[l];

        // Create a clone of the original gallery element
        if (l != 0) {
            galleryElementNew = galleryElement.cloneNode(true);
            gallery.appendChild(galleryElementNew);
        }

        // Get last gallery element created
        const galleryElements = document.querySelectorAll(".gallery_element");

        // Get all HTML children
        [galleryElementPicture, galleryElementLegend, galleryElementDate] = galleryElements[l].children;
        galleryElementLegendTitle = galleryElementLegend.children[0];
        galleryElementLegendLikesNumber = galleryElementLegend.children[1].children[0];

        // Change text in HTML by data in JSON
        galleryElementLegendTitle.innerHTML = photographerMedia.title;
        galleryElementLegendLikesNumber.innerHTML = photographerMedia.likes;
        galleryElementDate.innerHTML = photographerMedia.date.replace(/-/g, '');

        const folderName = (photographer.name).split(' ')[0].replace(/-/g, ' ');
        // Check if video or image
        if (l != 0) {       // Remove child cloned with the element
            galleryElementPicture.removeChild(galleryElementPicture.lastChild);
        }
        if (photographerMedia.image != undefined) {
            const galleryElementPictureImage = document.createElement("img");
            galleryElementPicture.appendChild(galleryElementPictureImage);
            galleryElementPictureImage.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.image;
        }
        else {
            const galleryElementPictureVideo = document.createElement("video");
            galleryElementPicture.appendChild(galleryElementPictureVideo);
            const galleryElementPictureVideoSource = document.createElement("source");
            galleryElementPictureVideo.appendChild(galleryElementPictureVideoSource);
            galleryElementPictureVideoSource.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.video + "#t=0.5";
        }
        
    }
}


// Get data from JSON file

let jsonUrl = "assets/data/data.json";

fetch(jsonUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        window.data = value;    // Get data as global variable
    })
    .catch(function(error) {
        console.log("Error:" + error.message);
    });


// Save global variables after fetch operation

setTimeout(function() {

    let photographers = data.photographers;
    let media = data.media;
    
    //console.log("photographers", photographers);
    //console.log("media", media);

    // Get photographer ID from URL and search for the right data in JSON
    const id = new URLSearchParams(window.location.search).get("id");
    
    for (i = 0; i < photographers.length; i++) {
        if (photographers[i].id == id) {
            window.photographer = photographers[i];
        }    
    }

    const photographer = window.photographer;

    applyDataToPhotographerPage(photographer, media);

    console.log("All done for the photographer page!");

}, 300);


// ============================== EVENTS ==============================

/**
 * Sort gallery elements by a chosen category (popularity, date or title)
 * @param {HTML element} elements 
 * @param {HTML element} categoryElements 
 * @param {string} category 
 */
function sortGalleryByCategory(elements, categoryElements, category) {

    // Create array with text from HTML category elements
    let categoryElementsText = [];
    for (let i = 0; i < categoryElements.length; i++) {
        if (category == "popularity" || category == "date") {
            categoryElementText = parseFloat(categoryElements[i].innerHTML);
        }
        if (category == "title") {
            categoryElementText = categoryElements[i].innerHTML;
        }
        categoryElementsText.push(categoryElementText);
    }

    // Clone array to sort it
    let sortedCategoryElementsText = [...categoryElementsText];
    if (category == "popularity" || category == "date") {       // Descending order
        sortedCategoryElementsText.sort(function(a, b) {
            return b - a;
        });
    }
    if (category == "title") {                                  // Ascending order
        sortedCategoryElementsText.sort();
    }

    // Go through sorted array
    for (let i = 0; i < sortedCategoryElementsText.length; i++) {
        let sortedCategoryElementText = sortedCategoryElementsText[i];

        // Go through HTML card elements
        for (let j = 0; j < elements.length; j++) {
            let element = elements[j];
            let categoryElementText = categoryElementsText[j];

            // If HTML category element is similar to sorted array element, reorder HTML card element
            if (categoryElementText == sortedCategoryElementText) {
                element.style.order = i;
            }
        }
    }
}

// Sort gallery by categories when choosing a sorting option

setTimeout(function() {

    const sortingSelect = document.querySelector(".sorting_select");
    sortingSelect.addEventListener("change", function() {

        const galleryElements = document.querySelectorAll(".gallery_element");
        const sortingSelectedOption = sortingSelect.value;

        // Get HTML elements based on sorting option (likes numbers, dates, or picture titles)
        let galleryElementsCategory = '';
        if (sortingSelectedOption == "popularity") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_likes_number");
        }
        if (sortingSelectedOption == "date") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_date");
        }
        if (sortingSelectedOption == "title") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_title");
        }

        // Sort gallery elements by chosen option
        sortGalleryByCategory(galleryElements, galleryElementsCategory, sortingSelectedOption);
    })

}, 500);


// ------------------------------------------------------------

/**
 * Sort gallery by popularity (default option)
 */
function defaultGallerySorting() {

    setTimeout(function() {
        const galleryElements = document.querySelectorAll(".gallery_element");
        const galleryElementsLikesNumbers = document.querySelectorAll(".gallery_element_legend_likes_number");
        sortGalleryByCategory(galleryElements, galleryElementsLikesNumbers, "popularity");
    }, 500);

}

// Sort gallery by default option on page loading

window.addEventListener('load', defaultGallerySorting);


// ------------------------------------------------------------

// Increase the number of likes (on the picture and total)
// if the user likes a picture

setTimeout(function() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".bottom_bar_likes_number");

    galleryElementLikesHearts.forEach((heart) => heart.addEventListener("click", function() {
        console.log("Heart clicked!");
        // Get likes number for the picture and increase it
        const likesNumber = heart.parentNode.children[0];
        likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
        // Increase total number of likes
        photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
    }))

}, 500);


// ------------------------------------------------------------

/**
 * Launch contact modal
 */
function launchContactModal() {
    contactModalBackground.style.display = "block";
}
  
/**
 * Close contact modal (with animation)
 */
function closeContactModal() {
    contactModalContent.classList.toggle('isClosed');
    setTimeout(function() {
        contactModalContent.classList.remove('isClosed');
        contactModalBackground.style.display = "none";
    }, 500);
}

setTimeout(function() {

    contactButton.addEventListener("click", launchContactModal);
    contactModalCloseCross.addEventListener("click", closeContactModal);

    const contactFormInputs = document.querySelectorAll(".contact_form_input");
    contactModalSubmitButton.addEventListener("click", function() {
        // Print contact form inputs in console logs and close contact modal
        for (let i = 0; i < contactFormInputs.length; i++) {
            console.log(contactFormInputs[i].value);
        }
        closeContactModal();
    });

}, 500);