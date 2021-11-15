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
 * Sort gallery elements by a chosen category (popularity, date or title)
 * @param {DOMElement} elements 
 * @param {DOMElement} categoryElements 
 * @param {string} category 
 */
async function displaySortedMedia(media, id, folderName, category) {

    let medias = [];
    let mediaCategoryTexts = [];
    media.forEach(function(med) {
        if (med.photographerId == id) {
            // Create media models
            let mediaModel = new Media(med);
            mediaModel._source = "assets/pictures/photographs/" + folderName + "/";
            medias.push(mediaModel);

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

    // Remove property to allow future sortings (otherwise "if (medias[j]._displayed != "yes")" condition is always entered)
    for (let k = 0; k < medias.length; k++) {
        medias[k]._displayed = "";
    }

    // Empty gallery before refilling it
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Go through sorted media category
    for (let i = 0; i < sortedMediaCategoryTexts.length; i++) {
        // Go through media
        for (let j = 0; j < medias.length; j++) {
            // If category element is similar to sorted category element, display media in gallery
            if (mediaCategoryTexts[j] == sortedMediaCategoryTexts[i]) {
                if (medias[j]._displayed != "yes") {     // Only if media hasn't already been displayed
                    medias[j]._displayed = "yes";
                    let galleryElement = medias[j].createGalleryElement;
                    gallery.appendChild(galleryElement);
                    break;     // To avoid same order for different medias
                }
            }
        }
    }

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
    await displaySortedMedia(media, id, photographerFolderName, "popularity");

    console.log("All done for the photographer page!");
}

initPhotographerPage();


// ============================== FUNCTIONS AND EVENTS ==============================

// Sort gallery by categories when choosing a sorting option

async function sortGallery(choice, buttonText) {

    // Get data
    let jsonUrl = "data/data.json";
    let {photographers, media} = await getData(jsonUrl);
    let id = await getPhotographerId();
    let photographerFolderName = await getPhotographerFolderName(photographers, id);

    // Sort media
    let selectedChoice = choice.id;
    buttonText.innerHTML = choice.innerHTML;
    await displaySortedMedia(media, id, photographerFolderName, selectedChoice);

    console.log("Sorting done.");
}

setTimeout(function() {

    const sortingInput = document.querySelector(".sorting_input");
    const sortingButtonText = document.querySelector(".sorting_button_text");
    const sortingListChoices = document.querySelectorAll(".sorting_menu_list_choice");

    sortingListChoices.forEach(function(sortingListChoice) {

        sortingListChoice.addEventListener("click", function() {

            sortGallery(sortingListChoice, sortingButtonText);
            // Hide sorting options
            sortingInput.checked = false;
        })
    })
    
}, 500);


// ------------------------------------------------------------

// Increase the number of likes (on the picture and total)
// if the user likes a picture

async function increaseLikesNumbers(pictureLikesNumber, totalLikesNumber) {
    // Increase likes number for the picture
    pictureLikesNumber.innerHTML = parseInt(pictureLikesNumber.innerHTML) + 1;
    // Increase total number of likes
    totalLikesNumber.innerHTML = parseInt(totalLikesNumber.innerHTML) + 1;
}

setTimeout(function() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".bottom_bar_likes_number");

    galleryElementLikesHearts.forEach(function(heart) {

        heart.addEventListener("click", function() {
            let likesNumber = heart.parentNode.children[0];
            increaseLikesNumbers(likesNumber, photographerTotalLikes);
        })

        heart.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                let likesNumber = heart.parentNode.children[0];
                increaseLikesNumbers(likesNumber, photographerTotalLikes);
            }
        })
    })

}, 500);