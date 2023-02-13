import { logIn } from "./api.js";
import { hideAllSections } from "./util/hideAllSections.js";
import { show } from "./util/showHide.js";
import { setLoginCreds } from "./credentials.js";
import { renderCreatePost } from "./renderCreatePost.js";
import { renderCreateAccount } from "./renderCreateAccount.js";
import { renderResetPassword } from "./renderResetPassword.js";
import { showLoggedInMenuOptions } from "./renderMenu.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export function renderLogin() {
    document.getElementById("posts-container").style.maxHeight = "378px";
    hideAllSections();
    show("login-area");
    show("login-button");
    show("signup-button");
    
    activateForgotButton();
    activateLoginButton();

    document.getElementById("signup-button").addEventListener("click", () => {
        renderCreateAccount();
    });
}

function activateForgotButton() {
    document.getElementById("forgot-button").addEventListener("click", () => {
        renderResetPassword();
    });
}

function activateLoginButton() {
    document.getElementById("login-button").addEventListener("click", () => {
        const username = document.getElementById("login-username-box").value;
        const pass = document.getElementById("login-pass-box").value;
        logIn(username, pass).then((res) => {
            
            if (res.status === "success") {
                clearError();
                
                //clear password field for security
                document.getElementById("login-pass-box").value = "";
                setLoginCreds(username, res.token, res.avatar, res.numUnreads).then(() => {
                    
                    renderCreatePost();
                    showLoggedInMenuOptions();
                });
            } else {
                setError(cleanErrorMessage(res.message));
            }
        });
    });
}

function cleanErrorMessage(message) {
    if (message.startsWith("ERROR ")) {
        return message.slice(6);
    } else {
        return message;
    }
}