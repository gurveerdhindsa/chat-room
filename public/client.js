var socket = io.connect("http://localhost:8080");

socket.on("connect", (data) => {
    socket.emit("join", "ANON");
});

socket.on("message-list", (data, sender) => {
    $("#message-list").append("<li class='message'><span class='message-sender'>" + sender + ": </span><span class='message-text''>" + data + "</span></li>");

    updateScroll();
});

socket.on("user-status", (user, action) => {
    switch(action) {
        case "CONNECT":
            $("#message-list").append("<li class='message'><span class='user-status'>" + user + " has connected</span></li>");
            break;

        case "SELF_CONNECT":
            $("#message-list").append("<li class='message'><span class='user-status'>You have connected</span></li>");
            break;
        case "DISCONNECT":
            $("#message-list").append("<li class='message'><span class='user-status'>A user has disconnected</span></li>");
            break;
        default:
    }
})


//Submitting a message
$("#message-text").keypress( e => {
    if(e.which == 13) {
        var message = $("#message-text").val();
        socket.emit("messages", message, "ANON", true);

        //Clear the text field
        document.getElementById('message-text').value = "";

        updateScroll();

        return false;
    }
});

function updateScroll () {
    var element = document.getElementById("message-list");
    element.scrollTop = element.scrollHeight+10;

    return;
}


