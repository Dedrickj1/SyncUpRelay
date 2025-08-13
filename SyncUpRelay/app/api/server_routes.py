
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Server, Channel, db
from app.forms import ServerForm, ChannelForm

# Create a Blueprint for server routes
server_routes = Blueprint('servers', __name__)

# Gets all Servers
@server_routes.route('/')
def get_all_servers():
    servers = Server.query.all()
    server_list = [server.to_dict() for server in servers]
    return jsonify(server_list)

# Create Server
@server_routes.route('/', methods=['POST'])
@login_required
def create_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        new_server = Server(
            name=form.data['name'],
            owner_id=current_user.id
        )
        db.session.add(new_server)
        db.session.commit()
        return new_server.to_dict()
    
    return {'errors': form.errors}, 400

# Update Server
@server_routes.route('/<int:server_id>', methods=['PUT'])
@login_required
def update_server(server_id):
    
    server = Server.query.get(server_id)

    if not server:
        return {'errors': 'Server not found'}, 404

    if server.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        server.name = form.data['name']
        db.session.commit()
        return server.to_dict()
        
    return {'errors': form.errors}, 400


# Delete Server
@server_routes.route('/<int:server_id>', methods=['DELETE'])
@login_required
def delete_server(server_id):
   
    server = Server.query.get(server_id)

    if not server:
        return {'errors': 'Server not found'}, 404

    if server.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    db.session.delete(server)
    db.session.commit()

    return {'message': 'Server deleted successfully'}


# Channel Routes
@server_routes.route('/<int:server_id>/channels')
def get_server_channels(server_id):
    """
    Query for all channels belonging to a specific server
    """
    # Use the Channel model to query for channels that match the server_id
    channels = Channel.query.filter(Channel.server_id == server_id).all()
    
    # Convert the list of channel objects into a list of dictionaries
    return jsonify([channel.to_dict() for channel in channels])

@server_routes.route('/<int:server_id>/channels', methods=['POST']) # <-- 2. Add methods=['POST'] here
@login_required
def create_channel(server_id):
    """
    Create a new channel for a specific server
    """
    server = Server.query.get(server_id)
    if not server:
        return {'errors': 'Server not found'}, 404
    if server.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_channel = Channel(
            name=form.data['name'],
            server_id=server_id,
            owner_id=1
        )
        db.session.add(new_channel)
        db.session.commit()
        return new_channel.to_dict()
    
    return {'errors': form.errors}, 400
