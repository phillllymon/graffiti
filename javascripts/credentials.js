export function setLoginCreds(username, token, avatar, numUnreads) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ "graffitiToken": token }, function(){
            chrome.storage.local.set({ "graffitiUsername": username }, function(){
                chrome.storage.local.set({ "graffitiAvatar": avatar }, function(){
                    document.creds = { username: username, token: token, avatar: avatar, numUnreads: numUnreads };
                    resolve(document.creds);
                });
            });
        });
    });
}