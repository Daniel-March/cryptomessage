function handleMessage(data) {
    switch (data.type) {
        case "newMessage":
            messages.push({
                id: data.id,
                name: data.name,
                text: data.text,
                type: "message"
            });
            break
        case "userConnected":
            messages.push({
                id: new Date().getTime().toString() + name,
                name: "User connected",
                text: data.name,
                type: "info"
            });
            break
        case "userDisconnected":
            messages.push({
                id: new Date().getTime().toString() + name,
                name: "User disconnected",
                text: data.name,
                type: "info"
            });
            break
        case "shareMessageIDs":
            shareMessages(data.ids);
            break
        case "shareMessages":
            synchronizeMessages(data.messages);
            break
    }
    updateChat();
}


function updateChat() {
    chat.innerHTML = "";
    messages.sort((a, b) => a.id > b.id ? 1 : -1);
    for (let message of messages) {
        let m = document.createElement("div");
        m.innerText = `${message.name}: ${message.text}`;
        if (message.type === "info") {
            m.className = "text-primary";
        }
        chat.appendChild(m);
    }
}

function sendMessage() {
    let message = document.getElementById("message").value;
    if (message.length === 0)
        return
    document.getElementById("message").value = "";
    socket.send(encrypt(JSON.stringify({
        id: new Date().getTime().toString() + name,
        type: "newMessage",
        text: message,
        name: name
    }), roomKey));
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
                name: inputMessage.name,
                text: inputMessage.text,
                type: "message"
            });
        }
    }
}