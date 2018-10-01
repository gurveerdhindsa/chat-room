var user;

var clients = [];

//Submitting a nickname
$("#nickname").keypress( e => {
    if(e.which == 13) {
        user = $("#nickname").val();

        if (user.length > 0 && !clients.indexOf(user) > -1) {
            document.cookie="user="+user;
            window.location.href = window.location.href + "chat"
        } else {
            clients.push(user);
            window.top.location.href = '/';
        }
    }
});