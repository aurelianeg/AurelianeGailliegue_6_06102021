// ============================== DOM ELEMENTS ==============================

const main = document.querySelector(".main");

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
async function launchLightboxModal() {

    lightboxModalBackground.style.display = "block";
    lightboxModalContent.setAttribute("aria-hidden", "false");
    main.setAttribute("aria-hidden", "true");
    lightboxModalCloseCross.focus();
}


/**
 * Close lightbox modal (with animation)
 */
async function closeLightboxModal() {

    lightboxModalContent.classList.add("isClosed");
    setTimeout(function() {
        lightboxModalContent.classList.remove("isClosed");
        lightboxModalBackground.style.display = "none";
        lightboxModalContent.setAttribute("aria-hidden", "true");
        main.setAttribute("aria-hidden", "false");
    }, 300);
}


/**
 * Get information in clicked HTML gallery element and apply it to the lightbox
 * @param {DOMElement} picture 
 * @param {DOMElement} title 
 * @param {boolean} firstpicture 
 * @param {boolean} lastpicture 
 */
async function applyPictureAndTitleToLightbox(picture, title, firstpicture, lastpicture) {

    // Get photographer page information
    let pictureContent = picture.children[0];

    // Apply information to lightbox content
    while (lightboxPicture.lastElementChild) {  // Reset at each opening: empty it if it already has a child
        lightboxPicture.removeChild(lightboxPicture.lastElementChild);
    }
    let lightboxPictureContent = pictureContent.cloneNode(true);
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
async function getContentSource(content, fromimage) {

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
 * @param {DOMElement} galleryElements 
 * @param {DOMElement} galleryElementsPictures 
 * @param {DOMElement} galleryElementsTitles 
 */
async function getPreviousGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles) {

    let lightboxPictureContentSource = await getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < galleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let elementPictureSource = await getContentSource(galleryElementsPictures[i].children[0], true);
        if (lightboxPictureContentSource == elementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == 1) {
                await applyPictureAndTitleToLightbox(galleryElementsPictures[i-1], galleryElementsTitles[i-1], true, false);
            }
            else if (i == 0) {
                console.log("You've reached the first picture.");
            }
            else {
                await applyPictureAndTitleToLightbox(galleryElementsPictures[i-1], galleryElementsTitles[i-1], false, false);
            }
        }
    }
}


/**
 * Get next gallery element in lightbox
 * @param {DOMElement} lightboxPicture 
 * @param {DOMElement} galleryElements 
 * @param {DOMElement} galleryElementsPictures 
 * @param {DOMElement} galleryElementsTitles 
 */
async function getNextGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles) {

    let lightboxPictureContentSource = await getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < galleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let elementPictureSource = await getContentSource(galleryElementsPictures[i].children[0], true);
        if (lightboxPictureContentSource == elementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == galleryElements.length - 2) {
                await applyPictureAndTitleToLightbox(galleryElementsPictures[i+1], galleryElementsTitles[i+1], false, true);
            }
            else if (i == galleryElements.length - 1) {
                console.log("You've reached the last picture.");
            }
            else {
                await applyPictureAndTitleToLightbox(galleryElementsPictures[i+1], galleryElementsTitles[i+1], false, false);
            }
        }
    }
}


// ============================== EVENTS ==============================

// Lightbox modal opening, navigation, closing with cross and closing with empty areas

setTimeout(function() {

    // - Opening -
    const galleryElements = document.querySelectorAll(".gallery_element");
    const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
    const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");

    for (let i = 0; i < galleryElements.length; i++) {
        let galleryElementPicture = galleryElementsPictures[i];
        let galleryElementTitle = galleryElementsTitles[i];

        galleryElementPicture.addEventListener("click", function() {
            console.log('Click');
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == 0) {
                applyPictureAndTitleToLightbox(galleryElementPicture, galleryElementTitle, true, false);
            }
            else if (i == galleryElements.length - 1) {
                applyPictureAndTitleToLightbox(galleryElementPicture, galleryElementTitle, false, true);
            }
            else {
                applyPictureAndTitleToLightbox(galleryElementPicture, galleryElementTitle, false, false);
            }
            launchLightboxModal();
        });
    }

    // - Navigation between gallery pictures -
    lightboxModalPreviousButton.addEventListener("click", function() {
        getPreviousGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles);
    });
    lightboxModalNextButton.addEventListener("click", function() {
        getNextGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles);
    });
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowLeft") {
            getPreviousGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles);
        }
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowRight") {
            getNextGalleryElement(lightboxPicture, galleryElements, galleryElementsPictures, galleryElementsTitles);
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

}, 300);