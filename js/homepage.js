// ========== DOM ELEMENTS ==========

const nav = document.querySelector(".nav");
const photographersList = document.querySelector(".photographers_list");
const photographerCard = document.querySelector(".photographer_card");


// ========== FUNCTIONS ==========

// Get data from JSON file

let jsonUrl = "assets/data/data.json";

fetch(jsonUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        //console.log("value", value);
        window.data = value;    // Get data as global variable
    })
    .catch(function(error) {
        console.log("Error:" + error.message);
    });


// Save global variables after fetch operation

setTimeout(function() {

    let photographers = data.photographers;
    let media = data.media;
    let nbPhotographers = photographers.length;
    
    //console.log("photographers", photographers);
    //console.log("media", media);
    //console.log("nbPhotographers", nbPhotographers);

    // Initialize empty navigation filters
    const navTags = [];

    for (let i = 0; i < nbPhotographers; i++) {

        let photographer = photographers[i];

        // Create a clone of the original photographer card
        if (i != 0) {
            photographerCardNew = photographerCard.cloneNode(true);
            photographersList.appendChild(photographerCardNew);
        }

        // Get last photographer card created
        const photographerCards = document.querySelectorAll(".photographer_card");

        // Get all HTML children
        [photographerCardLink, photographerCardLocation, photographerCardDescription, photographerCardPrice, photographerCardTags] = photographerCards[i].children;
        [photographerCardProfilePicture, photographerCardName] = photographerCardLink.children

        // Change text in HTML by data in JSON
        photographerCardProfilePicture.src = "assets/pictures/photographers/" + photographer.portrait;
        photographerCardName.innerHTML = photographer.name;
        photographerCardLocation.innerHTML = photographer.city + ', ' + photographer.country;
        photographerCardDescription.innerHTML = photographer.tagline;
        photographerCardPrice.innerHTML = photographer.price + " € / jour";
        // Empty tags
        photographerCardTags.innerHTML = '';
        for (let j = 0; j < photographer.tags.length; j++) {
            // Create a new span for each tag
            const photographerCardTag = document.createElement("span");
            photographerCardTag.innerHTML = "#" + photographer.tags[j];
            photographerCardTags.appendChild(photographerCardTag);
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
        navTag.innerHTML = navTags[k];
        nav.appendChild(navTag);
    }

    console.log("All done!");

}, 500);
