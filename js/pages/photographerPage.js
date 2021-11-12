// ========== HOMEPAGE INITIALIZATION ==========

/**
 * Get data from JSON file
 * @returns {array} 
 */
async function getData(url) {

    let data;

    await fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(value) {
            data = value;
        })
        .catch(function(error) {
            console.log("Error at fetch:" + error.message);
        });

    return data
}

/**
 * Get photographer ID from URL
 * @returns {array} 
 */
async function getPhotographerId() {

    let id = new URLSearchParams(window.location.search).get("id");
    return id
}

/**
 * Display data in HTML file after fetch operation
 * @param {array} photographers
 * @param {array} media
 * @param {string} id
 */
async function displayData(photographers, media, id) {

    const presentation = document.querySelector(".presentation");
    const presentationContact = document.querySelector(".presentation_contact");
    const bottomBarPrice = document.querySelector(".bottom_bar_price");
    const pageTitle = document.querySelector(".page_title");
    const contactModalPhotographerName = document.querySelector(".contact_text_photographer");
    let folderName;

    photographers.forEach(function(photographer) {
        if (photographer.id == id) {
            // Create photographer presentation
            const photographerModel = new Photographer(photographer);
            const {presentationPhotographer, presentationProfilePicture} = photographerModel.createProfile;
            presentation.insertBefore(presentationPhotographer, presentationContact);
            presentation.appendChild(presentationProfilePicture);
            // Update information in the page
            bottomBarPrice.innerHTML = photographerModel._price + " € / jour";
            contactModalPhotographerName.innerHTML = photographer.name;
            pageTitle.innerHTML += " - " + photographer.name;
            // Get path for photographs
            folderName = (photographerModel._name).split(" ")[0].replace(/-/g, " ");
        }
    })

    const gallery = document.querySelector(".gallery");
    const bottomBarLikesNumber = document.querySelector(".bottom_bar_likes_number");
    let photographerSumLikes = 0;

    media.forEach(function(med) {
        if (med.photographerId == id) {
            // Create media gallery elements
            const mediaModel = new Media(med);
            mediaModel._source = "assets/pictures/photographs/" + folderName + "/";
            const galleryElement = mediaModel.createGalleryElement;
            gallery.appendChild(galleryElement);
            // Increase total number of likes
            photographerSumLikes += mediaModel._likes;
        }
    })
    // Update total number of likes
    bottomBarLikesNumber.innerHTML = photographerSumLikes;

    // Add a blank div for rendering pictures (not multiple of 3) on wide screens
    if (window.screen.width > 1439) {
        const galleryElements = document.querySelectorAll(".gallery_element");
        if (galleryElements.length % 3 == 2) {
            let blankDiv = document.createElement("div");
            gallery.appendChild(blankDiv);
            blankDiv.style.width = "390px";
            blankDiv.style.order = galleryElements.length;
        }
    }

}

/**
 * Initialize homepage data
 */
async function initPhotographerPage() {
    let jsonUrl = "data/data.json";
    let {photographers, media} = await getData(jsonUrl);
    let id = await getPhotographerId();
    displayData(photographers, media, id);
    console.log("All done for the photographer page!");
}

initPhotographerPage();


// ============================== EVENTS ==============================

/**
 * Sort gallery elements by a chosen category (popularity, date or title)
 * @param {DOMElement} elements 
 * @param {DOMElement} categoryElements 
 * @param {string} category 
 */
function sortGalleryByCategory(elements, categoryElements, category) {

    // Create array with text from HTML category elements
    let categoryElementsText = [];
    for (let i = 0; i < categoryElements.length; i++) {
        let categoryElementText;
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

    // Remove order to allow future sortings (otherwise "if (!element.style.order)" condition is always entered)
    for (let k = 0; k < elements.length; k++) {
        elements[k].style.order = "";
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
                if (!element.style.order) {     // Only if element hasn't already an order
                    element.style.order = i;
                    break;     // To avoid same order for different elements
                }
            }
        }
    }
}

/**
 * Sort gallery elements, pictures and titles, by order of appearance on screen (sorting)
 * @param {DOMElement} elements 
 * @param {DOMElement} elementsPictures 
 * @param {DOMElement} elementsTitles 
 * @returns {array}
 */
function getSortedElementsPicturesAndTitles(elements, elementsPictures, elementsTitles) {

    let sortedElements = new Array(elements.length);
    let sortedElementsPictures = new Array(elements.length);
    let sortedElementsTitles = new Array(elements.length);

    for (let i = 0; i < elements.length; i++) {
        let sortedIndex = elements[i].style.getPropertyValue("order");
        sortedElements[sortedIndex] = elements[i];
        sortedElementsPictures[sortedIndex] = elementsPictures[i];
        sortedElementsTitles[sortedIndex] = elementsTitles[i];
    }

    return {sortedElements, sortedElementsPictures, sortedElementsTitles}
}

/**
 * Sort gallery by popularity (default option)
 */
function defaultGallerySorting() {

    setTimeout(function() {
        const galleryElements = document.querySelectorAll(".gallery_element");
        const galleryElementsLikesNumbers = document.querySelectorAll(".gallery_element_legend_likes_number");
        sortGalleryByCategory(galleryElements, galleryElementsLikesNumbers, "popularity");

        // Get sorted elements, pictures and titles
        const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
        const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
        getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    }, 300);
}

// Sort gallery by default option on page loading

window.addEventListener("load", defaultGallerySorting);

// Sort gallery by categories when choosing a sorting option

setTimeout(function() {

    const sortingInput = document.querySelector(".sorting_input");
    const sortingButtonText = document.querySelector(".sorting_button_text");
    const sortingListChoices = document.querySelectorAll(".sorting_menu_list_choice");

    sortingListChoices.forEach((sortingListChoice) => sortingListChoice.addEventListener("click", function() {

        const galleryElements = document.querySelectorAll(".gallery_element");
        const sortingSelectedChoice = sortingListChoice.id;
        sortingButtonText.innerHTML = sortingListChoice.innerHTML;

        // Get HTML elements based on sorting option (likes numbers, dates, or picture titles)
        let galleryElementsCategory = "";
        if (sortingSelectedChoice == "popularity") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_likes_number");
        }
        if (sortingSelectedChoice == "date") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_date");
        }
        if (sortingSelectedChoice == "title") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_title");
        }

        // Hide sorting options
        sortingInput.checked = false;

        // Sort gallery elements by chosen option
        sortGalleryByCategory(galleryElements, galleryElementsCategory, sortingSelectedChoice);

        // Get sorted elements, pictures and titles
        const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
        const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
        getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    }))

}, 500);


// ------------------------------------------------------------

// Increase the number of likes (on the picture and total)
// if the user likes a picture

setTimeout(function() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".bottom_bar_likes_number");

    galleryElementLikesHearts.forEach((heart) => heart.addEventListener("click", function() {
        // Get likes number for the picture and increase it
        const likesNumber = heart.parentNode.children[0];
        likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
        // Increase total number of likes
        photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
    }))

}, 500);