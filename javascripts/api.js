import { startLoading, stopLoading } from "./util/startStopLoading.js";

import { setMessage } from "./util/setMessage.js";

export function follow(username, token, url) {
    return makeCallToAPI("follow", {
        username: username,
        token: token,
        url: url
    });
}

export function unFollow(username, token, url) {
    return makeCallToAPI("unFollow", {
        username: username,
        token: token,
        url: url
    });
}

export function getConversations(username, token) {
    return makeCallToAPI("getConversations", {
        username: username,
        token: token
    });
}

export function notifyTaggedUsers(url, author, tags) {
    return makeCallToAPI("notifyTaggedUsers", {
        url: url,
        author: author,
        tags: tags
    }, false);
}

export function doesUserExist(username) {
    return makeCallToAPI("checkForUser", { username: username }, false);
}

export function deleteAccount(username, pass, token) {
    return makeCallToAPI("deleteAccount", {
        username: username,
        pass: pass,
        token: token
    });
}

export function changePassword(username, oldPass, token, newPass) {
    return makeCallToAPI("changePassword", {
        username: username,
        oldPass: oldPass,
        token: token,
        newPass: newPass
    });
}

export function changeAvatar(username, token, avatar) {
    return makeCallToAPI("changeAvatar", {
        username: username,
        token: token,
        avatar: avatar
    });
}

export function resetPassword(email) {
    return makeCallToAPI("resetPassword", { email: email });
}

export function submitFeedback(username, email, feedback) {
    return makeCallToAPI("giveFeedback", {
        username: username,
        email: email,
        feedback: feedback
    });
}

export function createUser(username, avatar, pass, email) {
    return makeCallToAPI("signUp", {
        username: username,
        avatar: avatar,
        pass: pass,
        email: email
    });
}

export function createPost(username, token, url, content) {
    return makeCallToAPI("createPost", {
        username: username,
        token: token,
        url: url,
        content: content
    });
}

export function checkLogin(username, token) {
    return makeCallToAPI("checkLogin", { username: username, token: token });
}

export function logOut(username, token) {
    return makeCallToAPI("logOut", { username: username, token: token }, false);
}

export function logIn(username, pass) {
    return makeCallToAPI("logIn", { username: username, pass: pass });
}

export function checkForPosts(url) {
    return makeCallToAPI("checkForPosts", { url: url }, false);
}

export function getPosts(url, limit=1000, skip=0) {
    return new Promise((resolve) => {
        chrome.storage.local.get("graffitiToken", function(res){
            const token = res.graffitiToken;
            if (token && token.length > 0) {
                chrome.storage.local.get("graffitiUsername", function(res){
                    const username = res.graffitiUsername;
                    if (username && username.length > 0) {
                        makeCallToAPI("getPosts", {
                            url: url,
                            limit: limit,
                            skip: skip,
                            username: username,
                            token: token
                        }, false).then((res) => {
                            resolve(res);
                        });             
                    } else {
                        makeCallToAPI("getPosts", { url: url, limit: limit, skip: skip }, false).then((res) => {
                            resolve(res);
                        });
                    }
                });
            } else {
                makeCallToAPI("getPosts", { url: url, limit: limit, skip: skip }, false).then((res) => {
                    resolve(res);
                });
            }
        });
    });
    
    // return makeCallToAPI("getPosts", { url: url, limit: limit, skip: skip }, false);
}

function makeCallToAPI(action, inputs, showLoading = true) {
    return new Promise((resolve) => {
        const loading = showLoading ? startLoading(500) : undefined;
        fetch("https://graffiti.red/API/", {
            method: "POST",
            body: JSON.stringify({
                action: action,
                ...inputs
            })
        }).then((res) => {
            res.json().then((response) => {
                stopLoading(loading);
                resolve(response);
            }).catch((err) => {
                stopLoading(loading);
                resolve({
                    status: "fail",
                    message: err.message
                });
            });
        }).catch((err) => {
            stopLoading(loading);
            resolve({
                status: "fail",
                message: err.message
            });
        });
    });
}