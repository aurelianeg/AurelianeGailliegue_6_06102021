// ========== DOM ELEMENTS ==========

const nav = document.querySelector(".nav");
const photographersList = document.querySelector(".photographers_list");
const photographerCard = document.querySelector(".photographer_card");


// ========== FUNCTIONS ==========

// Get data from JSON file

let jsonUrl = "assets/data/data.json";

fetch(jsonUrl)
.then((response) => response.json())
.then((data) => {
    window.data = data;     // Get data as global variable
})
.catch(error => {
    console.log("Error:" + error.message);
});


// Save global variables after fetch operation

setTimeout(() => {

    let data = window.data;
    console.log("data", data);
    let photographers = data.photographers;
    let media = data.media;
    let nbPhotographers = photographers.length;
    
    //console.log("photographers", photographers);
    //console.log("media", media);
    //console.log("nbPhotographers", nbPhotographers);

    // Initialize empty navigation filters
    const navTags = [];

    for (let i = 0; i < nbPhotographers; i++) {

        // Create a clone of the original photographer card
        if (i != 0) {
            photographerCardNew = photographerCard.cloneNode(true);
            photographersList.appendChild(photographerCardNew);
        }

        // Get last photographer card created
        const photographerCards = document.querySelectorAll(".photographer_card");

        // Get all HTML children
        [photographerCardProfilePicture, photographerCardName, photographerCardLocation, photographerCardDescription, photographerCardPrice, photographerCardTags] = photographerCards[i].children;
        
        // Change text in HTML by data in JSON
        photographerCardProfilePicture.src = "assets/pictures/photographers/" + photographers[i].portrait;
        photographerCardName.innerHTML = photographers[i].name;
        photographerCardLocation.innerHTML = photographers[i].city + ', ' + photographers[i].country;
        photographerCardDescription.innerHTML = photographers[i].tagline;
        photographerCardPrice.innerHTML = photographers[i].price + " € / jour";
        // Empty tags
        photographerCardTags.innerHTML = '';
        for (let j = 0; j < photographers[i].tags.length; j++) {
            // Create a new div for each tag
            const photographerCardTag = document.createElement("div");
            photographerCardTag.innerHTML = "#" + photographers[i].tags[j];
            photographerCardTags.appendChild(photographerCardTag);
            // Check if the tag is already in the navigation bar
            const navTagName = "#" + photographers[i].tags[j].charAt(0).toUpperCase() + photographers[i].tags[j].slice(1);
            if (navTags.includes(navTagName) == false) {
                navTags.push(navTagName);
            }
        }
    }

    // Create navigation filters
    for (let k = 0; k < navTags.length; k++) {
        const navTag = document.createElement("div");
        navTag.innerHTML = navTags[k];
        nav.appendChild(navTag);
    }

    console.log("All done!");

}, 500);
