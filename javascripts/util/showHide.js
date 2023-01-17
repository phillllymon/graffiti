export function show(eleId) {
    document.getElementById(eleId).classList.remove("hidden");
}

export function hide(eleId) {
    //cloning node to get rid of any event listeners
    const ele = document.getElementById(eleId);
    ele.replaceWith(ele.cloneNode(true));

    document.getElementById(eleId).classList.add("hidden");
}