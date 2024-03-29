function getProfile(id) {
    clearUtility();
    $("#profile-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
    $("#profile-container").empty();
    //$("#spinner").show();
    let obj = new Object();
    obj.id = id;
    $.ajax({
        type: "GET",
        url: "/Api/GetProfile",
        data: obj,
        dataType: "json",
        timeout: 5000,
        success: function(response) {
            let x = localStorage.referrer;
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
            container += '<input id="profile-id" type="hidden" value='+id+' />';
            container += '<h3 class="text-center">'+response["userName"]+'</h3>';
            let location;
            if (response["city"] == null && response["state"] == null) {
                location = "";
            }
            if (response["city"] != null && response["state"] != null) {
                location = response["city"] + ", " + response["state"];
            }
            if (response["state"] == null && response["city"] != null) {
                location = response["city"];
            }
            if (response["city"] == null && response["state"] != null) {
                location = response["state"];
            }
            container += '<h5 class="text-center">'+location+'</h5>';
            container += '<h5></h5>';
            if (response["profile"] != null) {
                container += '<h5 style="margin: 20px 0;">'+response["profile"]+'</h5>';
            } else {
                container += '<h5 style="margin: 20px 0;">&nbsp;</h5>';
            } 
            container += '<h5></h5>';
            container += '</div>';
            container += '</div>';
            container += '<div class="row text-center" style="margin:0 0 50px 0;">';
            container += '<a class="btn btn-primary" style="width:45%;margin:0 auto;" data-toggle="modal" href="#newMessageModal">Message</a>';
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
            container += '<input id="message-input-profile" class="form-group input-group message-input-profile" placeholder="Type message here..." style="border-radius:25px!important;" maxlength=40 required />';
            container += '<button class="btn btn-link" style="font-size:20px;z-index:100;font-weight:bolder;color:#00b0ff;position:absolute;right:10px;bottom:5.5vh;text-decoration:none!important;" onclick="sendMessage();">Send</button>';
            container += '<div class="bottom-margin">&nbsp;</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            $("#spinner").hide();
            $("#no-connection").hide();
            $("#profile-container").empty();
            $("#profile-container").html(container);
            isFriend(id);
            setGoBack(x, id);
        },
        error: function(jqXHR, textStatus) {
            $("#spinner").show();
            $("#no-connection").show();
            clearInterval(getProfile);
            setTimeout(function() { getProfile(id) }, 5000);
        }
    });
}

function getAdmin(x) {
    clearUtility();
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
    $("#fa-users-cog").addClass("active");
    $("#admin-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    // if (!x) {
    //     $("#spinner").show();
    // }
    $.ajax({
        type: "GET",
        url: "/Api/GetAdmin",
        dataType: "json",
        timeout: 5000,
        success: function(response) {
            let container = '';
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                let id = response[i]["id"];
                container += '<div class="row" style="margin-top:10px;">';
                container += '<div class="col-xs-7">';
                container += '<a class="btn btn-link" style="font-size: 18px;color:#ffffff!important;" data-toggle="modal" href="#EditModal'+response[i]["id"]+'"><img class="user-img-md" src="'+response[i]["picture"]+'" style="margin-right: 10px;" /> '+response[i]["userName"]+' </a>';
                container += '<div class="modal fade top-margin" id="EditModal'+id+'" tabindex="-1" role="dialog">';
                container += '<div class="modal-dialog">';
                container += '<div class="modal-content text-center">';
                container += '<div class="modal-header modal-title-border-override">';
                container += '<h4 class="modal-title">Edit User Role</h4>';
                container += '<button type="button" class="close pull-right" data-dismiss="modal">&times;</button>';
                container += '</div>';
                container += '<div class="modal-body">';
                container += '<p class="text-left" style="font-size:18px;">';
                if (response[i]["firstName"] != null || response[i]["lastName"] != null) {
                    container += '            <span>'+response[i]["firstName"]+' '+response[i]["lastName"]+'</span><br/>';
                } else if (response[i]["firstName"] != null && response[i]["lastName"] === null) {
                    container += '<span>'+response[i]["firstName"]+'</span><br/>';
                } else {
                    container += '<span>(no name provided)</span><br/>';
                }
                container += ''+response[i]["email"]+'<br/>';
                container += 'Current Role: '+response[i]["roleName"]+'</p>';
                container += '<p>Assign a role?</p>';
                container += '<button class="btn btn-primary" onclick=updateUserRole('+'"'+id+'"'+',1)>ADMIN</button>';
                container += '<button class="btn btn-primary" onclick=updateUserRole('+'"'+id+'"'+',2)>SUPERUSER</button>';
                container += '<button class="btn btn-primary" onclick=updateUserRole('+'"'+id+'"'+',3)>USER</button>';
                container += '<p style="margin-top:5px;">Ban or delete?</p>';
                container += '<button class="btn btn-secondary" onclick=updateUserRole('+'"'+id+'"'+',4)>BAN</button>';
                container += '<button class="btn btn-secondary" onclick=updateUserRole('+'"'+id+'"'+',5)>DELETE</button>';
                container += '</div>';
                container += '</div>';
                container += '</div>';
                container += '</div> ';
                container += '</div>';
                container += '<div class="col-xs-5" style="margin:25px 15px 0 auto!important;">';
                if (response[i]["roleName"] == "SuperUser") {
                    container += '<span class="btn btn-primary" style="background-color:#00b0ff!important;">'+response[i]["roleName"]+'</span>';
                }
                if (response[i]["roleName"] == "Admin") {
                    container += '<span class="btn btn-warning" style="min-width:92px;">'+response[i]["roleName"]+'</span>';
                }
                if (response[i]["roleName"] == "User") {
                    container += '<span class="btn btn-secondary" style="background-color: #000!important;border:1px solid #455a64!important;min-width:92px;">'+response[i]["roleName"]+'</span>';
                }
                container += '</div>';
                container += '</div>';
            }
            $("#spinner").hide();
            $("#no-connection").hide();
            $("#admin-container").empty();
            $("#admin-container").html(container);
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status != 403) {
                $("#spinner").show();
                $("#no-connection").show();
                clearInterval(getAdmin);
                setTimeout(getAdmin, 5000);
            }
        }
    });
}

function getUsers(x) { // Gets list of all registered users.
    clearUtility();
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
    $("#fa-home").addClass("active");
    $("#home-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    // if (!x) {
    //     $("#spinner").show();
    // }
    $.ajax({
        type: "GET",
        url: "/Api/GetUsers", 
        dataType: "json",
        timeout: 5000,
        success: function(response) { 
            localStorage.referrer = 1;
            let container = '';
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                let id = response[i]["userId"];
                container += '<div class="user-snippet-container">';
                container += '<a onclick=getProfile("'+id+'")>';
                container += '<div class="row user-snippet-row-main">';
                container += '<div class="col-xs-5">';
                container += '<img class="user-img-md" src="'+response[i]["picture"]+'">';
                container += '</div>';
                container += '<div class="col-xs-7">';
                container += '<span style="font-size: 18px;">'+response[i]["userName"]+'</span> <br/>';
                let location;
                if (response[i]["city"] == null && response[i]["state"] == null) {
                    location = "";
                }
                if (response[i]["city"] != null && response[i]["state"] != null) {
                    location = response[i]["city"] + ", " + response[i]["state"];
                }
                if (response[i]["state"] == null && response[i]["city"] != null) {
                    location = response[i]["city"];
                }
                if (response[i]["city"] == null && response[i]["state"] != null) {
                    location = response[i]["state"];
                }
                container += '<span style="font-size: 16px;">'+location+'</span>';
                container += '<span id="friend-heart" style="display:none;">';
                container += '<i class="fas fa-heart text-danger"></i>';
                container += '</span>';
                container += '</div>';
                container += '</div>';
                container += '<div class="row user-snippet-row-secondary">';
                let profile;
                if (response[i]["profile"] == null) {
                    profile = "";
                } else {
                    profile = response[i]["profile"];
                }
                container += '<span>'+profile+'</span>';
                container += '</div>';
                container += '</a>';
                container += '</div>';
            }
            $("#spinner").hide();
            $("#no-connection").hide();
            $("#home-index-container").empty();
            $("#home-index-container").html(container);
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status != 401) {
                $("#spinner").show();
                $("#no-connection").show();
                clearInterval(getMailbox);
                clearTimeout(getMailbox);
                clearInterval(getUsers);
                setTimeout(getUsers, 5000);
            } else if (jqXHR.status == 0) {
                $("#spinner").show();
                $("#no-connection").show();
                clearInterval(getMailbox);
                clearTimeout(getMailbox);
                getUsers();
            }
        }
    });
}

function getMailbox(x) { // Gets list of messages from users.
    clearUtility();
    $("#message-container").empty();
    $("#chat-picture").empty();
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
    $("#fa-comment").addClass("active");
    $("#mail-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    // if (!x) {
    //     //$("#mailbox").empty();
    //     $("#spinner").show();
    // }
    $.ajax({
        type: "GET",
        url: "/Api/GetMailbox", 
        dataType: "json",
        timeout: 5000,
        success: function(response) {
            let container = "";
            for (i = 0; i < response.length; i++) { // Maps response items into containers for display.
                let id = response[i]["id"];
                container += '<a onclick=getChat("'+id+'") style="height:75px;display:inherit;margin:0 auto;border-bottom:2px solid #121212;border-left-width: 0;border-right-width: 0;border-image: linear-gradient(to right, #121212, #00b0ff) 1 stretch;">';
                container += '<div class="row" style="margin:0 10px 20px 10px;border-radius:40px;padding:5px;">';
                container += '<div class="col-xs-4" style="margin:0;border-radius:50%;">';
                if (response[i]["messageReadFlg"] == 0) { // Adds color gradient around user image of unread messages.
                    container += '<div style="position:relative;border-radius:50%;height:65px;width:65px;background:linear-gradient(40deg,#4a148c,#098cff)!important;">';
                    container += '<img src="'+response[i]["picture"]+'" style="border-radius:50%;width:60px;height:60px;margin:auto;position:absolute;top:-50%;right:-50%;bottom:-50%;left:-50%;">';
                    container += '</div>';
                } else {
                    container += '<img src="'+response[i]["picture"]+'" style="border-radius:50%;width:60px;height:60px;">';
                }       
                container += '</div>';
                container += '<div class="col-xs-4" style="margin:0 0 0 50px;padding-top:5px;">';
                if (response[i]["messageReadFlg"] == 0) { // Changes the font weight.
                    container += '<span class="text-left" style="font-size: 16px;font-weight:bolder;">'+response[i]["userName"]+'</span><br/>';
                } else {
                    container += '<span class="text-left" style="font-size: 16px;">'+response[i]["userName"]+'</span><br/>';
                }
                container += '</div>';
                container += '<div class="col-xs-4" style="margin:0 0 0 auto;padding-top:5px;">';
                let date = response[i]["createDate"];
                date = formatDate(date);
                let today = new Date();
                today = formatDate(today);
                
                if (date.split(" ")[0] === today.split(" ")[0]) {
                    date = "Today";
                } 

                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday = formatDate(yesterday);

                if (date.split(" ")[0] === yesterday.split(" ")[0]) {
                    date = "Yesterday";
                }
                
                if (response[i]["messageReadFlg"] == 0) { // Changes the font weight.
                    container += '<span style="font-size: 14spx;font-weight:bolder;">'+date+'</span>';
                } else {
                    container += '<span style="font-size: 14spx;">'+date+'</span>';
                }
                container += '</div>';
                container += '</div>';
                container += '</a>';
            }
            $("#spinner").hide();
            $("#no-connection").hide();
            $("#mailbox").html(container);
        },
        error: function(jqXHR, textStatus) {
            $("#spinner").show();
            $("#no-connection").show();
            clearInterval(getMailbox);
            setTimeout(function() { getMailbox(x) }, 5000);
        }
    });
}

function getChat(id, x) { // Gets list of chat messages between two users.
    //getMessageCount();
    clearUtility();
    $("#message-input-chat").empty();
    $("#chat-page").show().siblings().hide();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    $("#nav-back-btn").click(function() {
        //getMailbox();
        $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
        $("#fa-comment").addClass("active");
        $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
        $("#mail-page").show().siblings().hide();
        $("#chat-picture").empty();
        $("#message-container").empty();
    });
    // if (!x) {
    //     $("#message-container").empty();
    //     $("#spinner").show();
    // }
    let obj = new Object();
    obj.id = id;
    $.ajax({
        type: "GET",
        url: "/Api/GetChat", 
        data: obj,
        timeout: 5000,
        success: function(response) {
            localStorage.referrer = 2;
            $("#chat-picture").html(
                '<a onclick=getProfile("'+id+'")><img class="user-img-md" src="https://rikku.blob.core.windows.net/images/User-'+id+'.png"></a><input id="chat-id" type="hidden" value='+id+' />'
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
                let picture = response[i]["picturePath"];
                let content = response[i]["content"];

                if (senderId == userId) {
                    container += '<div class="row message-container-row">';
                    container += '<div class="col-sm-12" style="margin:0;padding:0;">';
                    container += '<img style="float:right;border-radius: 50%; height: 30px; width: 30px;margin-left:5px;" src="https://rikku.blob.core.windows.net/images/User-'+userId+'.png"><div class="float-right bg-primary text-white" style="position:relative;background-color:#263238!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">';
                    
                    if (picture !== null) {
                        container += '<img async="on" style="height:200px;width:auto;border-radius:5px;" src='+picture+'>';
                    }
                    if (content !== null) {
                        container += '<p class="text-right" style="margin:0;">'+content+'</p>';
                    }
                    container += '</div>';
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
                    container += '<span style="color: #bdbdbd;height:15px; font-size:10px; float:right;">Sent '+date+'</span>';
                    container += '</div>';
                    container += '</div>';
                } 
                if (receiverId == userId) {
                    container += '<div class="row message-container-row">';
                    container += '<div class="col-sm-12" style="margin:0;padding:0;">';

                    container += '<img style="float: left;border-radius: 50%; height: 30px; width: 30px;margin-right:5px;" src="https://rikku.blob.core.windows.net/images/User-'+id+'.png"><div onclick=addMessageReaction('+messageId+') class="response float-left text-white" style="position:relative;border:2px solid #263238!important;font-size:16px;width: auto;border-radius:25px;padding:7px 15px;">';
                    
                    if (picture !== null) {
                        container += '<img async="on" style="height:200px;width:auto;border-radius:5px;" src='+picture+'>';
                    }
                    if (content !== null) {
                        container += '<p style="margin:0;">'+content+'</p>';
                    }
                    container += '</div>';
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
            $("#spinner").hide();
            $("#no-connection-chat").hide();
            $("#message-container").html(container);
            if (!x) {
                messageScroll();
            }
            if (x && x == 2) {
                messageScroll();
            }
            $("#img-input-chat").off().on("change", function(e) { // Drops in a preview of user image before saving.
                addImage(e);
            }); 
            $(".message-input-chat").focus(function() { // Hides navigation when text input is focused.
                $(".footer-nav").hide();
                $("#chat-camera").hide();
                $("#send-button").addClass("move-bottom");
                $(this).height((this.scrollHeight - 7) + "px");
            });
            $(".message-input-chat").blur(function() { // Shows navigation when text input is no longer focused.
                $(".footer-nav").show();
                $("#chat-camera").show();
                $("#send-button").removeClass("move-bottom");
                $(this).height(30);
                $(".message-input-chat").scrollTop($(".message-input-chat")[0].scrollHeight);
            });
            $("#send-button").off("mousedown").mousedown(function() {
                prepareMessage();
            });
        },
        error: function(jqXHR, textStatus) {
            $("#spinner").show();
            $("#no-connection").show();
            clearInterval(getChat);
            setTimeout(function() { getChat(id, 2) }, 5000);
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
                    $("#message-count").val(response);
                    $("#message-count").show();

                    if ($("#mail-page").is(":visible")) { // If in the mailbox, get the new messages.
                        getMailbox(1);
                    }
                    if ($("#chat-page").is(":visible")) { // If in the chat, get the new messages.
                        let id = $("#chat-id").val();
                        getChat(id, 1)
                    }
                }
            } else {
                $("#message-count").hide();
            }
        },
        error: function(jqXHR) {
            // TODO.
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
    clearUtility();
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
    $("#fa-users").addClass("active");
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    $("#friend-page").show().siblings().hide();
    // $("#friend-container").empty();
    // if (!x) {
    //     $("#spinner").show();
    // }
    $.ajax({
        type: "GET",
        url: "/Api/GetFriends", 
        dataType: "json",
        success: function(response) {
            localStorage.referrer = 3;
            let container = '';
            if (response.length > 0) {
                for (i = 0; i < response.length; i++) { // Maps response items into container for display.
                    container += '<a onclick=getProfile(&quot;'+response[i]["id"]+'&quot;)>';
                    container += '<div class="row" style="margin-bottom:10px;">';
                    container += '<div class="col-xs-5">';
                    container += '<img class="user-img-md" src="'+response[i]["picture"]+'" style="border-radius:50%;margin-right: 10px;width:70px;height70px;">';
                    container += '</div>';
                    container += '<div class="col-xs-7">';
                    container += '<span style="font-size: 18px;">'+response[i]["userName"]+'</span> <br/>';
                    container += '<span style="font-size: 16px;">'+response[i]["city"]+', '+response[i]["state"]+'</span>';
                    container += '</div>';
                    container += '</div>';
                    container += '</a>';
                }
            } else {
                container += '<div class="row" style="margin: 0 auto;">';
                container += '<div class="col-xs-10">';
                container += '<strong>Nobody like that here.</strong>';
                container += '</div>';
                container += '</div>';
            }
            $("#spinner").hide();
            $("#no-connection").hide();
            $("#friend-container").html(container);
        },
        error: function(jqXHR, textStatus) {
            $("#spinner").show();
            $("#no-connection").show();
            clearInterval(getFriends);
            setTimeout(getFriends, 5000);
        }
    });
}

function getUser(x) {
    clearUtility();
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").removeClass("active");
    $("#fa-user").addClass("active");
    $("#user-container").empty();
    //$("#spinner").show();
    $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    $.ajax({
        type: "GET",
        url: "/Api/GetUser", 
        dataType: "json",
        success: function(response) {
            let container = '';
            if (x) {
                container += '<div id="status-message" class="status-message">Profile updated! <span onclick=this.parentNode.style.display="none">&times;</span></div>';
            }
            container += '<form id="profile-form" enctype="multipart/form-data" method="post" name="form">';
            container += '<div class="row text-center" style="height: 150px;position:relative;margin:0;">';
            container += '<label>';
            container += '<img id="img-output-wallpaper" style="height:150px;width:100%;" src="'+response["wallpaper"]+'" style="cursor:pointer;">';
            container += '<i class="fas fa-camera" title="Change Image" style="cursor:pointer;position:absolute;bottom:3px;right:3px;z-index:200;"></i>';
            container += '<input value="'+response["wallpaper"]+'" id="img-input-wallpaper" type="file" accept="image/*" name="wallpaper" style="display:none;" multiple />';
            container += '</label>';
            container += '<div class="col-md-4" style="margin: -150px auto 0 auto;">';
            container += '<label>';

            container += '<img id="img-output-user" class="user-img-lg bottom-margin" src="'+response["picture"]+'" title="Picture of you!" style="cursor:pointer;">';
            container += '<div class="user-img-overlay">';
            container += '<i class="fas fa-camera" title="Change Image" style="cursor:pointer;"></i>';
            container += '</div>';
            container += '<input value="'+response["picture"]+'" id="img-input-user" type="file" accept="image/*" name="picture" style="display:none;" multiple />';
            container += '</label>';
            container += '</div>';
            container += '<div class="col-md-4" style="margin:0;font-size:8px;text-align:center;background-color: #00b0ff!important;">';
            container += '<span class="fa-stack fa-2x" style="padding:0 10%;background-color: transparent!important;">';
            container += '<i class="far fa-circle fa-stack-2x"></i>';
            container += '<i class="fas fa-pen fa-stack-1x"></i>';
            container += '</span>';
            container += '<span class="fa-stack fa-2x" style="padding:0 10%;background-color: transparent!important;">';
            container += '<i class="far fa-circle fa-stack-2x"></i>';
            container += '<i class="fas fa-cog fa-stack-1x"></i>';
            container += '</span>';

            if (response["roleName"] == "Admin") {
                container += '<span onclick=getAdmin() class="fa-stack fa-2x" style="padding:0 10%;background-color: transparent!important;">';
                container += '<i class="far fa-circle fa-stack-2x"></i>';
                container += '<i class="fas fa-users-cog fa-stack-1x"></i>';
                container += '</span>';
            }

            container += '<span onclick=logOut() class="fa-stack fa-2x" style="padding:0 10%;transform:rotate(180deg);background-color: transparent!important;">';
            container += '<i class="far fa-circle fa-stack-2x"></i>';
            container += '<i class="fas fa-outdent fa-stack-1x"></i>';
            container += '</span>';
            container += '</form>';
            container += '</div>';
            container += '</div>';
            container += '<div class="row" style="margin:170px 0 0 0!important;">';
            container += '<div class="col-md-8 profile-input">';
            container += '<div class="form-group">';
            container += '<input value="'+response["userName"]+'" class="form-control" style="border-radius:25px;pointer-events:none;" />';
            container += '</div>';
            container += '<div class="form-group">';
            container += '<div class="form-inline">';
            container += '<input id="user-firstname" value="'+response["firstName"]+'" class="form-control" style="border-radius:25px;width: 45%; margin-right: 10%;" placeholder="First..." />';

            if (response["lastName"] != null) {
                container += '<input id="user-lastname" value="'+response["lastName"]+'" class="form-control" style="border-radius:25px;width: 45%;" />';
            } else {
                container += '<input id="user-lastname" value="" class="form-control" style="border-radius:25px;width: 45%;" placeholder="Last name" />';
            }
            
            container += '</div>';
            container += '</div>';
            container += '<div class="form-group">';
            container += '<div class="input-group">';
            container += '<input id="user-email" value="'+response["email"]+'" class="form-control" style="border-radius:25px;" />';
            container += '<span class="input-group-addon" aria-hidden="true"><span class="text-success"></span></span>';
            container += '</div>';
            container += '</div>';
            container += '<div class="form-group">';
            if (response["city"] != null) {
                container += '<input id="user-city" value="'+response["city"]+'" class="form-control" style="border-radius:25px;" />';
            } else {
                container += '<input id="user-city" class="form-control" placeholder="City" style="border-radius:25px;" />';
            }
            container += '</div>';
            container += '<div class="form-group">';
            if (response["state"] != null) {
                container += '<input id="user-state" value="'+response["state"]+'" class="form-control" style="border-radius:25px;" />';
            } else {
                container += '<input id="user-state" class="form-control" placeholder="State" style="border-radius:25px;" />';
            }
            container += '</div>';
            container += '<div class="form-group">';
            let date = response["birthDate"];
            date = formatDate(date, 1);
            
            if (response["birthDate"].toString() != "0001-01-01T00:00:00") {
                container += '<input id="user-birthdate" type="date" value="'+date+'" class="form-control" style="border-radius:25px;" />';
            } else {
                container += '<input id="user-birthdate" onfocus=(this.type="date") onblur=if(this.value==""){this.type="text"} class="form-control" style="border-radius:25px; "placeholder="Birthday" />';
            }
            container += '</div>';
            container += '<div class="form-group">';
            if (response["age"] != null) {
                container += '<input id="user-age" value="'+response["age"]+'" class="form-control" style="border-radius:25px;" />';
            } else {
                container += '<input id="user-age" class="form-control" placeholder="Age" style="border-radius:25px;" />';
            }
            container += '</div>';
            container += '<div class="form-group">';
            container += '<textarea id="user-profile" class="form-control" style="height:92px!important;resize: none;border-radius:25px;" placeholder="Write something about yourself! Up to 255 characters..."></textarea>';
            container += '</div>';
            container += '</div>';
            container += '</div>';
            container += '<div class="row text-center" style="margin:15px auto;">';
            container += '<div class="col-md-8 profile-input">';
            container += '<button id="update-profile-button" class="btn btn-primary" style="width:100%;" onclick="updateUser();">Save</button>';
            container += '<a asp-area="Identity" asp-page="/Account/Manage/DeletePersonalData" class="btn btn-danger" style="margin-top:15px;width:100%;background-color: #000!important;border:1px solid #455a64!important;">Delete Account</a>';
            container += '</div>';
            container += '</div>';
            container += '</form>';
            // container += '<div class="row" style="margin:30px auto;">';
            // container += '<div class="col-xs-8" style="margin:0 15px 0 auto;">';
            // container += '<label class="switch">';
            // container += '<input id="dark-mode" type="checkbox">';
            // container += '<span class="slider round"></span>';
            // container += '</label>';
            // container += '</div>';
            // container += '</div>';
            // $("#spinner").hide();
            // $("#no-connection").hide();
            $("#user-container").empty();
            $("#user-container").html(container);
            $("#img-input-user").change(function(e) { // Drops in a preview of user image before saving.
                let imgPath = URL.createObjectURL(e.target.files[0]);
                $("#img-output-user").fadeIn("fast").attr('src', imgPath); 
            }); 
            $("#img-input-wallpaper").change(function(e) { // Drops in a preview of user wallpaper before saving.
                let imgPath = URL.createObjectURL(e.target.files[0]);
                $("#img-output-wallpaper").fadeIn("fast").attr('src', imgPath); 
            }); 
            $("#user-page").show().siblings().hide();
            $("#user-profile").append(response["profile"]);
        },
        error: function(jqXHR, textStatus) {
            $("#spinner").show();
            $("#no-connection").show();
            clearInterval(getUser);
            setTimeout(getUser, 5000);
        }
    });
}