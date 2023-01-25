import hashlib
from typing import Dict

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from managers import ConnectionManager
from view import Login
from view.chat import Chat

app = FastAPI()

chat = Chat()
login = Login()
rooms: Dict[str, ConnectionManager] = {}


@app.get("/")
async def read_root():
    return HTMLResponse(login.content)


@app.get("/room/{room_hash}")
async def read_root():
    return HTMLResponse(chat.content)


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
