function getProfile(id, x) {
    $("#profile-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
    $("#profile-container").empty().html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    let obj = new Object();
    obj.id = id;
    $.ajax({
        type: "GET",
        url: "/Api/GetProfile",
        data: obj,
        dataType: "json",
        success: function(response) {
            let goBack;
            if (x) {
                goBack = localStorage.getItem("getUsers");
            } else {
                goBack = localStorage.getItem("getChat");
            }
            let container = '';
            container += '<div class="row text-center" style="height:150px;margin:0;">';
            container += '<img id="img-output-wallpaper" style="height:150px;width:100%;" src="'+response["wallpaper"]+'" style="cursor:pointer;">';
            container += '<div class="col-md-4" style="margin: -150px auto 0 auto;">';
            container += '<img class="user-img-lg bottom-margin" src="'+response["picture"]+'" title="Picture of user!">';
            container += '<button id="add-friend" onclick="addFriend()" style="border:none!important;font-size:30px;position:absolute;bottom:10px;right:60px;background-color:transparent!important;"></button>';
            container += '</div>';
            container += '</div>';
            container += '<div class="row top-margin" style="margin:80px 0 0 0;">';
            container += '<div class="col-md-12" style="margin:0 0 10px 0;">';
            container += '<h3 class="text-center">'+response["userName"]+'</h3>';
            container += '<h5 class="text-center">'+response["city"]+', '+response["state"]+'</h5>';
            container += '<h5></h5>';
            container += '<h5 style="margin: 20px 0;">'+response["profile"]+'</h5>';
            container += '<h5></h5>';
            container += '</div>';
            container += '</div>';
            container += '<div class="row text-center" style="margin:0 0 50px 0;">';
            container += '<a class="btn btn-primary" style="width:45%;margin:0 5px 0 auto;" data-toggle="modal" href="#newMessageModal">Message</a>';
            container += '<a class="btn btn-secondary" style="background-color:#6c757d!important;width:45%;margin:0 auto 0 5px;" onclick='+goBack+'>Go Back</a>';
            container += '<div class="row text-center" style="margin:50px auto;width:100vw;">';
            container += '<span style="margin:0 auto;">';
            container += '<button id="delete-friend" onclick="deleteFriend()" style="display:none;border:none!important;font-size:15px;background-color:transparent!important;color:#ffffff;">';
            container += '<i class="fas fa-heart-broken text-danger" style="font-size:30px;" aria-hidden="true"></i> Remove friend?</button>';
            container += '</span>';
            container += '</div>';
            container += '<div class="modal fade top-margin" id="newMessageModal" tabindex="-1" role="dialog">';
            container += '<div class="modal-dialog">';
            container += '<div class="modal-content">';
            container += '<div class="modal-body">';
            container += '<img style="border-radius:50%;height:100px;width:100px;margin-bottom:50px;" src="'+response["picture"]+'" title="Picture of user!">';
            container += '<input id="message-input" class="form-group input-group message-input-profile" placeholder="Type message here..." style="border-radius:25px!important;" maxlength=40 required />';
            container += '<button class="btn btn-link" style="font-size:20px;z-index:100;font-weight:bolder;color:#ffffff;position:absolute;right:10px;bottom:5.5vh;" onclick="sendMessage();">Send</button>';
            container += '<div class="bottom-margin">&nbsp;</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            $("#profile-container").empty();
            $("#profile-container").html(container);
            isFriend(id);
        }
    });
}

function getAdmin(x) {
    if (!x) {
        $("#admin-container").html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    }
    $.ajax({
        type: "GET",
        url: "/Api/GetAdmin",
        dataType: "json",
        success: function(response) {
            let container = '';
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                let id = response[i]["id"];
                container += '<div class="row" style="margin-top:10px;">';
                container += '  <div class="col-xs-7">';
                container += '    <a class="btn btn-link" style="font-size: 18px;color:#ffffff!important;" data-toggle="modal" href="#EditModal'+response[i]["id"]+'"><img class="user-img-md" src="'+response[i]["picture"]+'" style="margin-right: 10px;" /> '+response[i]["userName"]+' </a>';
                container += '    <div class="modal fade top-margin" id="EditModal'+id+'" tabindex="-1" role="dialog">';
                container += '      <div class="modal-dialog">';
                container += '        <div class="modal-content text-center">';
                container += '          <div class="modal-header modal-title-border-override">';
                container += '            <h4 class="modal-title">Edit User Role</h4>';
                container += '            <button type="button" class="close pull-right" data-dismiss="modal">&times;</button>';
                container += '          </div>';
                container += '          <div class="modal-body">';
                container += '            <p class="text-left" style="font-size:18px;">';
                if (response[i]["firstName"] != null || response[i]["lastName"] != null) {
                    container += '            <span>'+response[i]["firstName"]+' '+response[i]["lastName"]+'</span><br/>';
                } else if (response[i]["firstName"] != null && response[i]["lastName"] === null) {
                    container += '            <span>'+response[i]["firstName"]+'</span><br/>';
                } else {
                    container += '            <span>(no name provided)</span><br/>';
                }
                container += '            '+response[i]["email"]+'<br/>';
                container += '            Current Role: '+response[i]["roleName"]+'</p>';
                container += '            <p>Assign a role?</p>';
                container += '            <button class="btn btn-primary" onclick=editUserRole('+'"'+id+'"'+',1)>ADMIN</button>';
                container += '            <button class="btn btn-primary" onclick=editUserRole('+'"'+id+'"'+',2)>SUPERUSER</button>';
                container += '            <button class="btn btn-primary" onclick=editUserRole('+'"'+id+'"'+',3)>USER</button>';
                container += '            <p style="margin-top:5px;">Ban or delete?</p>';
                container += '            <button class="btn btn-secondary" onclick=editUserRole('+'"'+id+'"'+',4)>BAN</button>';
                container += '            <button class="btn btn-secondary" onclick=editUserRole('+'"'+id+'"'+',5)>DELETE</button>';
                container += '          </div>';
                container += '        </div>';
                container += '      </div>';
                container += '    </div> ';
                container += '  </div>';
                container += '  <div class="col-xs-5" style="margin:25px 15px 0 auto!important;">';
                if (response[i]["roleName"] == "SuperUser") {
                    container += '    <span class="btn btn-success" style="background-color:#28a745!important;">'+response[i]["roleName"]+'</span>';
                }
                if (response[i]["roleName"] == "Admin") {
                    container += '    <span class="btn btn-primary">'+response[i]["roleName"]+'</span>';
                }
                if (response[i]["roleName"] == "User") {
                    container += '    <span class="btn btn-secondary" style="background-color:#6c757d!important;">'+response[i]["roleName"]+'</span>';
                }
                container += '  </div>';
                container += '</div>';
            }
            $("#admin-container").empty();
            $("#admin-container").html(container);
        }
    });
}

function getUsers(x) { // Gets list of all registered users.
    $("#home-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    if (!x) {
        $("#home-index-container").html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    }
    localStorage.removeItem("getUsers");
    localStorage.getUsers = "getUsers()";
    $.ajax({
        type: "GET",
        url: "/Api/GetUsers", 
        dataType: "json",
        success: function(response) { 
            let container = '';
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                let id = response[i]["userId"];
                container += '<div class="user-snippet-container">';
                container += '  <a onclick=getProfile("'+id+'", 1)>';
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
            $("#home-index-container").empty();
            $("#home-index-container").html(container);
            localStorage.removeItem(getUsers);
        }
    });
}

function getMailbox(x) { // Gets list of messages from users.
    $("#mail-page").show().siblings().hide();
    if (!x) {
        $("#mailbox").empty().html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    }
    $.ajax({
        type: "GET",
        url: "/Api/GetMailbox", 
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
                container += '<div class="row" style="margin:0 0 20px 0;background-color:'+color+';border-radius:40px;padding:5px;">';
                container += '<a onclick=getChat("'+id+'") style="display:inherit;background-color:'+color+';border-radius:50%;">';
                container += '  <div class="col-xs-4" style="background-color:'+color+';margin:0 20px 0 0;padding-left:10px;border-radius:50%;">';
                if (response[i]["messageReadFlg"] == 0) { // Adds color gradient around user image of unread messages.
                    container += '  <div style="position:relative;border-radius:50%;height:55px;width:55px;background:linear-gradient(40deg,#f57f17,#4527a0)!important;">';
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
                container += '  <div class="col-xs-2" style="margin:0 0 0 auto;padding-top:10px;padding-right:10px;border-radius:50%;">';
                container += '    <a class="btn btn-link bg-danger" style="font-size:14px;border-radius:50%;" data-toggle="modal" href="#deleteModal'+response[i]["id"]+'"><i class="fas fa-trash" style="color:#ffffff!important;"></i></a>';
                container += '    <div class="modal fade top-margin" id="deleteModal'+id+'" tabindex="-1" role="dialog">';
                container += '      <div class="modal-dialog">';
                container += '        <div class="modal-content text-center">';
                container += '          <div class="modal-header" style="border:none!important;border:none!important;border-bottom-top-radius:0!important;border-top-left-radius:0!important;">';
                container += '            <h4 class="modal-title">Confirm</h4>';
                container += '              <button type="button" class="close pull-right" data-dismiss="modal">&times;</button>';
                container += '            </div>';
                container += '            <div class="modal-body" style="border:none!important;background-color:#212121!important;">';
                container += '              <p>Are you sure you want sto delete these messages?</p>';
                container += '            </div>';
                container += '            <div class="modal-footer" style="border:none!important;border-bottom-right-radius:0!important;border-bottom-left-radius:0!important;background-color:#212121!important;">';
                container += '              <button onclick=deleteMessage("'+id+'") class="btn btn-danger" data-dismiss="modal">Yes</button>';
                container += '              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
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

function getChat(id, x) { // Gets list of chat messages between two users.
    $("#chat-page").show().siblings().hide();
    if (!x) {
        $("#message-container").empty().html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    }
    localStorage.removeItem("getChat");
    localStorage.removeItem("chatId");
    localStorage.setItem("chatId", obj.id);
    localStorage.getChat = "getChat(localStorage.chatId)";
    let obj = new Object();
    obj.id = id;
    $.ajax({
        type: "GET",
        url: "/Api/GetChat", 
        data: obj,
        success: function(response) {
            $("#chat-picture").html(
                '<a onclick=getProfile("'+id+'")><img class="user-img-md" src="https://rikku.blob.core.windows.net/images/User-'+id+'.png"></a>'
            );
            let container = "";
            for (i = 0; i < response.length; i++) { // Maps response items into rows to place into the chat screen.
                let messageId = response[i]["messageId"];
                let userId = response[i]["userId"];
                let senderId = response[i]["senderId"];
                let receiverId = response[i]["receiverId"];
                let liked = response[i]["isLiked"];
                let disliked = response[i]["isDisliked"];
                let loved = response[i]["isLoved"];
                let laughed = response[i]["isLaughed"];
                let saddened = response[i]["isSaddened"];

                if (senderId == userId) {
                    container += '<div class="row message-container-row">';
                    container += '<div class="col-sm-12" style="margin:0;padding:0;">';
                    container += '    <img style="float:right;border-radius: 50%; height: 30px; width: 30px;margin-left:5px;" src="https://rikku.blob.core.windows.net/images/User-'+userId+'.png"><div class="float-right bg-primary text-white" style="position:relative;background-color:#263238!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">'+response[i]["content"]+'';
                    
                    if (liked === 1) { // Liked.
                        container += '<i class="fas fa-thumbs-up message-reaction-liked-left" aria-hidden="true"></i>';
                    }
                    if (disliked === 1) { // Disliked.
                        container += '<i class="fas fa-thumbs-down message-reaction-disliked-left" aria-hidden="true"></i>';
                    }
                    if (loved === 1) { // Loved.
                        container += '<i class="fas fa-heart message-reaction-loved-left" aria-hidden="true"></i>';
                    }
                    if (laughed === 1) { // Laughed.
                        container += '<i class="fas fa-laugh-squint message-reaction-laughed-left" aria-hidden="true"></i>';
                    }
                    if (saddened === 1) { // Saddened.
                        container += '<i class="fas fa-sad-tear message-reaction-saddened-left" aria-hidden="true"></i>';
                    }

                    container += '</div>';
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

                    container += '<img style="float: left;border-radius: 50%; height: 30px; width: 30px;margin-right:5px;" src="https://rikku.blob.core.windows.net/images/User-'+picture+'.png"><div onclick=addMessageReaction('+messageId+') class="response float-left bg-success text-white" style="position:relative;border:2px solid #263238!important;background-color:#000000!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">'+response[i]["content"]+'';

                    // Container to display message reaction options.
                    container += '<div id="reaction'+messageId+'" class="message-reaction-container">';
                    container += '<i id="like'+messageId+'" class="fas fa-thumbs-up message-reaction-like" aria-hidden="true"></i>';
                    container += '<i id="dislike'+messageId+'" class="fas fa-thumbs-down message-reaction-dislike" aria-hidden="true"></i>';
                    container += '<i id="love'+messageId+'" class="fas fa-heart message-reaction-love" aria-hidden="true"></i>';
                    container += '<i id="laugh'+messageId+'" class="fas fa-laugh-squint message-reaction-laugh" aria-hidden="true"></i>';
                    container += '<i id="sad'+messageId+'" class="fas fa-sad-tear message-reaction-sad" aria-hidden="true"></i>';
                    container += '</div>';

                    if (liked === 1) { // Liked.
                        container += '<i class="fas fa-thumbs-up message-reaction-liked-right" aria-hidden="true"></i>';
                    }
                    if (disliked === 1) { // Disliked.
                        container += '<i class="fas fa-thumbs-down message-reaction-disliked-right" aria-hidden="true"></i>';
                    }
                    if (loved === 1) { // Loved.
                        container += '<i class="fas fa-heart message-reaction-loved-right" aria-hidden="true"></i>';
                    }
                    if (laughed === 1) { // Laughed.
                        container += '<i class="fas fa-laugh-squint message-reaction-laughed-right" aria-hidden="true"></i>';
                    }
                    if (saddened === 1) { // Saddened.
                        container += '<i class="fas fa-sad-tear message-reaction-saddened-right" aria-hidden="true"></i>';
                    }
                    
                    container += '</div>';
                    container += '</div>';
                    container += '<div class="col-sm-12" style="padding:0 0 20px 0;">';
                    let date = response[i]["createDate"];
                    date = formatDate(date);
                    container += '<span style="color: #bdbdbd;height:15px;font-size:10px;">Sent '+date+'</span>';
                    container += '</div>';
                    container += '</div>';
                }
            }
            $("#message-container").empty();
            $("#message-container").html(container);
            if (!x) {
                messageScroll();
            }
            if (x && x == 2) {
                messageScroll();
            }
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
                
                    if (window.location.href.indexOf("mailbox") > -1) { // If in the mailbox, get the new messages.
                        getMailbox(1);
                    }
                }
            }
            if (window.location.href.indexOf("chat") > -1) { // If in the chat, get the new messages.
                if (response > 0) {
                    getChat();
                }
            }
        }
    });
}

function isFriend(id) { // Check if user is in friend list.
    let obj = new Object();
    obj.id = id;
    $.ajax({
        type: "GET",
        url: "/Api/IsFriend", 
        data: obj,
        success: function(response) {
            if (response == 1) {
                $("#add-friend").html('<i class="fas fa-heart text-danger"></i>');
                $("#delete-friend").show();
                return response;
            } else {
                $("#add-friend").html('<i class="far fa-heart text-danger"></i>');
                $("#delete-friend").hide();
                return response;
            }
        }
    });
}

function getFriends(x) { // Gets a list of users in friend list.
    if (!x) {
        $("#friend-container").html('<i class="fab fa-ello fa-spin text-white" style="position:fixed;top:40%;left:50vw;font-size: 24px;"></i>');
    }
    $.ajax({
        type: "GET",
        url: "/Api/GetFriends", 
        dataType: "json",
        success: function(response) {
            let container = '';
            if (response.length > 0) {
                for (i = 0; i < response.length; i++) { // Maps response items into container for display.
                    container += '  <a href="/home/profile/'+response[i]["id"]+'">';
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
            $("#friend-container").empty();
            $("#friend-container").html(container);
            $("#friend-page").show().siblings().hide();
        }
    });
}