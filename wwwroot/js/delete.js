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
    $.ajax({
        type: "DELETE",
        url: "/Api/DeleteMessage", 
        data: obj,
        success: function() {
            $("#deleteModal" + id).modal("hide");
            getMailbox();
        }
    });
}