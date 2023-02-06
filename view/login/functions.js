function logIn() {
    let roomKey = roomKeyInput.value;
    let name = nameInput.value;
    let roomHash = CryptoJS.SHA3(roomKey).toString(CryptoJS.enc.Hex);

    window.localStorage.setItem("roomKey", roomKey);
    window.localStorage.setItem("name", name);
    window.location = `/room/${roomHash}`
}

function checkRoomKey() {
    let roomKeyValid = roomKeyInput.value.length > 0 && roomKeyInput.value.length % 4 === 0
    let nameValid = nameInput.value.length > 1
    if (roomKeyValid) {
        roomKeyInput.className = roomKeyInput.className.replace(" text-danger", "")
    } else {
        roomKeyInput.className = roomKeyInput.className.replace(" text-danger", "")
        roomKeyInput.className += " text-danger"
    }

    if (nameValid) {
        nameInput.className = nameInput.className.replace(" text-danger", "")
    } else {
        nameInput.className = nameInput.className.replace(" text-danger", "")
        nameInput.className += " text-danger"
    }

    if (roomKeyValid && nameValid) {
        document.getElementById("logIn").onclick = logIn
        document.getElementById("logIn").disabled = false
    } else {
        document.getElementById("logIn").onclick = null
        document.getElementById("logIn").disabled = true
    }
}