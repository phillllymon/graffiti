import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { submitFeedback } from "./api.js";
import { showLoginOrNewPost } from "../popup.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export function renderFeedback() {
    hideAllSections();
    hide("posts-container");
    show("feedback-area");
    show("submit-button");
    show("cancel-button");

    activateSubmitButton();
    activateCancelButton();
}

function activateSubmitButton() {
    document.getElementById("submit-button").addEventListener("click", () => {
        let username = "";
        if (document.creds && document.creds.username) {
            username = document.creds.username;
        }
        const email = document.getElementById("feedback-email").value;
        const feedback = document.getElementById("feedback").value;
        if (feedback.length > 4) {
            submitFeedback(username, email, feedback).then(() => {
                clearError();
                setMessage("thanks!");
                document.getElementById("feedback").value = "";
                show("posts-container");
                showLoginOrNewPost();
            }).catch(() => {
                setError("Could not submit");
            });
        } else {
            setError("message too short");
        }
    });
}

function activateCancelButton() {
    document.getElementById("cancel-button").addEventListener("click", () => {
        show("posts-container");
        showLoginOrNewPost();
    });
}