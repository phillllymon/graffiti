export function setMessage(message) {
    document.getElementById("message-content").innerText = message;
    document.getElementById("message").classList.remove("hidden");
    document.getElementById("dismiss-message").addEventListener("click", () => {
        document.getElementById("message").classList.add("hidden");
    });
}

export function setError(message) {
    document.getElementById("error-content").innerText = message;
    document.getElementById("error").classList.remove("hidden");
    document.getElementById("dismiss-error").addEventListener("click", () => {
        document.getElementById("error").classList.add("hidden");
    });
}

export function clearError() {
    document.getElementById("error").classList.add("hidden");
}