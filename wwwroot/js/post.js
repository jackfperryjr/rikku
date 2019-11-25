

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

function sendMessage() {
    clearTimeout(sendMessage);
    clearInterval(sendMessage);
    let obj = new Object();
    if ($("#chat-page").is(":visible")) {
        obj.id = $("#chat-id").val();
        obj.content = $("#message-input-chat").val();
    }
    if ($("#profile-page").is(":visible")) {
        obj.id = $("#profile-id").val();
        obj.content = $("#message-input-profile").val();
    }
    $(".message-input-chat").height(30);
    if (obj.content.length != 0) {
        $.ajax({
            type: "POST",
            url: "/Api/SendMessage", 
            data: obj,
            timeout: 7000,
            success: function(response, jqXHR) {
                clearTimeout(sendMessage);
                clearInterval(sendMessage);
                if ($("#profile-page").is(":visible")) {
                    $("#no-connection-profile").hide();
                    $("#message-input-profile").val("");
                    $("#newMessageModal").modal("hide");
                }
                if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                    $("#no-connection-chat").hide();
                    $("#message-input-chat").val("");
                    getChat(obj.id, 2);
                }
                if (response == 1) {
                    let responseTime = Math.floor(Math.random() * (60000 - 3000 + 1)) + 3000;
                    setTimeout(function() {
                        sendResponse(obj.id);
                    }, responseTime)
                } else {
                    jqXHR.abort();
                }
            },
            error: function(jqXHR, textStatus) {
                clearInterval(sendMessage);
                clearTimeout(sendMessage);

                if ($("#chat-page").is(":visible")) {
                    $("#no-connection-chat").show();
                    setTimeout(sendMessage, 5000);
                }
                if ($("#profile-page").is(":visible")) {
                    jqXHR.abort();
                    $("#no-connection-profile").show();
                    setTimeout(sendMessage, 5000);
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
            if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                let id = $("#chat-id").val();
                getChat(id, 2);
            }
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