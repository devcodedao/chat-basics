var socket = io();
socket.on("connect", () => {
    console.log("New user connected");
    socket.emit('join', {
        params: $.deparam(window.location.search)
    })
})
socket.on("disconnect", () => {
    console.log("User disconnected");
})
socket.on('emitEmail', (message) => {
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: moment(message.createAt).format('h:m a')
    })
    $('#messages').append(html);
})
socket.on('newLocationMessage', (message) => {
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createAt: moment(message.createAt).format('h:m a')
    })
    $('#messages').append(html);

})
socket.on('usersInRoom', (message) => {
    var users = message.usersInRoom;
    // console.log(users[1])
    var ol=$('<ol></ol>')
    for (let i = 0; i < message.usersInRoom.length; i++) {
        var li=$('<li></li>');
        li.text(users[i].name);
        ol.append(li)
    }
    $('#user').html(ol)

})
$('#message-form').on('submit', (event) => {
    event.preventDefault();
    socket.emit('toEmail', {
        from: 'User',
        text: $('[name=message]').val()
    }, (data) => {
        console.log('Success', data);
        $('[name=message]').val('')
    })
})
$('#send-location').on('click', () => {
    if (!navigator.geolocation) {
        return alert('Khong ho tro');
    }
    else {
        navigator.geolocation.getCurrentPosition(position => {
            socket.emit('createLocation', {
                from: 'user',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        }, () => {
            alert('khong hien thi location');
        })
    }
})

