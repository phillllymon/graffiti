export function startLoading(delay = 0) {

    let loadingInterval;
    const delayTimeout = setTimeout(() => {
        document.getElementById("loading-screen").classList.remove("hidden");
        document.getElementById("loading-0").classList.add("darkgray");
        let currentGray = 0;
        loadingInterval = setInterval(() => {
            document.getElementById(`loading-${currentGray}`).classList.remove("darkgray");
            currentGray = (currentGray + 1)%4;
            document.getElementById(`loading-${currentGray}`).classList.add("darkgray");
        }, 300);
    }, delay);

    return {
        delay: delayTimeout,
        interval: loadingInterval
    };
}

export function stopLoading(stuffToClear) {
    if (stuffToClear) {
        clearTimeout(stuffToClear.delay);
        clearInterval(stuffToClear.interval);
    }
    document.getElementById("loading-screen").classList.add("hidden");
}