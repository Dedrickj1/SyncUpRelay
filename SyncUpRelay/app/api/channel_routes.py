from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Channel, db
from app.forms import ChannelForm

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/<int:channel_id>', methods=['PUT'])
@login_required
def update_channel(channel_id):
    """
    Update an existing channel's name
    """
    # Find the channel by its ID 
    channel = Channel.query.get(channel_id)

    # Check if the channel exists
    if not channel:
        return {'errors': 'Channel not found'}, 404

    # Check if the current user is the owner of the channel
    if channel.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Update the channel's name
        channel.name = form.data['name']
        db.session.commit()
        return channel.to_dict()
        
    return {'errors': form.errors}, 400

@channel_routes.route('/<int:channel_id>', methods=['DELETE'])
@login_required 
def delete_channel(channel_id):
    """
    Delete an existing channel
    """
    channel = Channel.query.get(channel_id)

    if not channel:
        return {'errors': 'Channel not found'}, 404

  
    if channel.owner_id != current_user.id:
        return {'errors': 'Forbidden'}, 403
    
    db.session.delete(channel)
    db.session.commit()

    return {'message': 'Channel deleted successfully'}