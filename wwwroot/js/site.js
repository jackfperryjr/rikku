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
      })()
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
    $.get("/MessageApi/GetMessageCount", function (data) {
        if (data > 0) {
            $("#message-count").empty();
            $("#message-count").html(data);
            $("#message-count").show();
        }
    }, "json");
}