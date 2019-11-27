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
                let id = $("#chat-id").val();
                getChat(id, 1);
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
                let id = $("#chat-id").val();
                getChat(id, 1);
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
                let id = $("#chat-id").val();
                getChat(id, 1);
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
                let id = $("#chat-id").val();
                getChat(id, 1);
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
                let id = $("#chat-id").val();
                getChat(id, 1);
            }
        });
    });
}

function updateUserRole(id, role) {
    let obj = new Object();
    obj.id = id;
    obj.role = role;
    $.ajax({
        type: "PUT",
        url: "/Api/UpdateUserRole", 
        data: obj,
        success: function() {
            $("#EditModal" + id).modal("hide");
        }
    });
}

function updateUserLocation() {
    // let obj = new Object();

    // navigator.geolocation.getCurrentPosition(function(position) {
    //     $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&sensor=false", function(data) {
    //         console.log(data);
    //     });    
    // });
    // $.ajax({
    //     type: "GET",
    //     url: "https://ipinfo.io",
    //     dataType: "json",
    //     success: function(response) {
    //         console.log(response);
    //         obj.ip = response["ip"];
    //         console.log(obj.ip);
    //         obj.city = response["city"];
    //         console.log(obj.city);
    //         obj.region = response["region"];
    //         console.log(obj.region);
    //         obj.country = response["country"];
    //         console.log(obj.country);
    //     }
    // });

    // $.ajax({
    //     type: "PUT",
    //     url: "/Api/UpdateUserLocation", 
    //     data: obj,
    //     success: function() {
    //         // TODO:
    //     }
    // });
}

function updateUser() {
    //let obj = new Object();
    let obj = new FormData();
    obj.append("picture", $("#img-input-user")[0].files[0]);
    obj.append("wallpaper", $("#img-input-wallpaper")[0].files[0]);
    obj.append("firstName", $("#user-firstname").val());
    obj.append("lastName", $("#user-lastname").val());
    obj.append("email", $("#user-email").val());
    obj.append("profile", $("#profile-text").val());
    obj.append("city", $("#profile-city").val());
    obj.append("state", $("#profile-state").val());

    $.ajax({
        type: "POST",
        url: "/Api/UpdateUser", 
        enctype: 'multipart/form-data',
        data: obj,
        processData: false,  
        contentType: false, 
        success: function() {
            getUser(1);
        }
    });
}