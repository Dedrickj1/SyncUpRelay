
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Server, db
from app.forms import ServerForm

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