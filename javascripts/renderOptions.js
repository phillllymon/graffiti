import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { makeElement } from "./util/makeElement.js";
import { showLoginOrNewPost } from "../popup.js";
import { avatars } from "./renderCreateAccount.js";
import { deleteAccount, changePassword, changeAvatar } from "./api.js";
import { setLoginCreds } from "./credentials.js";
import { renderLogin } from "./renderLogIn.js";
import { hideLoggedInMenuOptions } from "./renderMenu.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

let selectedAvatar;

export function renderOptions() {
    hideAllSections();
    hide("posts-container");
    show("options-area");

    selectedAvatar = document.creds.avatar;

    activateExitButton();
    displayUsernameInPreview();
    addChoicesToAvatarSelect();
    showSelectedAvatar();

    activateChangeAvatarButton();
    activateChangePasswordButton();
    activateDeleteAccountButton();
}

function activateChangeAvatarButton() {
    document.getElementById("change-avatar-button").addEventListener("click", () => {
        const username = document.creds.username;
        const token = document.creds.token;
        const avatar = selectedAvatar;
        changeAvatar(username, token, avatar).then((res) => {
            if (res.status === "success") {
                setMessage("Avatar changed");
                setLoginCreds(username, token, avatar);
            } else {
                setError(cleanErrorMessage(res.message));
            }
        });
    });
}

function activateChangePasswordButton() {
    document.getElementById("change-password-button").addEventListener("click", () => {
        const oldPassword = document.getElementById("old-pass-box").value;
        const newPassword = document.getElementById("new-pass-box").value;
        const retypePassword = document.getElementById("retype-new-pass-box").value;
        const token = document.creds.token;
        const username = document.creds.username;
        if (newPassword.length < 6) {
            setError("Password too short (min length: 6)");
        } else if (newPassword !== retypePassword) {
            setError("Passwords do not match");
        } else {
            changePassword(username, oldPassword, token, newPassword).then((res) => {
                if (res.status === "success") {
                    clearError();
                    document.getElementById("old-pass-box").value = "";
                    document.getElementById("new-pass-box").value = "";
                    document.getElementById("retype-new-pass-box").value = "";
                    setMessage("Password changed");
                } else {
                    setError(cleanErrorMessage(res.message));
                }
            });
        }
    });
}

function activateDeleteAccountButton() {
    document.getElementById("delete-account-button").addEventListener("click", () => {
        const pass = document.getElementById("delete-password").value;
        const token = document.creds.token;
        const username = document.creds.username;
        if (pass.length < 1) {
            setError("Type password to delete");
        } else {
            deleteAccount(username, pass, token).then((res) => {
                if (res.status === "success") {
                    clearError();
                    document.getElementById("delete-password").value = "";
                    setMessage("Account deleted");
                    setLoginCreds(null, null, null);
                    hideLoggedInMenuOptions();
                    renderLogin();
                } else {
                    setError(cleanErrorMessage(res.message));
                }
            })
        }
    });
}

function addChoicesToAvatarSelect() {
    let parentElement = document.getElementById("select-new-avatar");
    // gets rid of all choices (they'll be added back in a sec)
    parentElement.replaceWith(parentElement.cloneNode(false));
    parentElement = document.getElementById("select-new-avatar");
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
    document.getElementById("select-new-avatar").childNodes.forEach((avatarChoice) => {
        avatarChoice.classList.remove("selected-avatar");
    });
    e.target.classList.add("selected-avatar");
    showSelectedAvatar();
}

function showSelectedAvatar() {
    document.getElementById("new-avatar").innerHTML = selectedAvatar;
}

function displayUsernameInPreview() {
    document.getElementById("username-display").innerHTML = document.creds.username;
}

function activateExitButton() {
    document.getElementById("exit-options-button").addEventListener("click", () => {
        show("posts-container");
        showLoginOrNewPost();
    });
}

function cleanErrorMessage(message) {
    if (message.startsWith("ERROR ")) {
        return message.slice(6);
    } else {
        return message;
    }
}