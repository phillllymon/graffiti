export function makeElement(eleClass = "", eleType = "div") {
    const answer = document.createElement(eleType);
    answer.classList.add(eleClass);
    return answer;
}