$(document).ready(function() { // Activating icon related to navigated screen upon load.
    if (window.location.href.indexOf("Message") > -1) {
        $("#fa-comment").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#ffffff");
        getMessages();
        checkResponse();
    } else if (window.location.href.indexOf("Friends") > -1) {
        $("#fa-users").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#ffffff");
        getFriends();
        checkResponse();
    } else if (window.location.href.indexOf("Manage") > -1) {
        $("#fa-user").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#ffffff");
        checkResponse();
    } else if (window.location.href.indexOf("Admin") > -1) {
        $("#fa-users-cog").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#ffffff");
        checkResponse();
    } else if (window.location.href.indexOf("About") > -1) {
        $("#fa-info").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#ffffff");
        checkResponse();
    } else {
        $("#fa-home").addClass("active").siblings().removeClass("active");
        $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
        getUsers();
        checkResponse();
    }

    if (window.location.href.indexOf("Profile") > -1) {
        $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
        isFriend(); // Checking if a user if in friend list.
        checkResponse();
    }

    if (window.location.href.indexOf("Chat") > -1) { 
        $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
        getChat();
        $(".message-input-chat").focus(function() { // Hides navigation when text input is focused.
            $(".footer-nav").hide();
            $("#send-button").addClass("move-bottom");
            $(this).height((this.scrollHeight - 7) + "px");
        });
        $(".message-input-chat").blur(function() { // Shows navigation when text input is no longer focused.
            $(".footer-nav").show();
            $("#send-button").removeClass("move-bottom");
            $(this).height(30);
            $(".message-input-chat").scrollTop($(".message-input-chat")[0].scrollHeight);
        });
        // $(".message-input-chat").keyup(function(e) {
        //     if(e.keyCode == 13) {
        //         $(".message-input-chat").blur();
        //         sendMessage();
        //     }
        // });
        $("#send-button").mousedown(function(){
            sendMessage();
        });
    }

    $("#expand-menu").click(function(){
        if(!$("#fa-bar").hasClass("active")){
            $("#fa-bar").addClass("active").siblings().removeClass("active");
        } else {
            $("#fa-bar").removeClass("active");
        }
        $("#extra-nav").slideToggle(150);
    });

    (function mailChecker(){ // Self executing function that runs every 3 seconds.
        getMessageCount(); // Quick function to check for new messages.
        setTimeout(mailChecker, 3000)
    })();
});

$("#img-input-user").change(function(event) { // Drops in a preview of user image before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-user").fadeIn("fast").attr('src',imgPath); 
}); 
$("#img-input-wallpaper").change(function(event) { // Drops in a preview of user wallpaper before saving.
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-wallpaper").fadeIn("fast").attr('src',imgPath); 
}); 

function checkResponse() {
    if (localStorage.sendResponse) {
        eval(localStorage.sendResponse);
    }
}

function formatDate(d) {
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

    year = year.toString().slice(-2);
    month = month < 10 ? "0" + month : month;
    dayOfMonth = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;
  
    return `${month}.${dayOfMonth}.${year} ${hh}:${minutes}${dd}`
  }

/////////////////////////
//
//         GET
//
/////////////////////////

function getUsers() { // Gets list of all registered users.
    $.ajax({
        type: "GET",
        url: "/Api/GetUsers", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) { 
            let container = '';
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                container += '<div class="user-snippet-container">';
                container += '  <a href="/Home/Profile/'+response[i]["userId"]+'">';
                container += '    <div class="row user-snippet-row-main">';
                container += '      <div class="col-xs-5">';
                container += '        <img class="user-img-md" src="'+response[i]["picture"]+'">';
                container += '      </div>';
                container += '      <div class="col-xs-7">';
                container += '        <span style="font-size: 18px;">'+response[i]["userName"]+'</span> <br/>';
                container += '        <span style="font-size: 16px;">'+response[i]["city"]+', '+response[i]["state"]+'</span>';
                container += '        <span id="friend-heart" style="display:none;">';
                container += '          <i class="fas fa-heart text-danger"></i>';
                container += '        </span>';
                container += '      </div>';
                container += '    </div>';
                container += '    <div class="row user-snippet-row-secondary">';
                container += '      <span>'+response[i]["profile"]+'</span>';
                container += '    </div>';
                container += '  </a>';
                container += '</div>';
            }
            $("#home-index-container").html(container);
        }
    });
}

function getMessages() { // Gets list of messages from users.
    $.ajax({
        type: "GET",
        url: "/Api/GetMessages", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            let container = "";
            let color = "#000000!important";
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                if (response[i]["messageReadFlg"] == 0) { // Changes the background color for unread messages.
                    color = "#212121!important";
                } else {
                    color = "#000000!important";
                }
                let id = response[i]["id"];
                container += '<div class="row" style="margin:0 0 20px 0;background-color:'+color+';">';
                container += '<a href="/Message/Chat/'+id+'" style="display:inherit;background-color:'+color+';">';
                container += '  <div class="col-xs-4" style="background-color:'+color+';margin:0 20px 0 0;padding-left:10px;">';
                if (response[i]["messageReadFlg"] == 0) { // Adds color gradient around user image of unread messages.
                    container += '  <div style="position:relative;border-radius:50%;height:55px;width:55px;background-image:linear-gradient(to bottom right, #fff,#0d47a1,#9933CC);">';
                    container += '    <img src="'+response[i]["picture"]+'" style="border-radius:50%;width:50px;height:50px;margin:auto;position:absolute;top:-50%;right:-50%;bottom:-50%;left:-50%;">';
                    container += '  </div>';
                } else {
                    container += '    <img src="'+response[i]["picture"]+'" style="border-radius:50%;width:50px;height:50px;">';
                }       
                container += '  </div>';
                container += '  <div class="col-xs-6" style="background-color:'+color+';margin:0;padding-top:5px;padding-right:100px;text-align:left;">';
                container += '      <span style="font-size: 14px;background-color:'+color+';">'+response[i]["userName"]+'</span><br/>';
                let date = response[i]["createDate"];
                date = formatDate(date);
                container += '      <span style="font-size: 12px;background-color:'+color+';">'+date+'</span>';
                container += '  </div>';
                container += '</a>';
                container += '  <div class="col-xs-2" style="margin:0 0 0 auto;padding-top:5px;padding-right:10px;">';
                container += '    <a class="btn btn-link bg-danger" style="font-size:14px;border-radius:50%;" response-toggle="modal" href="#deleteModal'+response[i]["id"]+'"><i class="fas fa-trash" style="color:#ffffff!important;"></i></a>';
                container += '    <div class="modal fade top-margin" id="deleteModal'+response[i]["id"]+'" tabindex="-1" role="dialog">';
                container += '      <div class="modal-dialog">';
                container += '        <div class="modal-content text-center">';
                container += '          <div class="modal-header" style="border:none!important;border:none!important;border-bottom-top-radius:0!important;border-top-left-radius:0!important;">';
                container += '            <h4 class="modal-title">Confirm</h4>';
                container += '              <button type="button" class="close pull-right" response-dismiss="modal">&times;</button>';
                container += '            </div>';
                container += '            <div class="modal-body" style="border:none!important;background-color:#212121!important;">';
                container += '              <p>Are you sure you want sto delete these messages?</p>';
                container += '            </div>';
                container += '            <div class="modal-footer" style="border:none!important;border-bottom-right-radius:0!important;border-bottom-left-radius:0!important;background-color:#212121!important;">';
                container += '              <button onclick="deleteMessage('+'"'+id+'"'+')" type="button" class="btn btn-danger" response-dismiss="modal">Yes</button>';
                container += '              <button type="button" class="btn btn-secondary" response-dismiss="modal">Cancel</button>';
                container += '            </div>';
                container += '          </div>';
                container += '        </div>';
                container += '      </div>';
                container += '    </div>';
                container += '  </div>';
                container += '</div>';
            }
            $("#mailbox").empty();
            $("#mailbox").html(container);
        }
    });
}

function getChat() { // Gets list of chat messages between two users.
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax({
        type: "GET",
        url: "/Api/GetChat", 
        data: obj,
        success: function(response) {
            let url = window.location.href;
            let picture = url.split('/').pop();
            $("#chat-picture").html(
                '<a href="/Home/Profile/'+picture+'"><img class="user-img-md" src="https://rikku.blob.core.windows.net/images/User-'+picture+'.png"></a>'
            );
            let container = "";
            for (i = 0; i < response.length; i++) { // Maps response items into rows to place into the chat screen.
                let userId = response[i]["userId"];
                let senderId = response[i]["senderId"];
                let receiverId = response[i]["receiverId"];
                if (senderId == userId) {
                    container += '<div class="row message-container-row">';
                    container += '<div class="col-sm-12" style="margin:0;padding:0;">';
                    container += '    <img style="float:right;border-radius: 50%; height: 30px; width: 30px;margin-left:5px;" src="https://rikku.blob.core.windows.net/images/User-'+userId+'.png"><span class="float-right bg-primary text-white" style="background-color:#263238!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">'+response[i]["content"]+'</span>';
                    container += '</div>';
                    container += '<div class="col-sm-12" style="padding:0 0 20px 0;">';
                    let date = response[i]["createDate"];
                    date = formatDate(date);
                    container += '   <span style="color: #bdbdbd;height:15px; font-size:10px; float:right;">Sent '+date+'</span>';
                    container += '</div>';
                    container += '</div>';
                } 
                if (receiverId == userId) {
                    container += '<div class="row message-container-row">';
                    container += '<div class="col-sm-12" style="margin:0;padding:0;">';
                    container += '<img style="float: left;border-radius: 50%; height: 30px; width: 30px;margin-right:5px;" src="https://rikku.blob.core.windows.net/images/User-'+picture+'.png"><span class="float-left bg-success text-white" style="border:2px solid #263238!important;background-color:#000000!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">'+response[i]["content"]+'</span>';
                    container += '</div>';
                    container += '<div class="col-sm-12" style="padding:0 0 20px 0;">';
                    let date = response[i]["createDate"];
                    date = formatDate(date);
                    container += '<span style="color: #bdbdbd;height:15px;font-size:10px;">Sent '+date+'</span>';
                    container += '</div>';
                    container += '</div>';
                }
            }
            $("#message-container").html(container);
            $("#message-container").scrollTop($("#message-container")[0].scrollHeight);
        }
    });
}

function getMessageCount() { // Gets a count of unread messages.
    $.ajax({
        type: "GET",
        url: "/Api/GetMessageCount", 
        success: function(response) {
            let count = $("#message-count").val();
            if (response > 0) {
                if (response > count) {
                    $("#message-count").empty();
                    $("#message-count").val(response);
                    $("#message-count").show();
                
                    if (window.location.href.indexOf("Message") > -1) { // If in the mailbox, get the new messages.
                        getMessages();
                    }
                }
            }
            if (window.location.href.indexOf("Chat") > -1) { // If in the chat, get the new messages.
                if (response > 0) {
                    getChat();
                }
            }
        }
    });
}

function isFriend(id) { // Check if user is in friend list.
    let obj = new Object();
    if (window.location.href.indexOf("Profile") > -1) {
        let url = window.location.href;
        obj.id = url.split('/').pop();
    } else {
        obj.id = id;
    }
    $.ajax({
        type: "GET",
        url: "/Api/IsFriend", 
        data: obj,
        success: function(response) {
            if (response == 1) {
                if (window.location.href.indexOf("Profile") > -1) {
                    $("#add-friend").html('<i class="fas fa-heart text-danger"></i>');
                    $("#delete-friend").show();
                } else {
                    return response;
                }
            } else {
                if (window.location.href.indexOf("Profile") > -1) {
                    $("#add-friend").html('<i class="far fa-heart text-danger"></i>');
                    $("#delete-friend").hide();
                } else {
                    return response;
                }
            }
        }
    });
}

function getFriends() { // Gets a list of users in friend list.
    $.ajax({
        type: "GET",
        url: "/Api/GetFriends", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            let container = '';
            if (response.length > 0) {
                for (i = 0; i < response.length; i++) { // Maps response items into container for display.
                    container += '  <a href="/Home/Profile/'+response[i]["id"]+'">';
                    container += '    <div class="row" style="margin-bottom:10px;">';
                    container += '      <div class="col-xs-5">';
                    container += '        <img class="user-img-md" src="'+response[i]["picture"]+'" style="border-radius:50%;margin-right: 10px;width:70px;height70px;">';
                    container += '      </div>';
                    container += '      <div class="col-xs-7">';
                    container += '        <span style="font-size: 18px;">'+response[i]["userName"]+'</span> <br/>';
                    container += '        <span style="font-size: 16px;">'+response[i]["city"]+', '+response[i]["state"]+'</span>';
                    container += '      </div>';
                    container += '    </div>';
                    container += '  </a>';
                }
            } else {
                container += '    <div class="row" style="margin: 0 auto;">';
                container += '      <div class="col-xs-10">';
                container += '        <strong>Nobody like that here.</strong>';
                container += '      </div>';
                container += '    </div>';
            }
            $("#friend-container").html(container);
        }
    });
}

/////////////////////////
//
//         POST
//
/////////////////////////

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
                if (window.location.href.indexOf("Chat") > -1) { // If in the chat, get the new messages.
                    getChat();
                }
                if (response == 1) {
                    let responseTime = Math.floor(Math.random() * (120000 - 3000 + 1)) + 3000;
                    setTimeout(function() {
                        sendResponse(obj.id);
                    }, responseTime)
                    localStorage.setItem("responseTime", responseTime);
                    localStorage.setItem("id", obj.id);
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
            localStorage.clear();
            if (window.location.href.indexOf("Chat") > -1) { // If in the chat, get the new messages.
                getChat();
            }
        }
    });
}

/////////////////////////
//
//        DELETE
//
/////////////////////////

function deleteFriend() { // Removes user from friend list.
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax({
        type: "DELETE",
        url: "/Api/DeleteFriend", 
        data: obj,
        success: function() {
            isFriend();
        }
    });
}

function deleteMessage(id) { // Deletes list of messages between two users.
    let obj = new Object();
    obj.id = id;
    console.log(id);
    // $.ajax({
    //     type: "DELETE",
    //     url: "/Api/DeleteMessage", 
    //     data: obj,
    //     success: function() {
    //         getMessages();
    //         console.log("Deleted and fetched messages again.");
    //     }
    // });
}