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

        /*<article class="photographer_card">
            <a class="photographer_card_link" href="photographer_page.html">
                <img class="photographer_card_profilepicture" src="" alt ="" />
                <h2 class="photographer_card_name"></h2>
            </a>
            <h3 class="photographer_card_location"></h3>
            <h4 class="photographer_card_description"></h4>
            <h5 class="photographer_card_price"></h5>
            <div class="photographer_card_tags"></div>
            <span class="photographer_card_id"></span>
        </article>*/

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
        cardProfilePicture.setAttribute("src", `assets/pictures/photographers/${this._portrait}`);
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
        let tagList = `${this._tags}`.split(",");
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


    /**
     * Create photographer card in HTML
     * @returns {DOMElement, DOMElement, DOMElement}
     */
    get createProfile() {

        /*<div class="presentation_photographer">
                <h1 class="presentation_photographer_name"></h1>
                <h2 class="presentation_photographer_location"></h2>
                <h3 class="presentation_photographer_description"></h3>
                <div class="presentation_photographer_tags"></div>
        </div>
        <img class="presentation_profilepicture" src="" alt="Photo de profil du photographe" />*/

        // Presentation
        const presentationPhotographer = document.createElement("div");
        presentationPhotographer.classList.add("presentation_photographer");
        // Name
        const presentationPhotographerName = document.createElement("h1");
        presentationPhotographerName.classList.add("presentation_photographer_name");
        presentationPhotographerName.innerHTML = `${this._name}`;
        presentationPhotographer.appendChild(presentationPhotographerName);
        // Location
        const presentationPhotographerLocation = document.createElement("h2");
        presentationPhotographerLocation.classList.add("presentation_photographer_location");
        presentationPhotographerLocation.innerHTML = `${this._city}, ${this._country}`;
        presentationPhotographer.appendChild(presentationPhotographerLocation);
        // Description
        const presentationPhotographerDescription = document.createElement("h3");
        presentationPhotographerDescription.classList.add("presentation_photographer_description");
        presentationPhotographerDescription.innerHTML = `${this._tagline}`;
        presentationPhotographer.appendChild(presentationPhotographerDescription);
        // Tags
        const presentationPhotographerTags = document.createElement("div");
        presentationPhotographerTags.classList.add("presentation_photographer_tags");
        presentationPhotographer.appendChild(presentationPhotographerTags);
        let tagList = `${this._tags}`.split(",");
        for (let i = 0; i < tagList.length; i++) {
            // New span for each tag
            const photographerTag = document.createElement("span");
            photographerTag.classList.add("tag");
            photographerTag.innerHTML = "#" + tagList[i];
            photographerTag.title = tagList[i];
            presentationPhotographerTags.appendChild(photographerTag);
        }

        // Profile picture
        const presentationProfilePicture = document.createElement("img");
        presentationProfilePicture.classList.add("presentation_profilepicture");
        presentationProfilePicture.setAttribute("src", `assets/pictures/photographers/${this._portrait}`);
        presentationProfilePicture.setAttribute("alt", `Photo de profil de ${this._name}`);

        return {presentationPhotographer, presentationProfilePicture}
    }

}