class NavTag {

    /**
     * @param {DOMElement} tag 
     */
    constructor(tag) {
        this._tag = tag
    }

    /**
     * Create navigation tag in HTML
     */
    get createTag() {

        const navTag = document.createElement("span");
        navTag.classList.add("nav_tag", "tag");
        navTag.tabIndex = "0";
        navTag.innerHTML = `${this._tag}`;
        navTag.title = `${this._tag}`.split("#")[1];

        return navTag
    }
}