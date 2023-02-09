import { setLoginCreds } from "./credentials.js";
import { logOut } from "./api.js";
import { renderLogin } from "./renderLogIn.js";
import { renderFeedback } from "./renderFeedback.js";
import { renderOptions } from "./renderOptions.js";

import { setMessage } from "./util/setMessage.js";

export function activateMenu() {
    activateButton("feedback-menu-button");
    activateButton("options-menu-button");
    activateButton("log out-menu-button");

    getConvosButton().addEventListener("click", () => {
        setMessage("feature coming soon!");
    });

    getHamburger().addEventListener("click", () => {
        toggleMenu();
    });
}

export function hideLoggedInMenuOptions() {
    document.getElementById("options-menu-button").classList.add("hidden");
    document.getElementById("log out-menu-button").classList.add("hidden");
    getConvosButton().classList.add("hidden");
}

export function showLoggedInMenuOptions() {
    document.getElementById("options-menu-button").classList.remove("hidden");
    document.getElementById("log out-menu-button").classList.remove("hidden");
    getConvosButton().classList.remove("hidden");
}

function activateButton(buttonId) {
    // document.getElementById(buttonId).addEventListener("click", getActionForButton(buttonId));
    document.getElementById(buttonId).addEventListener("click", () => {
        getActionForButton(buttonId)();
        toggleMenu();
    });
}

function toggleMenu() {
    if (getMenu().classList.contains("hidden")) {
        getMenu().classList.remove("hidden");
    } else {
        getMenu().classList.add("hidden");
    }
}

function getHamburger() {
    return document.getElementById("hamburger");
}

function getConvosButton() {
    return document.getElementById("convos-button");
}

function getMenu() {
    return document.getElementById("drop-menu");
}

function getActionForButton(buttonId) {
    if (buttonId === "feedback-menu-button") {
        return () => {
            renderFeedback();
        }
    }
    if (buttonId === "options-menu-button") {
        return () => {
            renderOptions();
        }
    }
    if (buttonId === "log out-menu-button") {
        return () => {
            const username = document.creds.username;
            const token = document.creds.token;
            setLoginCreds(null, null, null).then(() => {
                logOut(username, token);
            });
            hideLoggedInMenuOptions();
            renderLogin();
        }
    }
    return () => {
        setMessage("coming soon!");
    }
}