import { updateLightbox, initLightboxEvents } from "../layout/lightbox.js";

// ============================== PHOTOGRAPHER PAGE INITIALIZATION ==============================

/**
 * Get data from JSON file
 * @param {string} url
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
 * @returns {string} 
 */
async function getPhotographerId() {

    let id = new URLSearchParams(window.location.search).get("id");
    return id
}


/**
 * Get photographer folder name for access to media
 * @param {array} photographers
 * @param {string} id
 * @returns {string} 
 */
async function getPhotographerFolderName(photographers, id) {

    let folderName;
    photographers.forEach(function(photographer) {
        if (photographer.id == id) {
            let photographerModel = new Photographer(photographer);
            folderName = (photographerModel._name).split(" ")[0].replace(/-/g, " ");
        }
    })
    return folderName
}


/**
 * Display data in HTML file after fetch operation
 * @param {array} photographers
 * @param {array} media
 * @param {string} id
 */
async function displayPhotographerData(photographers, media, id) {

    const presentation = document.querySelector(".presentation");
    const presentationContact = document.querySelector(".presentation_contact");
    const bottomBarPrice = document.querySelector(".bottom_bar_price");
    const pageTitle = document.querySelector(".page_title");
    const contactModalPhotographerName = document.querySelector(".contact_text_photographer");

    photographers.forEach(function(photographer) {
        if (photographer.id == id) {
            // Create photographer presentation
            let photographerModel = new Photographer(photographer);
            let {presentationPhotographer, presentationProfilePicture} = photographerModel.createProfile;
            presentation.insertBefore(presentationPhotographer, presentationContact);
            presentation.appendChild(presentationProfilePicture);
            // Update information in the page
            bottomBarPrice.innerHTML = photographerModel._price + " € / jour";
            contactModalPhotographerName.innerHTML = photographer.name;
            pageTitle.innerHTML += " - " + photographer.name;
        }
    })

    const bottomBarLikesNumber = document.querySelector(".bottom_bar_likes_number");
    let photographerSumLikes = 0;

    media.forEach(function(med) {
        if (med.photographerId == id) {
            let mediaModel = new Media(med);
            // Increase total number of likes
            photographerSumLikes += mediaModel._likes;
        }
    })
    // Update total number of likes
    bottomBarLikesNumber.innerHTML = photographerSumLikes;
}


/**
 * Sort media by a chosen category (popularity, date or title)
 * @param {array} media 
 * @param {string} id 
 * @param {string} folderName
 * @param {string} category
 * @returns {array, array, array}
 */
async function sortMedia(media, id, folderName, category) {

    let photographerMedia = [];
    let mediaCategoryTexts = [];
    media.forEach(function(med) {
        if (med.photographerId == id) {
            // Create media models
            let mediaModel = new Media(med);
            mediaModel._source = "assets/pictures/photographs/" + folderName + "/";
            photographerMedia.push(mediaModel);

            // Create category text list
            let mediaCategoryText;
            if (category == "popularity") {
                mediaCategoryText = parseFloat(mediaModel._likes);
            }
            if (category == "date") {
                mediaCategoryText = parseFloat(mediaModel._date.replace(/-/g, ""));
            }
            if (category == "title") {
                mediaCategoryText = mediaModel._title;
            }
            mediaCategoryTexts.push(mediaCategoryText);
        }
    })

    // Clone array to sort it
    let sortedMediaCategoryTexts = [...mediaCategoryTexts];
    if (category == "popularity" || category == "date") {       // Descending order
        sortedMediaCategoryTexts.sort(function(a, b) {
            return b - a;
        });
    }
    if (category == "title") {                                  // Ascending order
        sortedMediaCategoryTexts.sort();
    }

    return {photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts}
}


/**
 * Call heart HTML elements (even after the sorting) and increase likes on click
 */
async function listenToHeartsEvents() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".bottom_bar_likes_number");

    // Increase the number of likes (on the picture and total) if the user likes a picture
    galleryElementLikesHearts.forEach(function(heart) {

        heart.addEventListener("click", function() {
            let likesNumber = heart.parentNode.children[0];
            likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
            photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
        })
        heart.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                let likesNumber = heart.parentNode.children[0];
                likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
                photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
            }
        })
    })
}


/**
 * Display sorted media on photographer page
 * @param {array} photographerMedia 
 * @param {array} mediaCategoryTexts 
 * @param {array} sortedMediaCategoryTexts 
 */
async function displaySortedMedia(photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts) {

    // Remove property to allow future sortings (otherwise "if (medias[j]._displayed != "yes")" condition is always entered)
    for (let i = 0; i < photographerMedia.length; i++) {
        photographerMedia[i]._displayed = "";
    }

    // Empty gallery before refilling it
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Go through sorted media category
    for (let i = 0; i < sortedMediaCategoryTexts.length; i++) {
        // Go through media
        for (let j = 0; j < photographerMedia.length; j++) {
            // If category element is similar to sorted category element, display media in gallery
            if (mediaCategoryTexts[j] == sortedMediaCategoryTexts[i]) {
                if (photographerMedia[j]._displayed != "yes") {     // Only if media hasn't already been displayed
                    photographerMedia[j]._displayed = "yes";
                    let galleryElement = photographerMedia[j].createGalleryElement;
                    gallery.appendChild(galleryElement);
                    break;     // To avoid same order for different medias
                }
            }
        }
    }

    const galleryElements = document.querySelectorAll(".gallery_element");

    // Add a blank div for rendering pictures (not multiple of 3) on wide screens
    if (window.screen.width > 1439) {
        if (galleryElements.length % 3 == 2) {
            let blankDiv = document.createElement("div");
            gallery.appendChild(blankDiv);
            blankDiv.style.width = "390px";
            blankDiv.style.order = galleryElements.length;
        }
    }

    listenToHeartsEvents();
    updateLightbox();
}


/**
 * Initialize photographer page data
 */
async function initPhotographerPage() {

    // Get data
    let jsonUrl = "data/data.json";
    let {photographers, media} = await getData(jsonUrl);
    let id = await getPhotographerId();

    // Display data
    await displayPhotographerData(photographers, media, id);

    // Sort media
    let photographerFolderName = await getPhotographerFolderName(photographers, id);
    let {photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts} = await sortMedia(media, id, photographerFolderName, "popularity");
    await displaySortedMedia(photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts);
    await initLightboxEvents();

    console.log("All done for the photographer page!");
}

initPhotographerPage();


// ============================== FUNCTIONS AND EVENTS ==============================

/**
 * See sorting menu choices
 * @param {DOMElement} input 
 * @param {DOMElement} menu 
 * @param {DOMElement} menuChoices 
 */
async function deploySortChoices(input, menu, menuChoices) {

    for (let i = 0; i < menuChoices.length; i++) {
        menuChoices[i].tabIndex = "0";
    }
    menu.setAttribute("aria-expanded", "true");
    input.checked = true;
}


/**
 * Hide sorting menu choices
 * @param {DOMElement} input 
 * @param {DOMElement} menu 
 * @param {DOMElement} menuChoices 
 */
async function hideSortChoices(input, menu, menuChoices) {

    for (let i = 0; i < menuChoices.length; i++) {
        menuChoices[i].tabIndex = "-1";
    }
    menu.setAttribute("aria-expanded", "false");
    input.checked = false;
}


/**
 * Sort gallery based on selected sorting option
 * @param {DOMElement} choice 
 * @param {DOMElement} buttonText 
 */
async function sortGallery(choice, buttonText) {

    // Get data
    let jsonUrl = "data/data.json";
    let {photographers, media} = await getData(jsonUrl);
    let id = await getPhotographerId();
    let photographerFolderName = await getPhotographerFolderName(photographers, id);

    // Sort media
    let selectedChoice = choice.id;
    buttonText.innerHTML = choice.innerHTML;
    let {photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts} = await sortMedia(media, id, photographerFolderName, selectedChoice);
    await displaySortedMedia(photographerMedia, mediaCategoryTexts, sortedMediaCategoryTexts);

    console.log("Sorting done.");
}


// Display sorting choices, choose a sorting option and sort gallery by categories

setTimeout(function() {

    const sortingInput = document.querySelector(".sorting_input");
    const sortingButtonText = document.querySelector(".sorting_button_text");
    const sortingMenu = document.querySelector(".sorting_menu");
    const sortingListChoices = document.querySelectorAll(".sorting_menu_list_choice");

    // Display or hide sorting choices
    sortingInput.addEventListener("click", function() {
        if (sortingInput.checked == true) {
            deploySortChoices(sortingInput, sortingMenu, sortingListChoices);
        }
        else {
            hideSortChoices(sortingInput, sortingMenu, sortingListChoices);
        }
    })
    sortingInput.addEventListener("keydown", function(event) {
        if (event.key == "Enter") {
            if (sortingInput.checked == false) {
                deploySortChoices(sortingInput, sortingMenu, sortingListChoices);
            }
            else {
                hideSortChoices(sortingInput, sortingMenu, sortingListChoices);
            }
        }
    })
    
    // Choose sorting method and sort gallery
    sortingListChoices.forEach(function(sortingListChoice) {

        sortingListChoice.addEventListener("click", function() {
            sortGallery(sortingListChoice, sortingButtonText);
            hideSortChoices(sortingInput, sortingMenu, sortingListChoices);
        })
        sortingListChoice.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                sortGallery(sortingListChoice, sortingButtonText);
                hideSortChoices(sortingInput, sortingMenu, sortingListChoices);
            }
        })
    })
    
}, 500);