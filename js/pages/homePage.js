// ========== HOMEPAGE INITIALIZATION ==========

/**
 * Get data from JSON file
 * @returns {array} 
 */
async function getData(url) {

    let data;

    await fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(value) {
            data = value;
        })
        .catch(function(error) {
            console.log("Error at fetch:" + error.message);
        });
    
    return data
}

/**
 * Display data in HTML file after fetch operation
 * @param {array} photographers 
 */
async function displayData(photographers) {

    const photographersList = document.querySelector(".photographers_list");
    const nav = document.querySelector(".nav");
    let navTags = [];

    photographers.forEach(function(photographer) {
        // Create photographer cards
        const photographerModel = new Photographer(photographer);
        const photographerCard = photographerModel.createCard;
        photographersList.appendChild(photographerCard);

        // Check if photographer tags are already in the navigation bar
        for (let j = 0; j < photographer.tags.length; j++) {
            const navTagName = "#" + photographer.tags[j].charAt(0).toUpperCase() + photographer.tags[j].slice(1);
            if (navTags.includes(navTagName) == false) {
                navTags.push(navTagName);
            }
        }
    })

    // Create navigation filters
    navTags.forEach(function(tag) {
        const navTagModel = new NavTag(tag);
        const navTag = navTagModel.createTag;
        nav.appendChild(navTag);
    })

}

/**
 * Initialize homepage data
 */
async function initHomepage() {
    let jsonUrl = "data/data.json";
    let data = await getData(jsonUrl);
    let photographers = data["photographers"];
    displayData(photographers);
    console.log("All done for the homepage!");
}

initHomepage();


// ========== EVENTS AND ACTIONS ==========

/**
 * Filter displayed photographers based on tags
 * @param {DOMElement} selectedTag 
 * @param {DOMElement} navTags 
 * @param {DOMElement} photographerCards 
 * @param {DOMElement} photographerCardsTags 
 */
async function filterPhotographersByTags(selectedTag, navTags, photographerCards, photographerCardsTags) {

    for (let i = 0; i < navTags.length; i++) {
        const navTag = navTags[i];

        if (selectedTag.innerHTML.toLowerCase() == navTag.innerHTML.toLowerCase()) {
            navTag.classList.toggle("nav_tag--active");
        }
    }

    const activeNavTags = document.querySelectorAll(".nav_tag--active");

    // For each photographer
    for (let i = 0; i < photographerCards.length; i++) {
        const photographerCard = photographerCards[i];
        let photographerTagList = [];
        for (let j = 0; j < photographerCardsTags[i].children.length; j++) {
            photographerTagList.push(photographerCardsTags[i].children[j].innerHTML);
        }

        // Display every photographer
        photographerCard.style.opacity = "1";
        setTimeout(function() {
            photographerCard.style.display = "flex";
        }, 300)

        // For each tag in photographer
        for (let k = 0; k < activeNavTags.length; k++) {
            const activeNavTag = activeNavTags[k].innerHTML.toLowerCase();

            // If active tag is not contained in photographer tags, hide photographer
            if (!photographerTagList.includes(activeNavTag)) {
                photographerCard.style.opacity = "0";
                setTimeout(function() {
                    photographerCard.style.display = "none";
                }, 300)
            } 
        }
    }
}

// Filter displayed photographers based on tags

setTimeout(function() {

    const navTags = document.querySelectorAll(".nav_tag");
    const photographerCards = document.querySelectorAll(".photographer_card");
    const photographerCardsTags = document.querySelectorAll(".photographer_card_tags");

    // Make each tag clickable
    const tags = document.querySelectorAll(".tag");
    tags.forEach(function(tag) {
        tag.addEventListener("click", function() {
            filterPhotographersByTags(tag, navTags, photographerCards, photographerCardsTags)
        });
        tag.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                filterPhotographersByTags(tag, navTags, photographerCards, photographerCardsTags);
            }
        })
    })

}, 1000);