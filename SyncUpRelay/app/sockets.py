from flask_socketio import SocketIO, emit, join_room, leave_room
from app import socketio 

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("join_channel")
def handle_join_channel(channel_id):
    print(f"Client joined channel room: {channel_id}")
    join_room(str(channel_id))

@socketio.on("leave_channel")
def handle_leave_channel(channel_id):
    print(f"Client left channel room: {channel_id}")
    leave_room(str(channel_id))
