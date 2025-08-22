from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Server, db
from app.forms import ServerForm
from app import socketio

server_routes = Blueprint('servers', __name__)


@server_routes.route('/servers')
def get_all_servers():
    servers = Server.query.all()
    return jsonify([server.to_dict() for server in servers])


@server_routes.route('/servers', methods=['POST'])
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

        socketio.emit('servers_updated', {'message': 'Server list has been updated'})

        return new_server.to_dict()
    return {'errors': form.errors}, 400


@server_routes.route('/servers/<int:server_id>', methods=['PUT'])
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

        socketio.emit('servers_updated', {'message': 'Server list has been updated'})

        return server.to_dict()

    return {'errors': form.errors}, 400


@server_routes.route('/servers/<int:server_id>', methods=['DELETE'])
@login_required
def delete_server(server_id):
    server = Server.query.get(server_id)
    if not server:
        return {'errors': 'Server not found'}, 404
    if server.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    db.session.delete(server)
    db.session.commit()

    socketio.emit('servers_updated', {'message': 'Server list has been updated'})

    return {'message': 'Server deleted successfully'}