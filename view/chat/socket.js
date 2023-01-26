let url = `ws://${window.location.host}/ws/${roomHash}?name=${nameCrypt}`;
let socket = new WebSocket(url);

socket.onopen = function (e) {
    document.getElementById("name").innerText = name;
    document.getElementById("room_key").innerText = roomKey;
    chat.innerHTML = "";
    shareMessageIDs();
};

socket.onmessage = function (event) {
    switch (event.data.slice(0, 1)) {
        case "2":
            let sign = event.data.slice(event.data.length - 32);
            let encodedData = event.data.slice(1, event.data.length - 32);
            let data = JSON.parse(decrypt(encodedData, roomKey));
            if (sign === CryptoJS.MD5(encodedData + encrypt(data.name, roomKey)).toString())
                handleMessage(data);
            break
        case "1":
            handleMessage({
                type: "userDisconnected",
                name: decrypt(event.data.slice(1), roomKey)
            });
            break
        case "0":
            handleMessage({
                type: "userConnected",
                name: decrypt(event.data.slice(1), roomKey)
            });
            break
    }
};

socket.onclose = function (event) {
    if (!event.wasClean) {
        alert('[close] Соединение прервано');
    }
};

socket.onerror = function (error) {
    alert(`${error}`);
};