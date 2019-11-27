$(document).ready(function() { // Activating icon related to navigated screen upon load.
    getUsers();
    // updateUserLocation();

    // $("#fa-home").click(function () {
    //     $("#home-page").addClass("show-page").siblings().addClass("hide-page");
    // });
    // $("#fa-comment").click(function () {
    //     $("#mail-page").addClass("show-page").siblings().addClass("hide-page");
    // });
    
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").click(function() {
        if ($("#extra-nav").is(":visible")) {
            $("#extra-nav").slideToggle(150);
        }
    });

    (function mailChecker(){ // Self executing function that runs every 3 seconds.
        getMessageCount(); // Quick function to check for new messages.
        clearInterval(mailChecker);
        if ($("#mail-page").is(":hidden")) { // If in the mailbox, get the new messages.
            clearTimeout(getMailbox);
            clearInterval(getMailbox);
        }
        if ($("#chat-page").is(":hidden")) { // If in the chat, get the new messages.
            clearTimeout(getChat);
            clearInterval(getChat);
        }
        setTimeout(mailChecker, 3000)
    })();
});