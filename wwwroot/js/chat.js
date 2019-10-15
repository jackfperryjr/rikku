// "use strict";

// var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// //Disable send button until connection is established
// document.getElementById("send-button").disabled = true;

// connection.on("ReceiveMessage", function (message) {
//     var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

//     if (sender == user) {

//         //put message on the right
//     } else {
//         //put message on the left
//     }
//     var encodedMsg = msg;
//     var msgElement = document.createElement("li");
// });

// connection.start().then(function () {
//     document.getElementById("send-button").disabled = false;
// }).catch(function (err) {
//     return console.error(err.toString());
// });

// document.getElementById("send").addEventListener("click", function (event) {
//     //let user = document.getElementById("user-input").value;
//     let message = document.getElementById("message-input").value;
//     connection.invoke("SendMessage", message).catch(function (err) {
//         return console.error(err.toString());
//     });
//     event.preventDefault();
// });