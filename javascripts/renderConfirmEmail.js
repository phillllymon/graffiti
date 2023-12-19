import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { renderLogin } from "./renderLogIn.js";
import { makeElement } from "./util/makeElement.js";
import { renderCreatePost } from "./renderCreatePost.js";
import { showLoggedInMenuOptions } from "./renderMenu.js";
import { confirmEmail, resendEmail } from "./api.js";
import { startLoading, stopLoading } from "./util/startStopLoading.js";
import { setLoginCreds } from "./credentials.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export function renderConfirmEmail(username) {

    hideAllSections();
    hide("posts-container");
    show("confirm-area");
    show("confirm-button");
    show("cancel-button");

    activateConfirmButton(username);
    activateResendButton(username);
    activateCancelButton();
}

function activateConfirmButton(username) {
    document.getElementById("confirm-button").addEventListener("click", () => {
        const confirmCode = document.getElementById("confirm-code").value;
        confirmEmail(username, confirmCode).then((res) => {
            if (res.status === "success") {
                setMessage("welcome!");
                setLoginCreds(username, res.token, res.avatar).then(() => {
                    showLoggedInMenuOptions();
                    show("posts-container");
                    renderCreatePost();
                });
            } else {
                setError("incorrect code");
            }
        });
    });
}

function activateResendButton(username) {
    document.getElementById("resend-button").addEventListener("click", () => {
        resendEmail(username).then((res) => {
            if (res.status === "success") {
                console.log(res);
                setMessage("New email sent");
            } else {
                setError(cleanErrorMessage(res.message));
            }
            
        })
    });
}

function activateCancelButton() {
    document.getElementById("cancel-button").addEventListener("click", () => {
        renderLogin();
    });
}

function cleanErrorMessage(message) {
    if (message.startsWith("ERROR ")) {
        return message.slice(6);
    } else {
        return message;
    }
}