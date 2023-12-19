import { doesUserExist } from "./api.js";
import { makeElement } from "./util/makeElement.js";
import { setMessage } from "./util/setMessage.js";

export function enableTagger() {
    const postBox = document.getElementById("new-post");
    let possiblePresents = collectNamesPresent();

    postBox.addEventListener("input", () => {
        const entireContents = postBox.innerHTML;
        
        if (!entireContents.endsWith("&nbsp;")) {
            const words = entireContents.split(" ");
            const lastWord = words[words.length - 1];
            if (lastWord[0] === "@") {
                setPreviewLoading();
                disableTagSelection();
                const possibleName = lastWord.slice(1);
                setTagPreview(possibleName);

                //narrow down possiblePresents
                possiblePresents = narrowDown(possibleName, possiblePresents);
                if (possiblePresents.length === 1) {
                    //might not have typed entire name - we want to show whole name in preview but keep type space unchanged
                    //if user keeps typing, disableTagSelection() and setTagPreview(possibleName) above should undo this (unless they keep typing the name)
                    setTagPreview(possiblePresents[0]);
                    enableTagSelection(possiblePresents[0]);
                }

                //don't query on every keystroke; wait for a pause
                setTimeout(() => {
                    if (nameIsStillValue(possibleName)) {
                        doesUserExist(possibleName).then((res) => {
                            if (res.status === "success") {
                                if (res.exists && nameIsStillValue(possibleName)) {
                                    enableTagSelection(res.username);
                                }
                            }
                        });
                    }
                }, 500);
            } else {
                disableTagSelection();
                clearTagPreview();
                possiblePresents = collectNamesPresent();
            }
        }
        
    });
}

function narrowDown(matcher, pool) {
    const answer = [];
    pool.forEach((possible) => {
        if (possible.startsWith(matcher)) {
            answer.push(possible);
        }
    });
    return answer;
}

function collectNamesPresent() {
    const nameClasses = [
        "tag",
        "post-username"
    ];
    const presentNames = [];
    nameClasses.forEach((nameClass) => {
        const eles = document.getElementsByClassName(nameClass);
        for (let i = 0; i < eles.length; i++) {
            const presentName = eles[i].innerText;
            if (!presentNames.includes(presentName)) {
                presentNames.push(presentName);
            }
        }
    });
    return presentNames;
}

function selectName(name) {
    const postBox = document.getElementById("new-post");
    const entireContents = postBox.innerHTML;
    const words = entireContents.split(" ");

    // const name = words[words.length - 1].slice(1);

    // const name = document.getElementById("tag-preview-content").innerText;

    const tagSpelledOut = ` <span class="tag">${name}</span>&nbsp;&nbsp;`;
    // const tagSpelledOut = ` <span class="tag">ffff</span>&nbsp;&nbsp;`;
    postBox.innerHTML = words.slice(0, words.length - 1).join(" ") + tagSpelledOut;

    disableTagSelection();
    clearTagPreview();
}

function enableTagSelection(name) { // passing name here because the search isn't case sensitive
    const previewBox = document.getElementById("tag-preview");
    previewBox.classList.remove("faint");
    previewBox.addEventListener("click", () => {
        selectName(name);
    });
    const tagButton = document.getElementById("tag-button");
    tagButton.classList.remove("hidden");
    tagButton.tabIndex = 0;
    tagButton.focus();
    tagButton.addEventListener("click", () => {
        selectName(name);
    });
    tagButton.addEventListener("keydown", (e) => {
        e.preventDefault();
        const inputBox = document.getElementById("new-post");
        if (e.key === "Enter") {
            selectName(name);
            inputBox.focus();
            setCursorToEndOfInput();
        }
        if (e.code === "Space") {
            selectName(name);
            inputBox.focus();
            setCursorToEndOfInput();
        }
        if (e.key === "Escape") {
            inputBox.focus();
            disableTagSelection();
            clearTagPreview();
        }
        if (e.key === "Backspace") {
            inputBox.focus();
            disableTagSelection();
            clearTagPreview();
        }
        if (e.key === "Tab") {
            inputBox.focus();
            disableTagSelection();
            clearTagPreview();
        }
    });
}

function disableTagSelection() {
    const previewBox = document.getElementById("tag-preview");
    previewBox.classList.add("faint");
    // cloning node to remove event listeners
    previewBox.replaceWith(previewBox.cloneNode(true));

    const tagButton = document.getElementById("tag-button");
    tagButton.classList.add("hidden");
    tagButton.replaceWith(tagButton.cloneNode(true));
}

function setTagPreview(str) {
    document.getElementById("tag-preview-content").innerText = str;
    document.getElementById("tag-preview").classList.remove("hidden");
}

function clearTagPreview() {
    document.getElementById("tag-preview-content").innerText = "";
    stopPreviewLoading();
    document.getElementById("tag-preview").classList.add("hidden");
}

function setPreviewLoading() {
    stopPreviewLoading();
    document.getElementById("tag-preview").classList.add("faint");
}

function stopPreviewLoading() {
    document.getElementById("tag-preview").classList.remove("faint");
}

function nameIsStillValue(str) {
    return document.getElementById("tag-preview-content").innerText === str;
}

function setCursorToEndOfInput() {
    const postBox = document.getElementById("new-post");
    const sel = window.getSelection();
    sel.selectAllChildren(postBox);
    sel.collapseToEnd();
}