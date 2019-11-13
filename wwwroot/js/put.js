function addMessageReaction(id) {
    $("#reaction"+id).toggle();
    // TODO: get this to turn off on a document click while still allowing it to toggle.

    $("#like"+id).click(function() {
        let obj = new Object();
        obj.id = id;
        obj.reaction = 1;
        console.log(obj.reaction);
        $.ajax({
            type: "PUT",
            url: "/Api/AddMessageReaction", 
            data: obj,
            success: function() {
                getChat(1);
            }
        });
    });

    $("#dislike"+id).click(function() {
        let obj = new Object();
        obj.id = id;
        obj.reaction = 2;
        console.log(obj.reaction);
        $.ajax({
            type: "PUT",
            url: "/Api/AddMessageReaction", 
            data: obj,
            success: function() {
                getChat(1);
            }
        });
    });

    $("#love"+id).click(function() {
        let obj = new Object();
        obj.id = id;
        obj.reaction = 3;
        console.log(obj.reaction);
        $.ajax({
            type: "PUT",
            url: "/Api/AddMessageReaction", 
            data: obj,
            success: function() {
                getChat(1);
            }
        });
    });

    $("#laugh"+id).click(function() {
        let obj = new Object();
        obj.id = id;
        obj.reaction = 4;
        console.log(obj.reaction);
        $.ajax({
            type: "PUT",
            url: "/Api/AddMessageReaction", 
            data: obj,
            success: function() {
                getChat(1);
            }
        });
    });

    $("#sad"+id).click(function() {
        let obj = new Object();
        obj.id = id;
        obj.reaction = 5;
        console.log(obj.reaction);
        $.ajax({
            type: "PUT",
            url: "/Api/AddMessageReaction", 
            data: obj,
            success: function() {
                getChat(1);
            }
        });
    });
}

function editUserRole(id, role) {
    let obj = new Object();
    obj.id = id;
    obj.role = role;
    $.ajax({
        type: "PUT",
        url: "/Api/EditUserRole", 
        data: obj,
        success: function() {
            $("#EditModal" + id).modal("hide");
        }
    });
}