from flask_socketio import SocketIO, emit
from . import socketio # Import the socketio instance from app/__init__.py

# This is a simple event handler that will be triggered when a client connects.
@socketio.on("connect")
def handle_connect():
    print("Client connected")
