// ============================== FUNCTIONS ==============================

/**
 * Focus or unfocus page elements when the lightbox is opened or closed
 * @param {string} tabIndexValue 
 */
 async function changeTabIndexesBehindContactModal(tabIndexValue) {

    const headerLink = document.querySelector(".header_link");
    const presentationContact = document.querySelector(".presentation_contact");
    const sortingInput = document.querySelector(".sorting_input");
    const galleryElementPictures = document.querySelectorAll(".gallery_element_picture");
    const galleryElementLegendLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");

    headerLink.tabIndex = tabIndexValue;
    presentationContact.tabIndex = tabIndexValue;
    sortingInput.tabIndex = tabIndexValue;
    for (let i = 0; i < galleryElementPictures.length; i++) {
        galleryElementPictures[i].tabIndex = tabIndexValue;
    }
    for (let j = 0; j < galleryElementLegendLikesHearts.length; j++) {
        galleryElementLegendLikesHearts[j].tabIndex = tabIndexValue;
    }
}


/**
 * Launch contact modal
 */
async function launchContactModal() {

    const contactModalBackground = document.querySelector(".contact_background");
    const contactModalContent = document.querySelector(".contact_content");
    const mainWrapper = document.querySelector(".main");
    const contactModalFormInputs = document.querySelectorAll(".contact_form_input");

    contactModalBackground.style.display = "block";
    contactModalContent.setAttribute("aria-hidden", "false");
    mainWrapper.setAttribute("aria-hidden", "true");
    contactModalFormInputs[0].focus();

    changeTabIndexesBehindContactModal("-1");
}


/**
 * Close contact modal (with animation)
 */
async function closeContactModal() {

    const contactModalBackground = document.querySelector(".contact_background");
    const contactModalContent = document.querySelector(".contact_content");
    const mainWrapper = document.querySelector(".main");

    contactModalContent.classList.add("isClosed");
    setTimeout(function() {
        contactModalContent.classList.remove("isClosed");
        contactModalBackground.style.display = "none";
        contactModalContent.setAttribute("aria-hidden", "true");
        mainWrapper.setAttribute("aria-hidden", "false");
    }, 300);

    changeTabIndexesBehindContactModal("0");
}


/**
 * Show error message if input not valid
 * @param {DOMElement} input - The given input
 * @param {string} message - The error message
 */
async function showErrorMessage(input, message) {

    const contactForm = input.parentElement;
    input.setAttribute("aria-invalid", "true");
    contactForm.className = "contact_form error";
    const errorMessage = contactForm.querySelector(".contact_form_error");
    errorMessage.innerHTML = message;
    input.focus();
}


/**
 * Hide error message if input was not valid
 * @param {DOMElement} input 
 */
async function showSuccess(input) {

    const contactForm = input.parentElement;
    input.setAttribute("aria-invalid", "false");
    contactForm.className = "contact_form success";
    const errorMessage = contactForm.querySelector(".contact_form_error");
    errorMessage.innerHTML = "";
}


/**
 * Check if all form inputs are valid
 * @param {DOMElement} inputs
 * @returns {Boolean}
 */
async function checkFormValidation(inputs) {

    let fields = {firstName: false, lastName: false, email: false, message: false};
    let regexAsciiLetters = /[a-zA-Z]/;
    let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let firstNameInput, lastNameInput, emailInput, messageInput;
    [firstNameInput, lastNameInput, emailInput, messageInput] = inputs;
    // First name input
    if (firstNameInput.value.length == 0) {
        showErrorMessage(firstNameInput, "Veuillez saisir votre prénom.");
    }
    else if (regexAsciiLetters.test(firstNameInput.value) == false) {
        showErrorMessage(firstNameInput, "Veuillez entrer des caractères de A à Z (sans accents).");
    }
    else {
        showSuccess(firstNameInput);
        fields.firstName = true;
    }

    // Last name input
    if (lastNameInput.value.length == 0) {
        showErrorMessage(lastNameInput, "Veuillez saisir votre nom.");
    }
    else if (regexAsciiLetters.test(lastNameInput.value) == false) {
        showErrorMessage(lastNameInput, "Veuillez entrer des caractères de A à Z (sans accents).");
    }
    else {
        showSuccess(lastNameInput);
        fields.lastName = true;
    }

    // Email input
    if (emailInput.value.length == 0) {
        showErrorMessage(emailInput, "Veuillez saisir votre adresse e-mail.");
    }
    else if (regexEmail.test(emailInput.value) == false) {
        showErrorMessage(emailInput, "Veuillez saisir un format d'adresse e-mail valide.");
    }
    else {
        showSuccess(emailInput);
        fields.email = true;
    }

    // Email input
    if (messageInput.value.length == 0) {
        showErrorMessage(messageInput, "Veuillez saisir votre message.");
    }
    else {
        showSuccess(messageInput);
        fields.message = true;
    }

    // Submit form if all fields are valid
    let fieldsValues = Object.values(fields);
    if (fieldsValues.includes(false) == true) {
        return false;
    }
    if (fieldsValues.includes(false) == false) {
        return true;
    }
}


// ============================== EVENTS ==============================

// Contact modal opening, closing with cross, and closing with submit button

setTimeout(function() {

    const contactButton = document.querySelector(".presentation_contact");
    const contactModalContent = document.querySelector(".contact_content");
    const contactModalCloseCross = document.querySelector(".contact_close");
    const contactFormInputs = document.querySelectorAll(".contact_form_input");
    const contactModalSubmitButton = document.querySelector(".contact_submit");

    // - Opening -
    contactButton.addEventListener("click", launchContactModal);

    // - Closing with cross -
    contactModalCloseCross.addEventListener("click", closeContactModal);

    // - Closing with escape key -
    window.addEventListener("keydown", function(event) {
        if (contactModalContent.getAttribute("aria-hidden") == "false" && event.key == "Escape") {
            closeContactModal();
        }
    });

    // - Closing with submit button -
    contactModalSubmitButton.addEventListener("click", function(event) {
        event.preventDefault();     // Keep form informations if not valid
        if (checkFormValidation(contactFormInputs)) {
            // Print contact form inputs in console logs and close contact modal
            for (let i = 0; i < contactFormInputs.length; i++) {
                console.log(contactFormInputs[i].value);
            }
            closeContactModal();
        }
    });

}, 500);