function handleMessage(data) {
    switch (data.type) {
        case "newMessage":
            handleNewChatMessage(data)
            break
        case "userConnected":
            handleNewChatMessage(data)
            break
        case "userDisconnected":
            handleNewChatMessage(data)
            break
        case "shareMessageIDs":
            shareMessages(data.ids);
            break
        case "shareMessages":
            synchronizeMessages(data.messages);
            break
        case "shareActivity":
            setUserActivity(data.userID, data.name, new Date(data.date));
            break
    }
}

function handleNewChatMessage(message) {
    switch (message.type) {
        case "newMessage":
            messages.push({
                id: message.id,
                userID: message.userID,
                date: message.date,
                name: message.name,
                text: message.text,
                type: "message"
            });
            setUserActivity(message.userID, message.name, new Date(message.date))
            break
        case "userConnected":
            messages.push({
                id: new Date().getTime().toString() + name,
                name: "User connected",
                text: message.name,
                type: "info"
            });
            break
        case "userDisconnected":
            messages.push({
                id: new Date().getTime().toString() + name,
                name: "User disconnected",
                text: message.name,
                type: "info"
            });
            break

    }
    updateChat();
}

function updateChat() {
    chat.innerHTML = "";
    messages.sort((a, b) => a.id > b.id ? 1 : -1);
    for (let message of messages) {
        let m = document.createElement("div");
        let name = document.createElement("span");
        let text = document.createElement("span");
        name.innerText = message.name + ": "
        text.innerText = message.text
        if (message.type === "info") {
            m.className = "text-primary";
        } else {
            name.style.color = "#" + message.userID.toString().slice(0, 6)
        }
        m.appendChild(name);
        m.appendChild(text);
        chat.appendChild(m);
    }
    chat.scrollTo({
        top: chat.offsetHeight * 2,
        behavior: 'smooth'
    })
}

function sendMessage() {
    let message = messageInput.value;
    if (message.length === 0)
        return
    messageInput.value = "";
    let date = new Date().getTime()
    socket.send(encrypt(JSON.stringify({
        id: date + selfID,
        userID: selfID,
        date: date,
        type: "newMessage",
        text: message,
        name: name
    }), roomKey));
    messageInput.focus()
}

function shareMessageIDs() {
    let ids = messages.filter((m) => m.type === "message").map((m) => m.id);
    socket.send(encrypt(JSON.stringify({
        type: "shareMessageIDs",
        ids: ids,
        name: name
    }), roomKey));
}

function shareMessages(knownMessageIDs) {
    let messagesForShare = messages.filter((m) => knownMessageIDs.indexOf(m.id) === -1 && m.type === "message");
    socket.send(encrypt(JSON.stringify({
        type: "shareMessages",
        messages: messagesForShare,
        name: name
    }), roomKey));
}

function synchronizeMessages(inputMessages) {
    let ids = messages.filter((m) => m.type === "message").map((m) => m.id);
    for (let inputMessage of inputMessages) {
        if (ids.indexOf(inputMessage.id) === -1) {
            messages.push({
                id: inputMessage.id,
                userID: inputMessage.userID,
                date: inputMessage.date,
                name: inputMessage.name,
                text: inputMessage.text,
                type: "message"
            });
        }
    }
    updateChat();
}

function shareActivity() {
    socket.send(encrypt(JSON.stringify({
        type: "shareActivity",
        userID: selfID,
        name: name,
        date: new Date().getTime(),
    }), roomKey))
}

function setUserActivity(userID, name, date) {
    users[userID] = {name, date}
    updateUsersActivity()
}

function updateUsersActivity() {
    usersActivity.innerHTML = "";

    let usersActivityList = []
    for (let userID in users) {
        usersActivityList.push(users[userID])
    }
    usersActivityList.sort((a, b) => a.date < b.date ? 1 : -1)

    for (let userActivity of usersActivityList) {
        let ua = document.createElement("li");
        let ua_span = document.createElement("span");
        ua_span.className = "dropdown-item"
        if (new Date() - userActivity.date > 10000) {
            delete users[userActivity.userID]
        } else {
            ua_span.innerText = `${userActivity.name}: ${userActivity.date.toLocaleString("ru")}`;
            ua.appendChild(ua_span);
            usersActivity.appendChild(ua);
        }
    }
    amountOfMembers.innerText = usersActivity.children.length.toString()
}