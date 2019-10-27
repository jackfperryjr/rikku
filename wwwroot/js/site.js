$(document).ready(function() {
    $("#main").fadeIn(200);
    $("a.transition").click(function(event){
        event.preventDefault();
        linkLocation = this.href;
        $("#main").fadeOut(200, redirectPage);      
    });
        
    function redirectPage() {
        window.location = linkLocation;
    }

    if (window.location.href.indexOf("Message") > -1) {
        $("#fa-envelope").addClass("active").siblings().removeClass("active");
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

    (function runForever(){
        getMessageCount();
        setTimeout(runForever, 3000)
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

function getMessageCount() {
    $.get("/FfriendsterApi/GetMessageCount", function (data) {
        if (data > 0) {
            $("#message-count").empty();
            $("#message-count").html(data);
            $("#message-count").show();
        }
    }, "json");
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

function isFriend() {
    let url = window.location.href;
    let obj = new Object();
    obj.id = url.split('/').pop();
    $.ajax(
        {
            url: "/FfriendsterApi/IsFriend", 
            data: obj,
            success: function(response) {
                if (response == 1) {
                    $("#add-friend").html('<i class="fas fa-heart text-danger"></i>');
                    $("#delete-friend").show();
                } else {
                    $("#add-friend").html('<i class="far fa-heart text-danger"></i>');
                    $("#delete-friend").hide();
                }
        }
    });
}