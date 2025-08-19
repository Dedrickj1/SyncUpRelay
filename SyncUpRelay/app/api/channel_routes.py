from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Server, Channel, db
from app.forms import ChannelForm

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/servers/<int:server_id>/channels')
def get_server_channels(server_id):
    channels = Channel.query.filter(Channel.server_id == server_id).all()
    return jsonify([channel.to_dict() for channel in channels])


@channel_routes.route('/servers/<int:server_id>/channels', methods=['POST'])
@login_required
def create_channel(server_id):
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
            owner_id=current_user.id
        )
        db.session.add(new_channel)
        db.session.commit()
        return new_channel.to_dict()
    return {'errors': form.errors}, 400


@channel_routes.route('/channels/<int:channel_id>', methods=['PUT'])
@login_required
def update_channel(channel_id):
    channel = Channel.query.get(channel_id)
    if not channel:
        return {'errors': 'Channel not found'}, 404
    if channel.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel.name = form.data['name']
        db.session.commit()
        return channel.to_dict()
    return {'errors': form.errors}, 400


@channel_routes.route('/channels/<int:channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    channel = Channel.query.get(channel_id)
    if not channel:
        return {'errors': 'Channel not found'}, 404
    if channel.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403
    
    db.session.delete(channel)
    db.session.commit()
    return {'message': 'Channel deleted successfully'}