import { makeElement } from "./makeElement.js";

const DAYS_IN_MONTH = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
}

export function constructPost(postObject, avatars) {

    const usernameEle = makeElement("post-username");
    usernameEle.innerHTML = postObject.username;
    
    const timestampEle = makeElement("post-timestamp");
    timestampEle.innerHTML = formatDate(postObject.created);
    // timestampEle.innerHTML = postObject.created;

    const postInfo = makeElement("post-info");
    postInfo.appendChild(usernameEle);
    postInfo.appendChild(timestampEle);

    const postContent = makeElement("post-content");
    postContent.innerHTML = postObject.content;

    const rightSide = makeElement("post-right");
    rightSide.appendChild(postInfo);
    rightSide.appendChild(postContent);    

    const avatar = makeElement("avatar");

    avatar.innerHTML = "&#128100;";
    avatar.innerHTML = avatars[postObject.username];
    
    const post = makeElement("post-container");
    post.appendChild(avatar);
    post.appendChild(rightSide);

    return post;
}

function formatDate(timestamp) {
    const { year, month, day, hours, minutes } = localizeTime(parseTimestamp(timestamp));

    const thisDate = new Date();
    const thisYear = thisDate.getFullYear();
    const thisMonth = thisDate.getMonth() + 1;
    const thisDay = thisDate.getDate();
    const { hoursToShow, amOrPm } = demilitarize(hours);
    const minutesToShow = minutes < 10 ? `0${minutes}` : minutes;


    if (thisYear === year) {
        if (thisMonth === month) {
            if (thisDay === day) {
                return `today at ${hoursToShow}:${minutesToShow} ${amOrPm}`;
            }
        }
    }
    return `${month}/${day}/${year} at ${hoursToShow}:${minutesToShow} ${amOrPm}`;
    
}

function demilitarize(hours) {
    let hoursToShow = hours;
    let amOrPm = "am";
    if (hoursToShow > 12) {
        hoursToShow -= 12;
        amOrPm = "pm";
    }
    if (hoursToShow === 0) {
        hoursToShow = 12;
    }
    return { hoursToShow, amOrPm };
}

function parseTimestamp(timestamp) {
    const pieces = timestamp.split(" ");
    const datePieces = pieces[0].split("-");
    const year = parseInt(datePieces[0]);
    const month = parseInt(datePieces[1]);
    const day = parseInt(datePieces[2]);
    const timePieces = pieces[1].split(":");
    const hours = parseInt(timePieces[0]);
    const minutes = parseInt(timePieces[1]);
    return { year, month, day, hours, minutes };
}

function localizeTime({ year, month, day, hours, minutes }) {
    const dateObject = new Date();
    const offsetHours = Math.floor(dateObject.getTimezoneOffset() / 60);
    let newHours = hours - offsetHours;
    let newDay = day;
    let newMonth = month;
    let newYear = year;
    if (newHours < 0) {
        newHours = 24 + newHours;
        newDay -= 1;
    }
    if (newDay < 1) {
        newMonth -= 1;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        newDay = getLastDayOfMonth(newMonth, newYear);
    }
    return { 
        year: newYear,
        month: newMonth,
        day: newDay,
        hours: newHours,
        minutes: minutes
    };
}

function getLastDayOfMonth(month, year) {
    let answer = DAYS_IN_MONTH[month];
    if (month === 1 && (year%4 === 0)) {
        answer += 1;
    }
    return answer;
}