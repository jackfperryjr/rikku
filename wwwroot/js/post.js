

function addFriend() { // Adds user to friend list.
    let obj = new Object();
    obj.id = $("#profile-id").val();
    $.ajax({
        type: "POST",
        url: "/Api/AddFriend", 
        data: obj,
        timeout: 7000,
        success: function() {
            isFriend();
        },
        error: function(jqXHR, textStatus) {
            $("#no-connection").show();
            setTimeout(addFriend, 5000);
        }
    });
}

function sendMessage(id, content) {
    let obj = new Object();
    if (id) {
        obj.id = id;
    }
    if (!id && $("#chat-page").is(":visible")) {
        obj.id = $("#chat-id").val();
    }
    if (!id && $("#profile-page").is(":visible")) {
        obj.id = $("#profile-id").val();
    }
    if (content) {
        obj.content = content;
    } else {
        obj.content = $("#message-input").val();
    }
    $("#message-input").val("");
    $(".message-input-chat").height(30);
    if (obj.content.length != 0) {
        $.ajax({
            type: "POST",
            url: "/Api/SendMessage", 
            data: obj,
            timeout: 7000,
            success: function(response) {
                if ($("#profile-page").is(":visible")) {
                    $("#newMessageModal").modal("hide");
                }
                if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                    getChat(obj.id, 2);
                }
                if (response == 1) {
                    let responseTime = Math.floor(Math.random() * (120000 - 3000 + 1)) + 3000;
                    setTimeout(function() {
                        sendResponse(obj.id);
                    }, responseTime)
                    localStorage.sendResponseTime = responseTime;
                    localStorage.sendResponseId = obj.id;
                    localStorage.sendResponse = "setTimeout(function() { sendResponse(localStorage.sendResponseId) }, localStorage.sendResponseTime)";
                }
            },
            error: function(jqXHR, textStatus) {
                if ($("#chat-page").is(":visible")) {
                    $("#no-connection").show();
                    // localStorage.sendMessageTime = 100;
                    // localStorage.sendMessageId = obj.id;
                    // localStorage.sendMessageContent = obj.content;
                    // localStorage.sendMessage = "setTimeout(function() { sendMessage(localStorage.sendMessageId, localStorage.sendMessageContent) }, localStorage.sendMessageTime)";
                    setTimeout(sendMessage, 5000);
                }
                if ($("#profile-page").is(":visible")) {
                    $("#no-connection").show();
                    // localStorage.sendMessageTime = 100;
                    // localStorage.sendMessageId = obj.id;
                    // localStorage.sendMessageContent = obj.content;
                    // localStorage.sendMessage = "setTimeout(function() { sendMessage(localStorage.sendMessageId, localStorage.sendMessageContent) }, localStorage.sendMessageTime)";
                    setTimeout(function() { sendMessage(id) }, 5000);
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
            
            if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                let id = $("#chat-id").val();
                getChat(id, 2);
            }
        }
    });
}