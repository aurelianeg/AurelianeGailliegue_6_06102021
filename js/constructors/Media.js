class Media {

    /**
     * @param {array} media 
     */
    constructor(media) {
        this._id = media.id
        this._photographerId = media.photographerId
        this._title = media.title
        this._image = media.image
        this._video = media.video
        this._source = media.source
        this._tags = media.tags
        this._likes = media.likes
        this._date = media.date
        this._price = media.price
        this._description = media.description
    }

    /**
     * Create gallery element for media in HTML
     * @returns {DOMElement}
     */
    get createGalleryElement() {

        /*<article class="gallery_element">
            <div class="gallery_element_picture"></div>
            <div class="gallery_element_legend">
                <h2 class="gallery_element_legend_title" aria-label="Titre de l'image"></h2>
                <div class="gallery_element_legend_likes">
                    <h2 class="gallery_element_legend_likes_number" aria-label="Nombre de likes de l'image"></h2>
                    <div class="gallery_element_legend_likes_heart">
                        <i class="fas fa-heart" aria-label="Mettre un like"></i>
                    </div>
                </div>
            </div>
            <div class="gallery_element_date"></div>
        </article>*/

        // Gallery element
        const galleryElement = document.createElement("article");
        galleryElement.classList.add("gallery_element");

        // Picture
        const galleryElementPicture = document.createElement("div");
        galleryElementPicture.classList.add("gallery_element_picture");
        galleryElement.appendChild(galleryElementPicture);
        // Check if video or image
        if (`${this._image}` != "undefined") {
            const galleryElementPictureImage = document.createElement("img");
            galleryElementPictureImage.src = `${this._source}${this._image}`; // Set source before function calling
            galleryElementPictureImage.alt = `${this._description}`;
            galleryElementPicture.appendChild(galleryElementPictureImage);
        }
        else {
            const galleryElementPictureVideo = document.createElement("video");
            galleryElementPicture.appendChild(galleryElementPictureVideo);
            const galleryElementPictureVideoSource = document.createElement("source");
            galleryElementPictureVideoSource.src = `${this._source}${this._video}#t=0.5`; // Set source before function calling
            galleryElementPictureVideo.ariaLabel = `${this._description}`;
            galleryElementPictureVideo.appendChild(galleryElementPictureVideoSource);
        }

        // Legend
        const galleryElementLegend = document.createElement("div");
        galleryElementLegend.classList.add("gallery_element_legend");
        galleryElement.appendChild(galleryElementLegend);

        // Legend title
        const galleryElementLegendTitle = document.createElement("h2");
        galleryElementLegendTitle.classList.add("gallery_element_legend_title");
        galleryElementLegendTitle.setAttribute("aria-label", "Titre de l'image");
        galleryElementLegendTitle.innerHTML = `${this._title}`;
        galleryElementLegend.appendChild(galleryElementLegendTitle);

        // Legend likes
        const galleryElementLegendLikes = document.createElement("div");
        galleryElementLegendLikes.classList.add("gallery_element_legend_likes");
        galleryElementLegend.appendChild(galleryElementLegendLikes);
        const galleryElementLegendLikesNumber = document.createElement("h2");
        galleryElementLegendLikesNumber.classList.add("gallery_element_legend_likes_number");
        galleryElementLegendLikesNumber.setAttribute("aria-label", "Nombre de likes de l'image");
        galleryElementLegendLikesNumber.innerHTML = `${this._likes}`;
        galleryElementLegendLikes.appendChild(galleryElementLegendLikesNumber);
        const galleryElementLegendLikesHeart = document.createElement("div");
        galleryElementLegendLikesHeart.classList.add("gallery_element_legend_likes_heart");
        galleryElementLegendLikes.appendChild(galleryElementLegendLikesHeart);
        const galleryElementLegendLikesHeartIcon = document.createElement("i");
        galleryElementLegendLikesHeartIcon.classList.add("fas", "fa-heart");
        galleryElementLegendLikesHeartIcon.setAttribute("aria-label", "Mettre un like");
        galleryElementLegendLikesHeart.appendChild(galleryElementLegendLikesHeartIcon);

        // Date
        const galleryElementDate = document.createElement("div");
        galleryElementDate.classList.add("gallery_element_date");
        galleryElementDate.innerHTML = `${this._date}`.replace(/-/g, "");
        galleryElement.appendChild(galleryElementDate);

        return galleryElement
    }

}