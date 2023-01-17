export function setLoginCreds(username, token, avatar) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ "graffitiToken": token }, function(){
            chrome.storage.local.set({ "graffitiUsername": username }, function(){
                chrome.storage.local.set({ "graffitiAvatar": avatar }, function(){
                    document.creds = { username: username, token: token, avatar: avatar };
                    resolve(document.creds);
                });
            });
        });
    });
}