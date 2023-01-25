import hashlib
from typing import Dict

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, name: str):
        await websocket.accept()
        self.active_connections[websocket] = name

    def disconnect(self, websocket: WebSocket) -> str:
        name = self.active_connections[websocket]
        del self.active_connections[websocket]
        return name

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


app = FastAPI()

with open("login.html") as login_page, \
        open("chat.html") as chat_page, \
        open("crypto-js.js") as cryptojs, \
        open("bootstrap.js") as bootstrap_js, \
        open("bootstrap.css") as bootstrap_css:
    cryptojs = cryptojs.read()
    bootstrap_js = bootstrap_js.read()
    bootstrap_css = bootstrap_css.read()
    login_content = login_page.read()
    chat_content = chat_page.read()

    chat_content = chat_content.replace("/*crypto-js*/", cryptojs)
    chat_content = chat_content.replace("/*Bootstrap.css*/", bootstrap_css)
    chat_content = chat_content.replace("/*Bootstrap.js*/", bootstrap_js)
    login_content = login_content.replace("/*crypto-js*/", cryptojs)
    login_content = login_content.replace("/*Bootstrap.css*/", bootstrap_css)
    login_content = login_content.replace("/*Bootstrap.js*/", bootstrap_js)
rooms: Dict[str, ConnectionManager] = {}


@app.get("/")
async def read_root():
    return HTMLResponse(login_content)


@app.get("/room/{room_hash}")
async def read_root():
    return HTMLResponse(chat_content)


@app.websocket("/ws/{room_hash}")
async def websocket_endpoint(websocket: WebSocket, name: str, room_hash: str):
    name = name.replace(" ", "+")
    if room_hash not in rooms.keys():
        rooms[room_hash] = ConnectionManager()
    await rooms[room_hash].connect(websocket, name)
    await rooms[room_hash].broadcast(f"0{name}")
    try:
        while True:
            data = await websocket.receive_text()
            sign = hashlib.md5((data + name).encode()).hexdigest()
            await rooms[room_hash].broadcast(f"2{data}{sign}")
    except WebSocketDisconnect:
        name = rooms[room_hash].disconnect(websocket)
        await rooms[room_hash].broadcast(f"1{name}")


uvicorn.run(app, host="127.0.0.1", port=8080)
