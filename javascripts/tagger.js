import { doesUserExist } from "./api.js";
import { makeElement } from "./util/makeElement.js";
import { setMessage } from "./util/setMessage.js";

export function enableTagger() {
    const postBox = document.getElementById("new-post");
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

                //don't query on every keystroke; wait for a pause
                setTimeout(() => {
                    if (nameIsStillValue(possibleName)) {
                        doesUserExist(possibleName).then((res) => {
                            if (res.status === "success") {
                                if (res.exists && nameIsStillValue(possibleName)) {
                                    enableTagSelection();
                                }
                            }
                        });
                    }
                }, 500);
            } else {
                disableTagSelection();
                clearTagPreview();
            }
        }
        
    });
}

function selectName() {
    const postBox = document.getElementById("new-post");
    const entireContents = postBox.innerHTML;
    const words = entireContents.split(" ");
    const name = words[words.length - 1].slice(1);
    const tagSpelledOut = ` <span class="tag">${name}</span>&nbsp;&nbsp;`;
    postBox.innerHTML = words.slice(0, words.length - 1).join(" ") + tagSpelledOut;

    disableTagSelection();
    clearTagPreview();
}

function enableTagSelection() {
    const previewBox = document.getElementById("tag-preview");
    previewBox.classList.remove("faint");
    // TODO: also trigger this by pressing ENTER
    previewBox.addEventListener("click", () => {
        selectName();
    });
    const tagButton = document.getElementById("tag-button");
    tagButton.classList.remove("hidden");
    tagButton.tabIndex = 0;
    tagButton.focus();
    tagButton.addEventListener("click", () => {
        selectName();
    });
    tagButton.addEventListener("keydown", (e) => {
        e.preventDefault();
        const inputBox = document.getElementById("new-post");
        if (e.key === "Enter") {
            selectName();
            inputBox.focus();
            setCursorToEndOfInput();
        }
        if (e.code === "Space") {
            selectName();
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