function deleteFriend() { // Removes user from friend list.
    let url = window.location.href;
    let obj = new Object();
    obj.id = $("#profile-id").val();
    $.ajax({
        type: "DELETE",
        url: "/Api/DeleteFriend", 
        data: obj,
        success: function() {
            isFriend(obj.id);
        }
    });
}