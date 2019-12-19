

function addFriend() { // Adds user to friend list.
    let obj = new Object();
    obj.id = $("#profile-id").val();
    $.ajax({
        type: "POST",
        url: "/Api/AddFriend", 
        data: obj,
        timeout: 7000,
        success: function() {
            isFriend(obj.id);
        },
        error: function(jqXHR, textStatus) {
            $("#no-connection").show();
            setTimeout(addFriend, 5000);
        }
    });
}

function prepareMessage() {
    clearInterval(sendMessage);
    let obj = new Object();
    if ($("#chat-page").is(":visible")) {
        obj.id = $("#chat-id").val();
        obj.content = $("#message-input-chat").text();
        obj.content = obj.content.trim();
        if ($("#message-input-chat").find("img").length) {
            $(".message-input-chat").height(30);
            $("#chat-image").css("z-index", "-1000");
            uploadImage(obj);
        } else {
            $(".message-input-chat").height(30);
            if (obj.content.length != 0) {
                sendMessage(obj);
            }
        }
    }
    if ($("#profile-page").is(":visible")) {
        obj.id = $("#profile-id").val();
        obj.content = $("#message-input-profile").val();
        if (obj.content.length != 0) {
            sendMessage(obj);
        }
    }
}

function sendMessage(obj) {
    $("#send-button").off();
    $.ajax({
        type: "POST",
        url: "/Api/SendMessage", 
        data: obj,
        timeout: 5000,
        success: function(response, jqXHR) {
            $("#no-connection-chat").hide();
            if ($("#profile-page").is(":visible")) {
                $("#no-connection-profile").hide();
                $("#message-input-profile").val("");
                $("#newMessageModal").modal("hide");
            }
            if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                $("#no-connection-chat").hide();
                $("#message-input-chat").empty();
                getChat(obj.id, 2);
            }
            if (response == 1) {
                let responseTime = Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;
                setTimeout(function() {
                    sendResponse(obj.id);
                }, responseTime)
            } 
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status == 0) {
                if ($("#chat-page").is(":visible")) {
                    $("#no-connection-chat").show();
                    clearInterval(sendMessage);
                    setTimeout(sendMessage, 5000);
                }
                if ($("#profile-page").is(":visible")) {
                    $("#no-connection-profile").show();
                    clearInterval(sendMessage);
                    setTimeout(sendMessage,5000);
                }
            } else {
                if ($("#chat-page").is(":visible")) {
                    $("#no-connection-chat").show();
                    clearInterval(sendMessage);
                    sendMessage();
                }
                if ($("#profile-page").is(":visible")) {
                    $("#no-connection-profile").show();
                    clearInterval(sendMessage);
                    sendMessage();
                }
            }
        }
    });
}

function sendResponse(id) {
    let obj = new Object();
    obj.id = id; 
    $.ajax({
        type: "POST",
        url: "/Api/SendResponse", 
        data: obj,
        success: function() {
            if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                let id = $("#chat-id").val();
                getChat(id, 2);
            }
        }
    });
}

function uploadImage(obj) {
    let imgObj = new FormData();
    imgObj.append("image", $("#img-input-chat")[0].files[0]);
    $("#img-input-chat").empty();
    $.ajax({
        type: "POST",
        url: "/Api/UploadImage", 
        enctype: 'multipart/form-data',
        data: imgObj,
        processData: false,  
        contentType: false, 
        success: function(response) {
            obj.PicturePath = response;
            sendMessage(obj);
        },
        error: function(jqXHR, textStatus) {
            //
        }
    });
}

function logOut() {
    $.ajax({
        type: "POST",
        url: "/Api/Logout", 
        success: function() {
            $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
            $("#fa-home").addClass("active");
            $("#home-page").empty();
            $("#home-page").show().siblings().hide();
            location.reload();
        },
        error: function(jqXHR, textStatus) {
            //
        }
    });
}