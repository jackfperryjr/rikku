$(document).ready(function() { // Activating icon related to navigated screen upon load.
    getUsers();
    // updateUserLocation();

    $("#expand-menu").click(function() {
        $("#extra-nav").slideToggle(150);
    });
    
    $("#fa-home, #fa-user, #fa-users-cog, #fa-comment, #fa-users").click(function() {
        if ($("#extra-nav").is(":visible")) {
            $("#extra-nav").slideToggle(150);
        }
    });

    (function mailChecker(){ // Self executing function that runs every 3 seconds.
        getMessageCount(); // Quick function to check for new messages.
        setTimeout(mailChecker, 3000)
    })();
});