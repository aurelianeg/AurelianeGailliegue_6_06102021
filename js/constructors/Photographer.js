class Photographer {

    /**
     * @param {array} photographer 
     */
    constructor(photographer) {
        this._name = photographer.name
        this._id = photographer.id
        this._city = photographer.city
        this._country = photographer.country
        this._tags = photographer.tags
        this._tagline = photographer.tagline
        this._price = photographer.price
        this._portrait = photographer.portrait
    }

    /**
     * Create photographer card in HTML
     * @returns {DOMElement}
     */
    get createCard() {

        // Card
        const card = document.createElement("article");
        card.classList.add("photographer_card");

        // Card link with profile picture and name
        const cardLink = document.createElement("a");
        cardLink.classList.add("photographer_card_link");
        cardLink.setAttribute("href", `photographer_page.html?id=${this._id}`);
        cardLink.setAttribute("aria-label", `${this._name}`);
        card.appendChild(cardLink);
        const cardProfilePicture = document.createElement("img");
        cardProfilePicture.classList.add("photographer_card_profilepicture");
        cardProfilePicture.setAttribute("src", `../../assets/pictures/photographers/${this._portrait}`);
        cardProfilePicture.setAttribute("alt", `Photo de profil de ${this._name}`);
        cardLink.appendChild(cardProfilePicture);
        const cardName = document.createElement("h2");
        cardName.classList.add("photographer_card_name");
        cardName.innerHTML = `${this._name}`;
        cardLink.appendChild(cardName);

        // Location
        const cardLocation = document.createElement("h3");
        cardLocation.classList.add("photographer_card_location");
        cardLocation.innerHTML = `${this._city}, ${this._country}`;
        card.appendChild(cardLocation);

        // Description
        const cardDescription = document.createElement("h4");
        cardDescription.classList.add("photographer_card_description");
        cardDescription.innerHTML = `${this._tagline}`;
        card.appendChild(cardDescription);

        // Price
        const cardPrice = document.createElement("h5");
        cardPrice.classList.add("photographer_card_price");
        cardPrice.innerHTML = `${this._price} € / jour`;
        card.appendChild(cardPrice);

        // Tags
        const cardTags = document.createElement("div");
        cardTags.classList.add("photographer_card_tags");
        const tagList = `${this._tags}`.split(",");
        for (let i = 0; i < tagList.length; i++) {
            // New span for each tag
            const cardTag = document.createElement("span");
            cardTag.classList.add("tag");
            cardTag.innerHTML = "#" + tagList[i];
            cardTag.title = tagList[i];
            cardTags.appendChild(cardTag);
        }
        card.appendChild(cardTags);

        return card
    }

}


/*function getHomepageData(photographers, photographersList, photographerCard, nav) {

    // Initialize empty navigation filters
    const navTags = [];

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
        navTag.classList.add("nav_tag", "tag");
        navTag.tabIndex = "0";
        navTag.innerHTML = navTags[k];
        navTag.title = navTags[k].split("#")[1];
        nav.appendChild(navTag);
    }
}*/