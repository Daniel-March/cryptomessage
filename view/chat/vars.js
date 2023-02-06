let roomKey = window.localStorage.getItem("roomKey");
let name = window.localStorage.getItem("name");

if (roomKey === null || name === null) {
    window.location = "/";
}

let roomHash = CryptoJS.SHA3(roomKey).toString(CryptoJS.enc.Hex);
let nameCrypt = encrypt(name, roomKey);
let chat = document.getElementById("chat");
let usersActivity = document.getElementById("usersActivity");
let messageInput = document.getElementById("message");
let amountOfMembers = document.getElementById("amountOfMembers");
let messages = [];
let selfID = Math.random().toString().slice(2) + name;
let users = {};