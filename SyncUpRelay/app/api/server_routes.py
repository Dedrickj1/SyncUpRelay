from flask import Blueprint, jsonify
from app.models import Server

# Create a Blueprint for server routes
server_routes = Blueprint('servers', __name__)


@server_routes.route('/')
def get_all_servers():
    
    # Use the Server model to query all servers from the database
    servers = Server.query.all()
    
    # Convert the list of server objects into a list of dictionaries
    server_list = [server.to_dict() for server in servers]
    
    # Return the list of servers as a JSON response
    return jsonify(server_list)