
$("#img-input-user").change(function(event) { // Drops in a preview of user image before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-user").fadeIn("fast").attr('src',imgPath); 
}); 
$("#img-input-wallpaper").change(function(event) { // Drops in a preview of user wallpaper before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-wallpaper").fadeIn("fast").attr('src',imgPath); 
}); 

function getHome() {
    $("#home-page").show().siblings().hide();
}

function getInfo() {
    $("#about-page").show().siblings().hide();
}

function checkResponse() {
    if (localStorage.sendResponse) {
        eval(localStorage.sendResponse);
    }
}

function messageScroll() {
    $("#message-container").scrollTop($("#message-container")[0].scrollHeight);
}

function clear() {
    clearTimeout(getChat);
    clearTimeout(getMailbox);
    clearTimeout(getProfile);
    clearTimeout(getUsers);
    clearTimeout(getUser);
    clearTimeout(getFriends);
    clearTimeout();
}

function formatDate(d, x) {
    let date = new Date(d);
    date = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    let dayOfMonth = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let hh = hour;
    let dd = "am";

    if (hh >= 12) {
        hh = hour - 12;
        dd = "pm";
    }
    if (hh === 0) {
        hh = 12;
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;

    if (x) {
        year = year;
        dayOfMonth += 1;
    } else {
        year = year.toString().slice(-2);
    }
    month = month < 10 ? "0" + month : month;
    dayOfMonth = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;
  
    if (x) {
        return [year, month, dayOfMonth].join('-');
    } else {
        return `${month}.${dayOfMonth}.${year} ${hh}:${minutes}${dd}`;
    }
}