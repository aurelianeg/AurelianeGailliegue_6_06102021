// ========== DOM ELEMENTS ==========

const main = document.querySelector("main");
const photographerCard = document.querySelector(".photographer_card");
const photographerCardProfilePicture = document.querySelector(".photographer_card_profilepicture");
const photographerCardName = document.querySelector(".photographer_card_name");
const photographerCardLocation = document.querySelector(".photographer_card_location");
const photographerCardDescription = document.querySelector(".photographer_card_description");
const photographerCardPrice = document.querySelector(".photographer_card_price");
const photographerCardTags = document.querySelector(".photographer_card_tags");


// ========== FUNCTIONS ==========

// Get data from JSON file

let jsonUrl = "./../assets/data/data.json";

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
    let photographers = data.photographers;
    let media = data.media;
    console.log("data", data);
    console.log("photographers", photographers);
    console.log("media", media);

    let nbPhotographers = photographers.length;

    for (i = 0; i < nbPhotographers; i++) {
        if (i = 0) {
            console.log("test");
        }
        console.log("i");
        console.log(photographers[i]);
        //photographerCardNew = photographerCard.cloneNode(true);
        //main.appendChild(photographerCardNew);

        console.log("Done");
    }
}, 500);


