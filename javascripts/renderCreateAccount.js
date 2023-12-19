import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { renderLogin } from "./renderLogIn.js";
import { makeElement } from "./util/makeElement.js";
import { renderCreatePost } from "./renderCreatePost.js";
import { showLoggedInMenuOptions } from "./renderMenu.js";
import { renderConfirmEmail } from "./renderConfirmEmail.js";
import { createUser } from "./api.js";
import { startLoading, stopLoading } from "./util/startStopLoading.js";
import { setLoginCreds } from "./credentials.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export const avatars = [
    "&#x1F469;",
    "&#x1F468;",
    "&#x1F467;",
    "&#x1F466;",
    "&#x1F475;",
    "&#x1F474;",
    "&#128526;",
    "&#x1F476;",
    "&#x1F47C;",
    "&#x1F46E;",
    "&#x1F575;",
    "&#x1F482;",
    "&#x1F477;",
    "&#x1F473;",
    "&#x1F471;",
    "&#x1F385;",
    "&#x1F936;",
    "&#x1F478;",
    "&#x1F934;",
    "&#x1F470;",
    "&#x1F935;",
    "&#x1F930;",
    "&#x1F472;",
    "&#x1F64D;",
    "&#x1F64E;",
    "&#x1F481;",
    "&#x1F64B;",
    "&#x1F464;"
];

let selectedAvatar = avatars[avatars.length - 1];

export function renderCreateAccount() {
    portUsernamePassword();

    hideAllSections();
    hide("posts-container");
    show("create-account-area");
    show("create-button");
    show("cancel-button");

    showSelectedAvatar();
    addChoicesToAvatarSelect();
    
    activateUsernamePreview();
    activateCancelButton();
    activateCreateButton();
}

function portUsernamePassword() {
    const username = document.getElementById("login-username-box").value;
    const password = document.getElementById("login-pass-box").value;
    if (username.length > 0) {
        document.getElementById("create-username-box").value = username;
    }
    if (password.length > 0) {
        document.getElementById("create-pass-box").value = password;
    }
}

function activateUsernamePreview() {
    document.getElementById("create-username-box").addEventListener("change", (e) => {
        document.getElementById("username-preview").innerText = e.target.value;
    });
}

function addChoicesToAvatarSelect() {
    let parentElement = document.getElementById("select-avatar");
    // gets rid of all choices (they'll be added back in a sec)
    parentElement.replaceWith(parentElement.cloneNode(false));
    parentElement = document.getElementById("select-avatar");
    avatars.forEach((avatarCode) => {
        const avatarElement = makeElement("avatar");
        avatarElement.classList.add("avatar-choice");
        avatarElement.innerHTML = avatarCode;
        parentElement.appendChild(avatarElement);
        if (avatarCode === selectedAvatar) {
            avatarElement.classList.add("selected-avatar");
        }
        avatarElement.addEventListener("click", (e) => {
            setSelectedAvatar(e, avatarCode);
        });
    });
}

function setSelectedAvatar(e, avatarCode) {
    selectedAvatar = avatarCode;
    document.getElementById("select-avatar").childNodes.forEach((avatarChoice) => {
        avatarChoice.classList.remove("selected-avatar");
    });
    e.target.classList.add("selected-avatar");
    showSelectedAvatar();
}

function showSelectedAvatar() {
    document.getElementById("selected-avatar").innerHTML = selectedAvatar;
}

function activateCancelButton() {
    document.getElementById("cancel-button").addEventListener("click", () => {
        show("posts-container");
        renderLogin();
    });
}

function validEmail(email) {
    if (email.length > 100) {
        return false;
    }
    const pieces = email.split("@");
    if (pieces.length !== 2) {
        return false;
    }
    if (pieces[1].split(".").length < 2) {
        return false;
    }
    return true;
}

function validateInput() {

    let allGood = true;
    let message = "";

    // terms
    const checked = document.getElementById("term-1").checked;
    if (!checked) {
        allGood = false;
        message = "agree to terms";
    }

    // password
    const pass1 = document.getElementById("create-pass-box").value;
    const pass2 = document.getElementById("retype-pass-box").value;
    if (pass1 !== pass2) {
        allGood = false;
        message = "passwords don't match";
    }
    if (pass1.length < 6) {
        allGood = false;
        message = "password too short (min length: 6)";
    }
    if (pass1.length > 50) {
        allGood = false;
        message = "password too long (max length: 50)";
    }

    // email
    const email = document.getElementById("email-box").value;
    if (!validEmail(email)) {
        allGood = false;
        message = "enter valid email";
    }
    
    // username
    const username = document.getElementById("create-username-box").value;
    if (username.length < 4) {
        allGood = false;
        message = "username too short (min length: 4)";
    }
    if (username.length > 20) {
        allGood = false;
        message = "username too long (max length: 20)";
    }
    
    return {
        allGood: allGood,
        message: message
    }
}

function activateCreateButton() {
    document.getElementById("create-button").addEventListener("click", () => {
        const inputValid = validateInput();
        if (inputValid.allGood) {
            clearError();
            const username = document.getElementById("create-username-box").value;
            const avatar = selectedAvatar;
            const pass = document.getElementById("create-pass-box").value;
            const email = document.getElementById("email-box").value;
            const loading = startLoading();
            createUser(username, avatar, pass, email).then((res) => {
                stopLoading(loading);
                if (res.status === "success") {
                    clearError();
                    renderConfirmEmail(username);
                } else {
                    setError(cleanErrorMessage(res.message));
                }
            });
        } else {
            setError(inputValid.message);
        }
    });
}

function cleanErrorMessage(message) {
    if (message.startsWith("ERROR ")) {
        return message.slice(6);
    } else {
        return message;
    }
}