$(document).ready(function() {
    if (window.location.href.indexOf("Message") > -1) {
        $("#fa-envelope").addClass("active").siblings().removeClass("active");
        getMessages();
    } else if (window.location.href.indexOf("Friends") > -1) {
        $("#fa-users").addClass("active").siblings().removeClass("active");
    } else if (window.location.href.indexOf("Manage") > -1) {
        $("#fa-user").addClass("active").siblings().removeClass("active");
    } else if (window.location.href.indexOf("Admin") > -1) {
        $("#fa-users-cog").addClass("active").siblings().removeClass("active");
    } else if (window.location.href.indexOf("About") > -1) {
        $("#fa-info").addClass("active").siblings().removeClass("active");
    } else {
        $("#fa-home").addClass("active").siblings().removeClass("active");
        getUsers();
    }

    if (window.location.href.indexOf("Profile") > -1) {
        isFriend();
    }

    if (window.location.href.indexOf("Chat") > -1) { // These are only needed on the Chat screen.
        $("#message-container").scrollTop($("#message-container")[0].scrollHeight);

        $(".message-input-chat").focus( function() {
            $(".footer-nav").hide();
            $("#send-button").addClass("move-bottom");
        });
        
        $(".message-input-chat").blur( function() {
            $(".footer-nav").show();
            $("#send-button").removeClass("move-bottom");
        });
    }

    (function mailChecker(){
        getMessageCount();
        setTimeout(mailChecker, 3000)
      })();
});

$("#img-input-user").change(function(event) {
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-user").fadeIn("fast").attr('src',imgPath); 
}); 

$("#img-input-wallpaper").change(function(event) {
    let imgPath = URL.createObjectURL(event.target.files[0]);
    $("#img-output-wallpaper").fadeIn("fast").attr('src',imgPath); 
}); 

$("#select-receiver").change(function() {
    let id = $(this).val();
    let target = $('#receiver-id'); 
    $(target).attr('value', id);
});

function getUsers() {
    $("#overlay").show();
    $.ajax({
        type: "GET",
        url: "/FfriendsterApi/GetUsers", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            let data = response;
            let container = '';
            for (i = 0; i < data.length; i++) {
                container += '<div class="user-snippet-container">';
                container += '  <a href="/Home/Profile/'+data[i]["userId"]+'">';
                container += '    <div class="row user-snippet-row-main">';
                container += '      <div class="col-xs-5">';
                container += '        <img class="user-img-md" src="'+data[i]["picture"]+'">';
                container += '      </div>';
                container += '      <div class="col-xs-7">';
                container += '        <span style="font-size: 18px;">'+data[i]["userName"]+'</span> <br/>';
                container += '        <span style="font-size: 16px;">'+data[i]["city"]+', '+data[i]["state"]+'</span>';
                container += '        <span id="friend-heart" style="display:none;">';
                container += '          <i class="fas fa-heart text-danger"></i>';
                container += '        </span>';
                container += '      </div>';
                container += '    </div>';
                container += '    <div class="row user-snippet-row-secondary">';
                container += '      <span>'+data[i]["profile"]+'</span>';
                container += '    </div>';
                container += '  </a>';
                container += '</div>';
            }
            $("#home-index-container").html(container);
            $("#overlay").hide();
        }
    });
}

function getMessages() {
    $("#overlay").show();
    $.ajax({
        type: "GET",
        url: "/FfriendsterApi/GetMessages", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            let data = response;
             let container = "";
             let color = "#000000!important";
             for (i = 0; i < data.length; i++) {
                if (data[i]["messageReadFlg"] == 0) {
                    color = "#212121!important";
                } else {
                    color = "#000000!important";
                }
                container += '<div class="row" style="margin:0 0 20px 0;background-color:'+color+';">';
                container += '  <div class="col-xs-4" style="margin:0 20px 0 0;padding-left:10px;">';
                container += '    <a href="/Message/Chat/'+data[i]["id"]+'">';
                if (data[i]["messageReadFlg"] == 0) {
                    container += '  <div style="position:relative;border-radius:50%;height:55px;width:55px;background-image:linear-gradient(to bottom right, #fff,#0d47a1,#9933CC);">';
                    container += '    <img src="'+data[i]["picture"]+'" style="border-radius:50%;width:50px;height:50px;margin:auto;position:absolute;top:-50%;right:-50%;bottom:-50%;left:-50%;">';
                    container += '  </div>';
                } else {
                    container += '    <img src="'+data[i]["picture"]+'" style="border-radius:50%;width:50px;height:50px;">';
                }       
                container += '    </a>';
                container += '  </div>';
                container += '  <div class="col-xs-6" style="margin:0;padding-top:5px;text-align:left;">';
                container += '    <a asp-action="Chat" asp-route-id="@users.Id" style="display:inline;background-color:'+color+';">';
                container += '      <span style="font-size: 14px;background-color:'+color+';">'+data[i]["userName"]+'</span><br/>';
                let date = data[i]["createDate"];
                date = new Date(date).toLocaleDateString();
                container += '      <span style="font-size: 12px;background-color:'+color+';">'+date+'</span>';
                container += '    </a>';
                container += '  </div>';
                container += '  <div class="col-xs-2" style="margin:0 0 0 auto;padding-top:5px;padding-right:10px;">';
                container += '    <a class="btn btn-link bg-danger" style="font-size:14px;border-radius:50%;" data-toggle="modal" href="#deleteModal'+data[i]["id"]+'"><i class="fas fa-trash" style="color:#ffffff!important;"></i></a>';
                container += '    <div class="modal fade top-margin" id="deleteModal'+data[i]["id"]+'" tabindex="-1" role="dialog">';
                container += '      <div class="modal-dialog">';
                container += '        <div class="modal-content text-center">';
                //                     @using(Html.BeginForm("DeleteChat", "Message"))

                //                     TODO: add in the delete chat functionality

                //                     <input type="hidden" value="@users.Id" name="id" />
                container += '          <div class="modal-header" style="border:none!important;border:none!important;border-bottom-top-radius:0!important;border-top-left-radius:0!important;">';
                container += '            <h4 class="modal-title">Confirm</h4>';
                container += '              <button type="button" class="close pull-right" data-dismiss="modal">&times;</button>';
                container += '            </div>';
                container += '            <div class="modal-body" style="border:none!important;background-color:#212121!important;">';
                container += '              <p>Are you sure you want to delete these messages?</p>';
                container += '            </div>';
                container += '            <div class="modal-footer" style="border:none!important;border-bottom-right-radius:0!important;border-bottom-left-radius:0!important;background-color:#212121!important;">';
                container += '              <button type="submit" class="btn btn-danger">Yes</button>';
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
            $("#overlay").hide();
        }
    });
}

function getMessageCount() {
    $.ajax({
        type: "GET",
        url: "/FfriendsterApi/GetMessageCount", 
        success: function(data) {
            if (data > 0) {
                let count = $("#message-count").val();
                console.log(count);
                if (data > count) {
                    $("#message-count").empty();
                    $("#message-count").val(data);
                    $("#message-count").show();
                
                    if (window.location.href.indexOf("Message") > -1) {
                        getMessages();
                    }
                }
            }
        }
    });
}

function addFriend() {
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax(
        {
            type: "POST",
            url: "/FfriendsterApi/AddFriend", 
            data: obj,
            success: function() {
                isFriend();
        }
    });
}

function deleteFriend() {
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax(
        {
            type: "DELETE",
            url: "/FfriendsterApi/DeleteFriend", 
            data: obj,
            success: function() {
                isFriend();
        }
    });
}

function isFriend(id) {
    let obj = new Object();
    if (window.location.href.indexOf("Profile") > -1) {
        let url = window.location.href;
        obj.id = url.split('/').pop();
    } else {
        obj.id = id;
    }
    $.ajax(
        {
            url: "/FfriendsterApi/IsFriend", 
            data: obj,
            success: function(response) {
                if (response == 1) {
                    if (window.location.href.indexOf("Profile") > -1) {
                        $("#add-friend").html('<i class="fas fa-heart text-danger"></i>');
                        $("#delete-friend").show();
                    } else {
                        let flag = response;
                        return flag;
                        //$("#friend-heart").show();
                    }
                } else {
                    if (window.location.href.indexOf("Profile") > -1) {
                        $("#add-friend").html('<i class="far fa-heart text-danger"></i>');
                        $("#delete-friend").hide();
                    } else {
                        let flag = response;
                        return flag;
                    }
                }
        }
    });
}