import { renderPosts } from "./javascripts/renderPosts.js";
import { renderLogin } from "./javascripts/renderLogIn.js";
import { renderCreatePost } from "./javascripts/renderCreatePost.js";
import { checkLogin } from "./javascripts/api.js";
import { activateMenu, showLoggedInMenuOptions, hideLoggedInMenuOptions } from "./javascripts/renderMenu.js";

import { setMessage, setError } from "./javascripts/util/setMessage.js";


renderPosts();
activateMenu();
showLoginOrNewPost();

export function showLoginOrNewPost() {
    checkForLogin().then((res) => {
        if (!res) {
            hideLoggedInMenuOptions();
            renderLogin();
        } else {
            showLoggedInMenuOptions();
            renderCreatePost();
        }
    });
}

// shows popup if GRAFFITI isn't pinned on Chrome
chrome.action.getUserSettings().then((res) => {
    if (!res.isOnToolbar) {
        chrome.storage.local.get("graffitiNoPinAlert", function(res){
            const noAlert = res.graffitiNoPinAlert;
            if (!noAlert) {
                document.getElementById("pin-alert").classList.remove("hidden");
                document.getElementById("dismiss-alert").addEventListener("click", () => {
                    document.getElementById("pin-alert").classList.add("hidden");
                });
                document.getElementById("kill-alert").addEventListener("click", () => {
                    document.getElementById("pin-alert").classList.add("hidden");
                    chrome.storage.local.set({ "graffitiNoPinAlert": true });
                });
            }
        });
    }
});

// resolves to creds if user is already logged in
export function checkForLogin() {
    return new Promise((resolve) => {
        chrome.storage.local.get("graffitiToken", function(res){
            const token = res.graffitiToken;
            if (token && token.length > 0) {
                chrome.storage.local.get("graffitiUsername", function(res){
                    const username = res.graffitiUsername;
                    if (username && username.length > 0) {
                        chrome.storage.local.get("graffitiAvatar", function(res){
                            const avatar = res.graffitiAvatar;
                            if (avatar && avatar.length > 0) {
                                checkLogin(username, token).then((res) => {
                                    if (res.answer == true) {
                                        document.creds = { username: username, token: token, avatar: avatar, numUnreads: res.numUnreads };
                                        resolve({ username: username, token: token, avatar: avatar, numUnreads: res.numUnreads });
                                    } else {
                                        resolve(false);
                                    }
                                });
                            } else {
                                resolve(false);
                            }                            
                        });                        
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    });
}