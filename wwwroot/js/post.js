

function addFriend() { // Adds user to friend list.
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax({
        type: "POST",
        url: "/Api/AddFriend", 
        data: obj,
        success: function() {
            isFriend();
        }
    });
}

function sendMessage() {
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    obj.content = $("#message-input").val();
    $("#message-input").val("");
    $(".message-input-chat").height(30);
    if (obj.content.length != 0) {
        $.ajax({
            type: "POST",
            url: "/Api/SendMessage", 
            data: obj,
            success: function(response) {
                if (window.location.href.indexOf("profile") > -1) {
                    $("#newMessageModal").modal("hide");
                }
                if (window.location.href.indexOf("chat") > -1) { // If in the chat, get the new messages.
                    getChat(2);
                }
                if (response == 1) {
                    let responseTime = Math.floor(Math.random() * (120000 - 3000 + 1)) + 3000;
                    setTimeout(function() {
                        sendResponse(obj.id);
                    }, responseTime)
                    localStorage.responseTime = responseTime;
                    localStorage.id = id;
                    localStorage.sendResponse = "setTimeout(function() {sendResponse(localStorage.id);}, localStorage.responseTime)";
                }
            }
        });
    }
}

function sendResponse(id) {
    let obj = new Object();
    obj.id = id; 
    $.ajax({
        type: "POST",
        url: "/Api/SendResponse", 
        data: obj,
        success: function() {
            localStorage.removeItem("id");
            localStorage.removeItem("sendResponse");
            localStorage.removeItem("responseTime");
            if (window.location.href.indexOf("chat") > -1) { // If in the chat, get the new messages.
                getChat(2);
            }
        }
    });
}