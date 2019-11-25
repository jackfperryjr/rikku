let noconnection = '<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i><p id="no-connection" style="display:none;position:fixed;top:45%;left:27%;right:27%;font-size:10px;color:#00b0ff;">Check your connection. Retrying...</p>';

$("#img-input-user").change(function(event) { // Drops in a preview of user image before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-user").fadeIn("fast").attr('src',imgPath); 
}); 
$("#img-input-wallpaper").change(function(event) { // Drops in a preview of user wallpaper before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-wallpaper").fadeIn("fast").attr('src',imgPath); 
}); 

function setGoBack(x, id) {
    if (x == 1) {
        $("#nav-back-btn").off("click").click(function(){
            getUsers();
        });
    } 
    if (x == 2) {
        $("#nav-back-btn").off("click").click(function(){
            getChat(id);
        });
    }
    if (x == 3) {
        $("#nav-back-btn").off("click").click(function(){
            getFriends();
        });
    }
}

function getHome() {
    location ="../../";
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users, #fa-info").removeClass("active");
    $("#fa-home").addClass("active");
    $("#home-page").show().siblings().hide();
}

function getInfo() {
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users, #fa-info").removeClass("active");
    $("#fa-info").addClass("active");
    $("#about-page").show().siblings().hide();
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