// ============================== FUNCTIONS ==============================

/**
 * Focus or unfocus page elements when the lightbox is opened or closed
 * @param {string} tabIndexValue 
 */
async function changeTabIndexesBehindLightbox(tabIndexValue) {

    const headerLink = document.querySelector(".header_link");
    const presentationContact = document.querySelector(".presentation_contact");
    const sortingInput = document.querySelector(".sorting_input");
    const galleryElementPictures = document.querySelectorAll(".gallery_element_picture");
    const galleryElementLegendLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");

    headerLink.tabIndex = tabIndexValue;
    presentationContact.tabIndex = tabIndexValue;
    sortingInput.tabIndex = tabIndexValue;
    for (let i = 0; i < galleryElementPictures.length; i++) {
        galleryElementPictures[i].tabIndex = tabIndexValue;
    }
    for (let j = 0; j < galleryElementLegendLikesHearts.length; j++) {
        galleryElementLegendLikesHearts[j].tabIndex = tabIndexValue;
    }
}


/**
 * Launch lightbox modal
 */
async function launchLightboxModal() {

    const mainWrapper = document.querySelector(".main");
    const lightboxModalBackground = document.querySelector(".lightbox_background");
    const lightboxModalContent = document.querySelector(".lightbox_content");
    const lightboxModalCloseCross = document.querySelector(".lightbox_close");

    lightboxModalBackground.style.display = "block";
    lightboxModalContent.setAttribute("aria-hidden", "false");
    mainWrapper.setAttribute("aria-hidden", "true");
    lightboxModalCloseCross.focus();

    changeTabIndexesBehindLightbox("-1");
    const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
    const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
    lightboxModalCloseCross.tabIndex = "0";
    lightboxModalPreviousButton.tabIndex = "0";
    lightboxModalNextButton.tabIndex = "0";
}


/**
 * Close lightbox modal (with animation)
 */
async function closeLightboxModal() {

    const mainWrapper = document.querySelector(".main");
    const lightboxModalBackground = document.querySelector(".lightbox_background");
    const lightboxModalContent = document.querySelector(".lightbox_content");

    lightboxModalContent.classList.add("isClosed");
    setTimeout(function() {
        lightboxModalContent.classList.remove("isClosed");
        lightboxModalBackground.style.display = "none";
        lightboxModalContent.setAttribute("aria-hidden", "true");
        mainWrapper.setAttribute("aria-hidden", "false");
    }, 300);

    changeTabIndexesBehindLightbox("0");
    const lightboxModalCloseCross = document.querySelector(".lightbox_close");
    const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
    const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
    lightboxModalCloseCross.tabIndex = "-1";
    lightboxModalPreviousButton.tabIndex = "-1";
    lightboxModalNextButton.tabIndex = "-1";
}


/**
 * Get information in clicked HTML gallery element and apply it to the lightbox
 * @param {DOMElement} element
 * @param {boolean} firstpicture 
 * @param {boolean} lastpicture 
 */
async function applyPictureAndTitleToLightbox(element, firstpicture, lastpicture) {

    let picture = element.firstChild;
    let title = element.children[1].firstChild;

    // Get photographer page information
    let pictureContent = picture.children[0];

    const lightboxPicture = document.querySelector(".lightbox_container_picture");
    const lightboxTitle = document.querySelector(".lightbox_container_title");

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

    const lightboxModalContent = document.querySelector(".lightbox_content");

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
 */
export async function getPreviousGalleryElement(lightboxPicture) {

    const galleryElements = document.querySelectorAll(".gallery_element");

    let lightboxPictureContentSource = await getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < galleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let elementPictureSource = await getContentSource(galleryElements[i].firstChild.children[0], true);
        if (lightboxPictureContentSource == elementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == 1) {
                await applyPictureAndTitleToLightbox(galleryElements[i-1], true, false);
            }
            else if (i == 0) {
                console.log("You've reached the first picture.");
            }
            else {
                await applyPictureAndTitleToLightbox(galleryElements[i-1], false, false);
            }
        }
    }
}


/**
 * Get next gallery element in lightbox
 * @param {DOMElement} lightboxPicture
 */
export async function getNextGalleryElement(lightboxPicture) {

    const galleryElements = document.querySelectorAll(".gallery_element");

    let lightboxPictureContentSource = await getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < galleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let elementPictureSource = await getContentSource(galleryElements[i].firstChild.children[0], true);
        if (lightboxPictureContentSource == elementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == galleryElements.length - 2) {
                await applyPictureAndTitleToLightbox(galleryElements[i+1], false, true);
            }
            else if (i == galleryElements.length - 1) {
                console.log("You've reached the last picture.");
            }
            else {
                await applyPictureAndTitleToLightbox(galleryElements[i+1], false, false);
            }
        }
    }
}


// ============================== EVENTS ==============================

/**
 * Lightbox modal navigation, closing with cross and closing with empty areas (even after the sorting)
 */
export async function initLightboxEvents() {

    const lightboxModalBackground = document.querySelector(".lightbox_background");
    const lightboxModalContent = document.querySelector(".lightbox_content");
    const lightboxModalCloseCross = document.querySelector(".lightbox_close");
    const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
    const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
    const lightboxPicture = document.querySelector(".lightbox_container_picture");

    // - Navigation between gallery pictures -
    lightboxModalPreviousButton.addEventListener("click", function() {
        getPreviousGalleryElement(lightboxPicture);
    });
    lightboxModalNextButton.addEventListener("click", function() {
        getNextGalleryElement(lightboxPicture);
    });
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowLeft") {
            getPreviousGalleryElement(lightboxPicture);
        }
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowRight") {
            getNextGalleryElement(lightboxPicture);
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
    })
}


/**
 * Lightbox modal opening and update information (picture and title)
 */
export async function updateLightbox() {

    // - Opening -
    const galleryElements = document.querySelectorAll(".gallery_element");

    galleryElements.forEach(function(galleryElement) {

        let galleryElementPicture = galleryElement.firstChild;
        galleryElementPicture.addEventListener("click", function() {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (galleryElement == galleryElements[0]) {
                applyPictureAndTitleToLightbox(galleryElement, true, false);
            }
            else if (galleryElement == galleryElements[galleryElements.length - 1]) {
                applyPictureAndTitleToLightbox(galleryElement, false, true);
            }
            else {
                applyPictureAndTitleToLightbox(galleryElement, false, false);
            }
            launchLightboxModal();
        });
    })
}