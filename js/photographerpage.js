// ============================== DOM ELEMENTS ==============================

const pageTitle = document.querySelector(".page_title");

const presentation = document.querySelector(".presentation");
const gallery = document.querySelector(".gallery");
const galleryElement = document.querySelector(".gallery_element");
const bottomBar = document.querySelector(".bottom_bar");

const sortingSelect = document.querySelector(".sorting_select");

const contactButton = document.querySelector(".presentation_contact");
const contactModalBackground = document.querySelector(".contact_background");
const contactModalContent = document.querySelector(".contact_content");
const contactModalCloseCross = document.querySelector(".contact_close");
const contactModalPhotographerName = document.querySelector(".contact_text_photographer");
const contactModalSubmitButton = document.querySelector(".contact_submit");

const lightboxModalBackground = document.querySelector(".lightbox_background");
const lightboxModalContent = document.querySelector(".lightbox_content");
const lightboxModalCloseCross = document.querySelector(".lightbox_close");
const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
const lightboxPicture = document.querySelector(".lightbox_container_picture");
const lightboxTitle = document.querySelector(".lightbox_container_title");


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

    // Add a blank div for rendering pictures (not multiple of 3) on wide screens
    if (window.screen.width > 1439) {
        if (photographerMedias.length % 3 == 2) {
            blankDiv = document.createElement("div");
            gallery.appendChild(blankDiv);
            blankDiv.style.width = "390px";
            blankDiv.style.order = photographerMedias.length;
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
 * @param {HTML element} elements 
 * @param {HTML element} elementsPictures 
 * @param {HTML element} elementsTitles 
 * @returns 
 */
function getSortedElementsPicturesAndTitles(elements, elementsPictures, elementsTitles) {

    let sortedElements = new Array(elements.length);
    let sortedElementsPictures = new Array(elements.length);
    let sortedElementsTitles = new Array(elements.length);

    for (let i = 0; i < elements.length; i++) {
        let sortedIndex = elements[i].style.getPropertyValue('order');
        sortedElements[sortedIndex] = elements[i];
        sortedElementsPictures[sortedIndex] = elementsPictures[i];
        sortedElementsTitles[sortedIndex] = elementsTitles[i];
    }

    return [sortedElements, sortedElementsPictures, sortedElementsTitles];
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
        [sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles] = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    }, 300);
}

// Sort gallery by default option on page loading

let sortedGalleryElements;
let sortedGalleryElementsPictures;
let sortedGalleryElementsTitles;
window.addEventListener('load', defaultGallerySorting);

// Sort gallery by categories when choosing a sorting option

setTimeout(function() {

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

        // Get sorted elements, pictures and titles
        const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
        const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
        [sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles] = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    })

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
    contactModalContent.classList.add('isClosed');
    setTimeout(function() {
        contactModalContent.classList.remove('isClosed');
        contactModalBackground.style.display = "none";
    }, 300);
}

// Contact modal opening, closing with cross, and closing with submit button

setTimeout(function() {

    // - Opening -
    contactButton.addEventListener("click", launchContactModal);

    // - Closing with cross -
    contactModalCloseCross.addEventListener("click", closeContactModal);

    // - Closing with submit button -
    const contactFormInputs = document.querySelectorAll(".contact_form_input");
    contactModalSubmitButton.addEventListener("click", function() {
        // Print contact form inputs in console logs and close contact modal
        for (let i = 0; i < contactFormInputs.length; i++) {
            console.log(contactFormInputs[i].value);
        }
        closeContactModal();
    });

}, 500);


// ------------------------------------------------------------

/**
 * Launch lightbox modal
 */
function launchLightboxModal() {
    lightboxModalBackground.style.display = "block";
}
  
/**
 * Close lightbox modal (with animation)
 */
function closeLightboxModal() {
    lightboxModalContent.classList.add('isClosed');
    setTimeout(function() {
        lightboxModalContent.classList.remove('isClosed');
        lightboxModalBackground.style.display = "none";
    }, 300);
}

/**
 * Get information in clicked HTML gallery element and apply it to the lightbox
 * @param {HTML element} picture 
 * @param {HTML element} title 
 * @param {boolean} firstpicture 
 * @param {boolean} lastpicture 
 */
function applyPictureAndTitleToLightbox(picture, title, firstpicture, lastpicture) {

    // Get photographer page information
    const pictureContent = picture.children[0];

    // Apply information to lightbox content
    while (lightboxPicture.lastElementChild) {  // Reset at each opening: empty it if it already has a child
        lightboxPicture.removeChild(lightboxPicture.lastElementChild);
    }
    const lightboxPictureContent = pictureContent.cloneNode(true);
    // Remove the miniature image and get video controls
    if (lightboxPictureContent.nodeName == "VIDEO") {
        const lightboxPictureVideoSource = lightboxPictureContent.children[0];
        lightboxPictureVideoSource.src = lightboxPictureVideoSource.src.split("#")[0];
        // Show controls on hover
        lightboxPictureContent.addEventListener("mouseover", function() {
            lightboxPictureContent.setAttribute("controls", "controls");
        })
        // Hide controls if not hover
        lightboxPictureContent.addEventListener("mouseleave", function() {
            lightboxPictureContent.removeAttribute("controls");
        })
    }
    lightboxPicture.appendChild(lightboxPictureContent);    // Put the new picture as child
    lightboxTitle.innerHTML = title.innerHTML;

    // Lightbox layout once the picture is displayed
    setTimeout(function() {

        // Reset at each lightbox opening
        lightboxTitle.style.width = "auto";
        lightboxPicture.style.height = "100%";

        if (lightboxPictureContent.nodeName != "VIDEO") {
            // Align the title with the displayed picture (center if it is a video because natural dimensions are 0)
            let titleWidth = (lightboxPictureContent.naturalWidth * lightboxPictureContent.height) / lightboxPictureContent.naturalHeight;  
            if (titleWidth > lightboxPictureContent.width) {
                titleWidth = lightboxPictureContent.width;
            }
            lightboxTitle.style.width = titleWidth + "px";

            // If picture is in landscape, bring title closer to the picture
            if (lightboxPictureContent.naturalWidth > lightboxPictureContent.naturalHeight) {
                let pictureHeight = (lightboxPictureContent.naturalHeight * titleWidth) / lightboxPictureContent.naturalWidth;
                if (pictureHeight > lightboxPictureContent.height) {
                    pictureHeight = lightboxPictureContent.height;
                }
                lightboxPicture.style.height = pictureHeight + "px";
            }
        }
    }, 50);

    // Partially hide the previous button if the picture is the first
    if (firstpicture) {
        lightboxModalContent.classList.add("boundary_firstelement");
    }
    // Partially hide the next button if the picture is the last
    else if (lastpicture) {
        lightboxModalContent.classList.add("boundary_lastelement");
    }
    else
    {
        lightboxModalContent.classList.remove("boundary_firstelement");
        lightboxModalContent.classList.remove("boundary_lastelement");
    }
}

/**
 * Get image or video source (from a video thumbnail if needed with boolean "fromimage")
 * @param {HTML element} content 
 * @param {boolean} fromimage 
 * @returns source
 */
function getContentSource(content, fromimage) {

    let contentSource;
    if (content.nodeName != "VIDEO") {
        contentSource = content.src;
    }
    else
    {
        if (!fromimage) {
            contentSource = content.children[0].src;
        }
        else {
            contentSource = content.children[0].src.split("#")[0];
        }
    }
    return contentSource;
}

// Lightbox modal opening, navigation, closing with cross and closing with empty areas

setTimeout(function() {

    // - Opening -
    for (let i = 0; i < sortedGalleryElements.length; i++) {
        const sortedGalleryElementPicture = sortedGalleryElementsPictures[i];
        const sortedGalleryElementTitle = sortedGalleryElementsTitles[i];

        sortedGalleryElementPicture.addEventListener("click", function() {
            applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, false);
            // Display lightbox previous and next buttons if it is the first or the last picture
            /*console.log("i", i);
            if (i == 0) {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, true, false);
            }
            else if (i == sortedGalleryElements.length - 1) {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, true);
            }
            else {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, false);
            }*/
            launchLightboxModal();
        });
    }

    // - Navigation between gallery pictures -
    lightboxModalPreviousButton.addEventListener("click", function() {
        let lightboxPictureContentSource = getContentSource(lightboxPicture.children[0], false);

        for (let i = 0; i < sortedGalleryElements.length; i++) {
            // Compare source name in lightbox with corresponding gallery source
            let sortedElementPictureSource = getContentSource(sortedGalleryElementsPictures[i].children[0], true);
            if (lightboxPictureContentSource == sortedElementPictureSource) {
                // Display lightbox previous and next buttons if it is the first or the last picture
                if (i == 1) {
                    applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i-1], sortedGalleryElementsTitles[i-1], true, false);
                }
                else if (i == 0) {
                    console.log("You've reached the first picture.");
                }
                else {
                    applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i-1], sortedGalleryElementsTitles[i-1], false, false);
                }
            }
        }   
    });
    lightboxModalNextButton.addEventListener("click", function() {
        let lightboxPictureContentSource = getContentSource(lightboxPicture.children[0], false);

        for (let i = 0; i < sortedGalleryElements.length; i++) {
            // Compare source name in lightbox with corresponding gallery source
            let sortedElementPictureSource = getContentSource(sortedGalleryElementsPictures[i].children[0], true);
            if (lightboxPictureContentSource == sortedElementPictureSource) {
                // Display lightbox previous and next buttons if it is the first or the last picture
                if (i == sortedGalleryElements.length - 2) {
                    applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i+1], sortedGalleryElementsTitles[i+1], false, true);
                }
                else if (i == sortedGalleryElements.length - 1) {
                    console.log("You've reached the last picture.");
                }
                else {
                    applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i+1], sortedGalleryElementsTitles[i+1], false, false);
                }
            }
        }   
    });

    // - Closing with cross -
    lightboxModalCloseCross.addEventListener("click", closeLightboxModal);

    // - Closing on empty areas -
    lightboxModalBackground.addEventListener("click", function(event) {
        var clickedElement = event.target;
        let isClickedEmpty = true;
        // Not closing on picture content
        if (clickedElement.nodeName == "VIDEO" || clickedElement.nodeName == "IMG") {
            isClickedEmpty = false;
        }
        // Not closing on filled elements
        else {
            const lightboxNotEmptyClasses = ["lightbox_close", "lightbox_previousbutton",
                                             "lightbox_nextbutton", "lightbox_container",
                                             "lightbox_container_picture", "lightbox_container_title"];
            for (let i = 0; i < lightboxNotEmptyClasses.length; i++) {
                if (clickedElement.className == lightboxNotEmptyClasses[i]) {
                    isClickedEmpty = false;
                }
            }
        }
        if (isClickedEmpty) {
            closeLightboxModal();
        }
    });

}, 1000);