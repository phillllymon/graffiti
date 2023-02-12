import { hideAllSections } from "./util/hideAllSections.js";
import { show, hide } from "./util/showHide.js";
import { makeElement } from "./util/makeElement.js";
import { showLoginOrNewPost } from "../popup.js";
import { avatars } from "./renderCreateAccount.js";
import { getConversations } from "./api.js";
import { setLoginCreds } from "./credentials.js";
import { renderLogin } from "./renderLogIn.js";
import { hideLoggedInMenuOptions } from "./renderMenu.js";

import { setMessage, setError, clearError } from "./util/setMessage.js";

export function renderConversations() {
    hideAllSections();
    hide("posts-container");
    show("history-area");

    activateBackButton();
    populateConversations();
}

function populateConversations() {
    const convoSection = document.getElementById("convos");
    const username = document.creds.username;
    const token = document.creds.token;
    getConversations(username, token).then((res) => {
        const info = res.info;
        res.conversations.forEach((convo) => {
            convoSection.prepend(buildConvoLink(convo, info));
        });

        if (res.conversations.length == 0) {
            convoSection.innerHTML = '<div class="no-posts"><center>- no conversations -</center></div>';
        }
        updateUnreadsDot(res.conversations);
    });
}

function buildConvoLink(convo, info) {
    
    const url = convo[0];
    const pretty = info[url].pretty;
    
    const link = makeElement("convo-link", "a");
    link.setAttribute("href", url);
    link.setAttribute("target", "false");
    if (!convo[1]) {
        link.classList.add("unread");
    }
    const icon = makeElement("convo-icon");
    const pic = info[url].icon;
    if (pic) {
        icon.innerHTML = `<img src="https://www.graffiti.red/API/icons/${pic}" width="26px">`;
    } else {
        icon.innerHTML = `<img src="../icons/gray.png" width="16px">`;
    }
    
    link.appendChild(icon);
    const linkText = makeElement("convo-link-text");
    linkText.innerText = pretty;
    link.appendChild(linkText);
    
    const unfollowButton = makeElement("small-text");
    unfollowButton.innerText = "unfollow";

    const linkContainer = makeElement("convo-link-container");
    linkContainer.appendChild(link);
    linkContainer.appendChild(unfollowButton);

    unfollowButton.addEventListener("click", () => {
        setMessage("feature coming soon");
    });

    return linkContainer;
}

function updateUnreadsDot(convos) {
    let numUnreads = 0;
    convos.forEach((convo) => {
        if (!convo[1]) {
            numUnreads++;
        }
    });
    document.creds.numUnreads = numUnreads;
    if (numUnreads > 0) {
        document.getElementById("unreads-dot").innerText = numUnreads;
    } else {
        document.getElementById("unreads-dot").classList.add("hidden");
    }
}

function activateBackButton() {
    document.getElementById("exit-history-button").addEventListener("click", () => {
        document.getElementById("convos").innerHTML = "";
        show("posts-container");
        showLoginOrNewPost();
    });
}