from typing import Dict

from fastapi import WebSocket


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
