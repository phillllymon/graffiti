import { hideAllSections } from "./util/hideAllSections.js";
import { show } from "./util/showHide.js";
import { createPost, notifyTaggedUsers } from "./api.js";
import { constructPost } from "./util/constructPost.js";
import { enableTagger } from "./tagger.js";
import { removeUnrecognizedHTML } from "./util/removeUnrecognizedHTML.js";

import { setMessage, setError } from "./util/setMessage.js";

export function renderCreatePost() {
    document.getElementById("posts-container").style.maxHeight = "405px";
    hideAllSections();
    show("create-post-area");
    show("post-button");
    document.getElementById("new-post-user").innerText = document.creds.username;
    document.getElementById("user-avatar").innerHTML = document.creds.avatar;
    
    document.getElementById("post-button").addEventListener("click", handleSubmit);

    showPlaceholder();
    enablePlaceholderToggle();
    enableEnterToPost();
    enablePastePlainText();
    enableTabToPostButton();
    enableTagger();
    enableResizing();
}

function enablePastePlainText() {
    const inputBox = document.getElementById("new-post");
    inputBox.addEventListener("paste", () => {
        
        setTimeout(() => {
            inputBox.innerHTML = removeUnrecognizedHTML(inputBox.innerHTML);
        }, 0);
    });
}

function enableEnterToPost() {
    document.getElementById("post-button").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    });
}

function enableTabToPostButton() {
    const inputBox = document.getElementById("new-post");
    inputBox.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const postButton = document.getElementById("post-button");
            postButton.tabIndex = 0;
            postButton.focus();
        }
    });
}

function enablePlaceholderToggle() {
    const inputBox = document.getElementById("new-post");
    inputBox.addEventListener("input", () => {
        if (inputBox.innerText.length > 0) {
            hidePlaceholder();
        } else {
            showPlaceholder();
        }
    });
}

function showPlaceholder() {
    const inputBox = document.getElementById("new-post");
    const placeholder = document.getElementById("post-placeholder");
    placeholder.setAttribute("top", inputBox.offsetTop);
    placeholder.setAttribute("left", inputBox.offsetLeft);
    placeholder.classList.remove("hidden");
    placeholder.addEventListener("click", () => {
        inputBox.focus();
    });
}

function hidePlaceholder() {
    document.getElementById("post-placeholder").classList.add("hidden");
}

function validateContentLength(content) {
    if (content.split(" ").join("").length < 3) {
        return false;
    }
    return true;
}

function handleSubmit() {
    const content = document.getElementById("new-post").innerHTML;
    const username = document.creds.username;
    const token = document.creds.token;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const url = tabs[0].url;
        if (!validateContentLength(content)) {
            setError("Cannot submit empty post!");
        } else {
            const tags = parseContentIntoTags(content);
            createPost(username, token, url, content, JSON.stringify(tags)).then((res) => {
                if (res.status == "success") {
                    const avatars = {};
                    avatars[document.creds.username] = document.creds.avatar ? document.creds.avatar : "&#128100;";
                    const newPost = constructPost(res.post, avatars);
                    const postsContainer = document.getElementById("posts-container");

                    if (document.numPosts == undefined || document.numPosts == 0) {
                        postsContainer.innerHTML = "";
                        document.numPosts = 1;
                    } else {
                        document.numPosts = document.numPosts + 1;
                    }
                    // notifyTaggedUsersIfNecessary(content, username, url);
                    document.getElementById("new-post").innerText = "";
                    postsContainer.prepend(newPost);
                    newPost.classList.add("grow");
                    chrome.action.setIcon({ path: "./icons/orange.png" });
                } else {
                    setError(res.message);
                }
            });
        }
    });
}

function parseContentIntoTags(content) {
    const tags = [];
    const possibles = content.split(`class="tag">`).slice(1);
    possibles.forEach((str) => {
        tags.push(str.split("</")[0]);
    });
    return tags;
}

function enableResizing() {
    const postArea = document.getElementById("create-post-area");
    const postBox = document.getElementById("new-post");
    const resizer = document.getElementById("resizer");
    moveResizerIntoCorner(postBox, resizer);
    document.resizing = false;
    resizer.addEventListener("mousedown", (e) => {
        document.dragOrigin = [e.clientX, e.clientY];
        document.resizing = true;
    });
    postArea.addEventListener("mousemove", (e) => {
        if (document.resizing) {
            const newPosition = [e.clientX, e.clientY];
            const xToAdd = newPosition[0] - document.dragOrigin[0];
            const yToAdd = newPosition[1] - document.dragOrigin[1];
            postBox.style.width = `${postBox.offsetWidth + xToAdd}px`;
            postBox.style.height = `${postBox.offsetHeight + yToAdd}px`;
            document.dragOrigin = [e.clientX, e.clientY];
            moveResizerIntoCorner(postBox, resizer);
        }
    });
    postArea.addEventListener("mouseup", () => {
        document.resizing = false;
    });
    postArea.addEventListener("mouseleave", () => {
        document.resizing = false;
    });
}

function moveResizerIntoCorner(postBox, resizer) {
    const rect = postBox.getBoundingClientRect();
    resizer.style.left = `${rect.right - 10}px`;
}

