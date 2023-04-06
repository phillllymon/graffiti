export function removeUnrecognizedHTML(content) {
    // const temp = document.createElement("div");
    // temp.innerHTML = content;
    // return parseFromString(temp.innerText, "text/html");

    return new DOMParser().parseFromString(content, "text/html").documentElement.textContent;
}