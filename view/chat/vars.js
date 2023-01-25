let roomKey = window.localStorage.getItem("roomKey");
let name = window.localStorage.getItem("name");

if (roomKey === null || name === null) {
    window.location = "/"
}

let roomHash = CryptoJS.SHA3(roomKey).toString(CryptoJS.enc.Hex);
let nameCrypt = encrypt(name, roomKey);
let chat = document.getElementById("chat")
let messages = [];