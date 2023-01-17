import { renderPosts } from "./javascripts/renderPosts.js";
import { renderLogin } from "./javascripts/renderLogIn.js";
import { renderCreatePost } from "./javascripts/renderCreatePost.js";
import { checkLogin } from "./javascripts/api.js";
import { activateMenu, showLoggedInMenuOptions, hideLoggedInMenuOptions } from "./javascripts/renderMenu.js";

import { setMessage, setError } from "./javascripts/util/setMessage.js";


// TESTING ONLY
// chrome.storage.local.get("graffitiCache", function(res){
//     console.log(res.graffitiCache);
//     // chrome.storage.local.remove("graffitiCache");
    

//     // chrome.storage.local.set({ "graffitiCache": [1, 2, 3] }, function(){
//     //     setMessage("poop");
//     // });
// });
// END TESTING

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
                                        document.creds = { username: username, token: token, avatar: avatar };
                                        resolve({ username: username, token: token, avatar: avatar });
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