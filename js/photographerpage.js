// ========== DOM ELEMENTS ==========

const presentation = document.querySelector(".presentation");
const gallery = document.querySelector(".gallery");
const galleryElement = document.querySelector(".gallery_element");


// ========== FUNCTIONS ==========

/**
 * Apply the data taken from the JSON file to the HTML elements on the photographer page
 * @param {array} photographer 
 * @param {HTML element} presentation 
 * @param {array} media
 */
 function applyDataToPhotographerPage(photographer, presentation, media) {

    // Get all HTML children
    [photographerPresentation, contactForm, photographerProfilePicture, photographerBottomBar] = presentation.children;
    [photographerName, photographerLocation, photographerDescription, photographerTags] = photographerPresentation.children;
    photographerTotalLikes = photographerBottomBar.children[0].children[0];
    photographerPrice = photographerBottomBar.children[1];

    // Change text in HTML by data in JSON
    photographerProfilePicture.src = "assets/pictures/photographers/" + photographer.portrait;
    photographerName.innerHTML = photographer.name;
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
        [galleryElementPicture, galleryElementVideo, galleryElementLegend] = galleryElements[l].children;
        galleryElementVideoSource = galleryElementVideo.children[0];
        galleryElementLegendTitle = galleryElementLegend.children[0];
        galleryElementLegendLikesNumber = galleryElementLegend.children[1].children[0];

        // Change text in HTML by data in JSON
        const folderName = (photographer.name).split(' ')[0].replace('-', ' ');

        // Check if video or image
        if (photographerMedia.image != undefined) {
            galleryElementPicture.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.image;
            //console.log("width", window.innerWidth);
            //console.log("height", window.innerHeight);
            galleryElementPicture.style.width = "350px";
            galleryElementPicture.style.height = "300px";
            /*if (window.innerHeight >= 1024) {
                galleryElementPicture.style.height = "300px";
            }
            else {
                galleryElementPicture.style.height = "190px";
            }*/
            galleryElementPicture.style.visibility = "visible";
            galleryElementVideoSource.src = "";
            galleryElementVideo.style.width = "0px";
            galleryElementVideo.style.height = "0px";
            galleryElementVideo.style.visibility = "hidden";
            // !!!! AJOUTER DISPLAY: NONE
        }
        else {
            console.log("video", photographerMedia.video);
            galleryElementVideoSource.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.video + "#t=0.5";
            galleryElementVideo.style.width = "350px";
            galleryElementVideo.style.height = "300px";
            galleryElementVideo.style.visibility = "visible";
            galleryElementPicture.src = "";
            galleryElementPicture.style.width = "0px";
            galleryElementPicture.style.height = "0px";
            galleryElementPicture.style.visibility = "hidden";
        }
        galleryElementLegendTitle.innerHTML = photographerMedia.title;
        galleryElementLegendLikesNumber.innerHTML = photographerMedia.likes;
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

    const chosenId = localStorage["chosenPhotographerId"];
    
    for (i = 0; i < photographers.length; i++) {
        if (photographers[i].id == chosenId) {
            window.photographer = photographers[i];
        }    
    }

    const photographer = window.photographer;

    applyDataToPhotographerPage(photographer, presentation, media);

    console.log("All done for the photographer page!");

}, 500);


// ========== EVENTS ==========

// Increase the number of likes (on the picture and total)
// if the user likes a picture

setTimeout(function() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".presentation_bottom_bar_likes_number");

    galleryElementLikesHearts.forEach((heart) => heart.addEventListener("click", function() {
        console.log("Heart clicked!");
        // Get likes number for the picture and increase it
        const likesNumber = heart.parentNode.children[0];
        likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
        // Increase total number of likes
        photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
    }))

    // CAN BE CLICKED MULTIPLE TIMES???
    // WRITTEN IN JSON FILE???

}, 1000);
