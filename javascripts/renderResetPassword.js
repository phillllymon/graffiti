import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { showLoginOrNewPost } from "../popup.js";
import { resetPassword } from "./api.js";
import { startLoading, stopLoading } from "./util/startStopLoading.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export function renderResetPassword() {
    hideAllSections();
    hide("posts-container");
    show("forgot-area");
    show("recover-button");
    show("cancel-button");

    activateRecoverButton();
    activateCancelButton();
}

function activateRecoverButton() {
    document.getElementById("recover-button").addEventListener("click", () => {
        const email = document.getElementById("recover-email").value;
        if (validEmail(email)) {
            clearError();
            const loading = startLoading();
            resetPassword(email).then((res) => {
                document.getElementById("recover-email").value = "";
                stopLoading(loading);
                if (res.status === "success") {
                    setMessage("reset email sent");
                } else {
                    setError(res.message);
                }
            });
        } else {
            setError("email invalid");
        }
    });
}

function activateCancelButton() {
    document.getElementById("cancel-button").addEventListener("click", () => {
        show("posts-container");
        showLoginOrNewPost();
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