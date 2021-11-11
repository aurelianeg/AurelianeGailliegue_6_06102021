// ============================== DOM ELEMENTS ==============================

//const mainWrapper = document.querySelector(".main");

const lightboxModalBackground = document.querySelector(".lightbox_background");
const lightboxModalContent = document.querySelector(".lightbox_content");
const lightboxModalCloseCross = document.querySelector(".lightbox_close");
const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
const lightboxPicture = document.querySelector(".lightbox_container_picture");
const lightboxTitle = document.querySelector(".lightbox_container_title");


// ============================== FUNCTIONS ==============================

/**
 * Launch lightbox modal
 */
function launchLightboxModal() {
    lightboxModalBackground.style.display = "block";
    lightboxModalContent.setAttribute("aria-hidden", "false");
    mainWrapper.setAttribute("aria-hidden", "true");
    lightboxModalCloseCross.focus();
}

/**
 * Close lightbox modal (with animation)
 */
function closeLightboxModal() {
    lightboxModalContent.classList.add("isClosed");
    setTimeout(function() {
        lightboxModalContent.classList.remove("isClosed");
        lightboxModalBackground.style.display = "none";
        lightboxModalContent.setAttribute("aria-hidden", "true");
        mainWrapper.setAttribute("aria-hidden", "false");
    }, 300);
}

/**
 * Get information in clicked HTML gallery element and apply it to the lightbox
 * @param {DOMElement} picture 
 * @param {DOMElement} title 
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
 * @param {DOMElement} content 
 * @param {boolean} fromimage 
 * @returns {DOMElement}
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

/**
 * Get previous gallery element in lightbox
 * @param {DOMElement} lightboxPicture 
 * @param {DOMElement} sortedGalleryElements 
 * @param {DOMElement} sortedGalleryElementsPictures 
 * @param {DOMElement} sortedGalleryElementsTitles 
 */
function getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles) {

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
}

/**
 * Get next gallery element in lightbox
 * @param {DOMElement} lightboxPicture 
 * @param {DOMElement} sortedGalleryElements 
 * @param {DOMElement} sortedGalleryElementsPictures 
 * @param {DOMElement} sortedGalleryElementsTitles 
 */
function getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles) {

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


// ============================== EVENTS ==============================

// Lightbox modal opening, navigation, closing with cross and closing with empty areas

setTimeout(function() {

    // - Opening -
    // !!!!!!!!!! IMPOSSIBLE DE RÉCUPÉRER L'ORDRE DE CLASSEMENT DES ÉLÉMENTS...!
    const galleryElements = document.querySelectorAll(".gallery_element");
    const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
    const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
    let {sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles} = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    
    for (let i = 0; i < sortedGalleryElements.length; i++) {
        const sortedGalleryElementPicture = sortedGalleryElementsPictures[i];
        const sortedGalleryElementTitle = sortedGalleryElementsTitles[i];

        sortedGalleryElementPicture.addEventListener("click", function() {
            applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, false);
            // Display lightbox previous and next buttons if it is the first or the last picture
            /*console.log("i", i);
            console.log("sortedGalleryElementPicture.style.order", sortedGalleryElements[i].style.order);
            if (sortedGalleryElements[i].style.order == 0) {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, true, false);
            }
            else if (sortedGalleryElements[i].style.order == sortedGalleryElements.length - 1) {
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
        getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
    });
    lightboxModalNextButton.addEventListener("click", function() {
        getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
    });
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowLeft") {
            getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
        }
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowRight") {
            getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
        }
    });

    // - Closing with cross -
    lightboxModalCloseCross.addEventListener("click", closeLightboxModal);

    // - Closing with escape key -
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "Escape") {
            closeLightboxModal();
        }
    });

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