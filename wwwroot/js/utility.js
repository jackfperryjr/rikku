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

function clearUtility() {
    $("#newMessageModal").modal("hide");
    clearInterval(getMailbox);
    clearInterval(getChat);
    clearInterval(getProfile);
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

function addImage(e) {
    $("#chat-image").remove();
    let imgPath = URL.createObjectURL(e.target.files[0]);
    let img = '<form id="chat-image" enctype="multipart/form-data" method="post" name="form"><img id="img-output-chat" style="margin:5px 5px 10px 5px;height:100px;width:auto;display:block;" src='+imgPath+'></form>';
    $("#message-input-chat").prepend(img);
    $("#message-input-chat").append("").focus();
}