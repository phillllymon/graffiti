const grayIconPath = "./icons/grayG.png";
const orangeIconPath = "./icons/orangeG.png";

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setIcon({ path: grayIconPath });
});

chrome.tabs.onUpdated.addListener(() => {
    handleUrlChange();
});

chrome.tabs.onActivated.addListener(() => {
    handleUrlChange();
});

// cache for as long as browser is open
let urlsWithPosts = [];
let urlsWithoutPosts = [];
const MAX_ENTRIES = 100;

function handleUrlChange() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const url = tabs[0].url;
        checkForPosts(url).then((urlHasPosts) => {
            if (urlHasPosts) {
                chrome.action.setIcon({ path: orangeIconPath });
            } else {
                chrome.action.setIcon({ path: grayIconPath });
            }
        });
    });
}

function checkForPosts(url) {
    return new Promise((resolve) => {
        if (urlsWithPosts.includes(url)) {
            resolve(true);
        } else if (urlsWithoutPosts.includes(url)){
            if (Math.random() < 0.7) { // ~1/3 times check again to see if any posts in the meantime
                resolve(false);
            } else {
                const idx = urlsWithoutPosts.indexOf(url);
                urlsWithoutPosts = urlsWithoutPosts.slice(0, idx).concat(urlsWithoutPosts.slice(idx + 1));

                // TODO: optimize this as it's repeated below
                queryAPI(url).then((res) => {
                    if (res) {
                        urlsWithPosts.push(url);
                        if (urlsWithPosts.length > MAX_ENTRIES) {
                            urlsWithPosts = [];
                        }
                        resolve(true);
                    } else {
                        urlsWithoutPosts.push(url);
                        resolve(false);
                    }
                });
            }
        } else {
            queryAPI(url).then((res) => {
                if (res) {
                    urlsWithPosts.push(url);
                    if (urlsWithPosts.length > MAX_ENTRIES) {
                        urlsWithPosts = [];
                    }
                    resolve(true);
                } else {
                    urlsWithoutPosts.push(url);
                    resolve(false);
                }
            });
        }
    });
}

function queryAPI(url) {
    return new Promise((resolve) => {
        fetch("https://graffiti.red/API/", {
            method: "POST",
            body: JSON.stringify({
                action: "checkForPosts",
                url: url
            })
        }).then((res) => {
            res.json().then((response) => {
                if (response.answer) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    });
}