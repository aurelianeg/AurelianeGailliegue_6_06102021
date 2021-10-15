// ========== DOM ELEMENTS ==========

const presentation = document.querySelector(".presentation");


// ========== FUNCTIONS ==========

/**
 * Apply the data taken from the JSON file to the HTML elements on the photographer page
 * @param {array} photographer 
 * @param {HTML element} photographerCard 
 */
 function applyDataToPhotographerPage(photographer, presentation) {

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
    // Total likes
    // !!!!!!!!! TO DO


    // !!!!!! GET PICTURES TAKEN BY THIS PHOTOGRAPHER
}

/**
 * Initialize photographer page with photographer
 * @param {list} photographers 
 * @param {HTML element} presentation 
 */
function getPhotographerPageData(photographers, presentation) {

    // !!!!!!! TO CHANGE
    let photographer = photographers[0];        

    applyDataToPhotographerPage(photographer, presentation);

    console.log("All done for the photographer page!");
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
    
    console.log("photographers", photographers);
    console.log("media", media);

    getPhotographerPageData(photographers, presentation);

}, 500);
