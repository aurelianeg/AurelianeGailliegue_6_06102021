// ========== DOM ELEMENTS ==========

const nav = document.querySelector(".nav");
const photographersList = document.querySelector(".photographers_list");
const photographerCard = document.querySelector(".photographer_card");


// ========== FUNCTIONS ==========

/**
 * Apply the data taken from the JSON file to the HTML elements on the homepage for each photographer
 * @param {array} photographer 
 * @param {HTML element} photographerCard 
 */
function applyDataToPhotographerHomePage(photographer, photographerCard) {

    // Get all HTML children
    [photographerCardLink, photographerCardLocation, photographerCardDescription, photographerCardPrice, photographerCardTags, photographerCardId] = photographerCard.children;
    [photographerCardProfilePicture, photographerCardName] = photographerCardLink.children;

    // Change text in HTML by data in JSON
    photographerCardProfilePicture.src = "assets/pictures/photographers/" + photographer.portrait;
    photographerCardName.innerHTML = photographer.name;
    photographerCardLocation.innerHTML = photographer.city + ', ' + photographer.country;
    photographerCardDescription.innerHTML = photographer.tagline;
    photographerCardPrice.innerHTML = photographer.price + " € / jour";
    photographerCardId.innerHTML = photographer.id;
    // Empty tags
    photographerCardTags.innerHTML = '';
    for (let j = 0; j < photographer.tags.length; j++) {
        // Create a new span for each tag
        const photographerCardTag = document.createElement("span");
        photographerCardTag.innerHTML = "#" + photographer.tags[j];
        photographerCardTags.appendChild(photographerCardTag);
    }
}

/**
 * Initialize homepage with all photographers
 * @param {list} photographers - Data list from JSON file
 * @param {HTML element} photographersList - HTML element for all photographers
 * @param {HTML element} photographerCard - HTML element for each photographer
 * @param {HTML element} nav - Navigation bar
 */
function getHomepageData(photographers, photographersList, photographerCard, nav) {

    // Initialize empty navigation filters
    const navTags = [];

    for (let i = 0; i < photographers.length; i++) {

        let photographer = photographers[i];

        // Create a clone of the original photographer card
        if (i != 0) {
            photographerCardNew = photographerCard.cloneNode(true);
            photographersList.appendChild(photographerCardNew);
        }

        // Get last photographer card created
        const photographerCards = document.querySelectorAll(".photographer_card");

        applyDataToPhotographerHomePage(photographer, photographerCards[i]);

        for (let j = 0; j < photographer.tags.length; j++) {
            // Check if the tag is already in the navigation bar
            const navTagName = "#" + photographer.tags[j].charAt(0).toUpperCase() + photographer.tags[j].slice(1);
            if (navTags.includes(navTagName) == false) {
                navTags.push(navTagName);
            }
        }
    }

    // Create navigation filters
    for (let k = 0; k < navTags.length; k++) {
        const navTag = document.createElement("span");
        navTag.classList.add("nav_tag");
        navTag.innerHTML = navTags[k];
        nav.appendChild(navTag);
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

    getHomepageData(photographers, photographersList, photographerCard, nav);

    console.log("All done for the homepage!");

}, 300);


// ========== EVENTS ==========

// Get photographer ID at the click on each card
// to send information for photographer page launching

setTimeout(function() {

    const photographerCards = document.querySelectorAll(".photographer_card");

    photographerCards.forEach((card) => card.addEventListener("click", function() {
        link = card.children[0];
        id = card.children[5];
        link.href += "?id=" + id.innerHTML;
    }))

}, 1000);


//////// !!!!!!!!!!!!!!!!!!!!!!!! À OPTIMISER

// Filter displayed photographers based on tags

setTimeout(function() {

    const navTags = document.querySelectorAll(".nav_tag");
    const photographerCards = document.querySelectorAll(".photographer_card");
    const photographerCardsTags = document.querySelectorAll(".photographer_card_tags");

    navTags.forEach((tag) => tag.addEventListener("click", function() {

        tag.classList.toggle("nav_tag--active");

        // If enabled
        if (tag.classList.contains("nav_tag--active")) {
            tag.style.backgroundColor = "#EBBDB3";
        }
        // If disabled
        else {
            tag.style.backgroundColor = "#FFFFFF";
        }

        const activeNavTags = document.querySelectorAll(".nav_tag--active");

        // For each photographer
        for (let i = 0; i < photographerCards.length; i++) {
            const photographerCard = photographerCards[i];
            const photographerTagList = photographerCardsTags[i].children;
    
            const photographerActiveTags = [];
            // For each tag in photographer
            for (let k = 0; k < photographerTagList.length; k++) {
                for (let j = 0; j < activeNavTags.length; j++) {
                    const activeNavTagName = activeNavTags[j].innerHTML.toLowerCase();
                    // Check if the active tags are in the photographer tags
                    if (photographerTagList[k].innerHTML == activeNavTagName) {
                        photographerActiveTags.push(activeNavTagName);
                    }
                }
            }
    
            // Display photographer if it has all selected tags
            if (photographerActiveTags.length == activeNavTags.length) {
                photographerCard.style.opacity = "1";
                setTimeout(function() {
                    photographerCard.style.display = "flex";
                }, 300)
            }
            // Hide photographer if it hasn't all selected tags
            else {
                photographerCard.style.opacity = "0";
                setTimeout(function() {
                    photographerCard.style.display = "none";
                }, 300)
            }
        }
    }))

}, 1000);
