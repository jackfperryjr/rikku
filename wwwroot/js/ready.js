$(document).ready(function() { // Activating icon related to navigated screen upon load.
    getUsers();
    // if (window.location.href.indexOf("mailbox") > -1) {
    //     $("#fa-comment").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     getMailbox();
    //     checkResponse();
    // } else if (window.location.href.indexOf("friends") > -1) {
    //     $("#fa-users").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     getFriends();
    //     checkResponse();
    // } else if (window.location.href.indexOf("manage") > -1) {
    //     $("#fa-user").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     checkResponse();
    // } else if (window.location.href.indexOf("admin") > -1) {
    //     $("#fa-users-cog").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     getAdmin();
    //     checkResponse();
    // } else if (window.location.href.indexOf("about") > -1) {
    //     $("#fa-info").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     checkResponse();
    // } else {
    //     $("#fa-home").addClass("active").siblings().removeClass("active");
    //     $("#nav-back-btn").css("color", "#000000").css("pointer-events", "none");
    //     getUsers();
    //     checkResponse();
    // }

    // if (window.location.href.indexOf("profile") > -1) {
    //     $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
    //     let url = window.location.href;
    //     let id = url.split('/').pop();
    //     getProfile(id);
    //     isFriend(); // Checking if a user if in friend list.
    //     checkResponse(); // Checking if there's a function in localStorage.
    // }

    // if (window.location.href.indexOf("chat") > -1) { 
    //     $("#nav-back-btn").css("color", "#ffffff").css("pointer-events", "auto");
    //     getChat();
    //     $(".message-input-chat").focus(function() { // Hides navigation when text input is focused.
    //         $(".footer-nav").hide();
    //         $("#send-button").addClass("move-bottom");
    //         $(this).height((this.scrollHeight - 7) + "px");
    //     });
    //     $(".message-input-chat").blur(function() { // Shows navigation when text input is no longer focused.
    //         $(".footer-nav").show();
    //         $("#send-button").removeClass("move-bottom");
    //         $(this).height(30);
    //         $(".message-input-chat").scrollTop($(".message-input-chat")[0].scrollHeight);
    //     });
    //     $("#send-button").mousedown(function() {
    //         sendMessage();
    //     });
    // }

    $("#expand-menu").click(function() {
        $("#extra-nav").slideToggle(150);
    });

    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").click(function() {
        // TODO: swap active class amongst IDs.
    });

    (function mailChecker(){ // Self executing function that runs every 3 seconds.
        getMessageCount(); // Quick function to check for new messages.
        setTimeout(mailChecker, 3000)
    })();
});