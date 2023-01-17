import { getPosts } from "./api.js";
import { constructPost } from "./util/constructPost.js";
import { makeElement } from "./util/makeElement.js";

const POST_LIMIT = 15;

export function renderPosts() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const url = tabs[0].url;
        getPosts(url, POST_LIMIT).then((res) => {
            if (res.status === "success") {
                if (res.posts.length > 0) {
                    const postsContainer = document.getElementById("posts-container");
                    postsContainer.innerText = "";
                    for (let i = 0; i < res.posts.length; i++) { // reverse order && css re-reverses them
                        const thisPostObject = res.posts[i];
                        postsContainer.appendChild(constructPost(thisPostObject, res.avatars));
                    }
                    document.numPosts = res.posts.length;
                    if (res.posts.length === POST_LIMIT) {
                        renderMorePostsButton(url);
                    }
                }
            }
            
        });
    });
}

function addOlderPosts(posts, avatars) {
    const postsContainer = document.getElementById("posts-container");
    for (let i = 0; i < posts.length; i++) {
        const thisPostObject = posts[i];
        postsContainer.appendChild(constructPost(thisPostObject, avatars));
    }
}

function renderMorePostsButton(url) {
    const morePostsButton = makeElement("small-text");
    morePostsButton.innerHTML = "<center>load more<center>";
    document.getElementById("posts-container").appendChild(morePostsButton);
    morePostsButton.addEventListener("click", () => {
        morePostsButton.remove();
        const numCurrentPosts = document.getElementById("posts-container").childNodes.length;
        getPosts(url, POST_LIMIT, numCurrentPosts).then((res) => {
            if (res.status === "success") {
                addOlderPosts(res.posts, res.avatars);
                if (res.posts.length === POST_LIMIT) {
                    renderMorePostsButton(url);
                }
            }
        });
    });
}

// export function renderPosts() {
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//         const url = tabs[0].url;
//         getPosts(url).then((res) => {
//             if (res.status === "success" && res.posts.length > 0) {
//                 const postsContainer = document.getElementById("posts-container");
//                 postsContainer.innerHTML = "";
//                 // for (let i = res.posts.length - 1; i > -1; i--) {
//                 for (let i = 0; i < res.posts.length; i++) { // reverse order && css re-reverses them
//                     const thisPostObject = res.posts[i];
//                     postsContainer.appendChild(constructPost(thisPostObject, res.avatars));
//                 }
//                 document.numPosts = res.posts.length;
//             }
//         });
//     });
// }