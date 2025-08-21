from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Message, db
from app.forms import MessageForm
from app import socketio 

message_routes = Blueprint('messages', __name__)


@message_routes.route('/channels/<int:channel_id>/messages')
def get_channel_messages(channel_id):
    messages = Message.query.filter(Message.channel_id == channel_id).all()
    return jsonify([message.to_dict() for message in messages])


@message_routes.route('/channels/<int:channel_id>/messages', methods=['POST'])
@login_required
def create_message(channel_id):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_message = Message(
            text=form.data['text'],
            channel_id=channel_id,
            user_id=current_user.id
        )
        db.session.add(new_message)
        db.session.commit()
        
        socketio.emit('new_message', new_message.to_dict(), room=str(channel_id))
        
        return new_message.to_dict()
    return {'errors': form.errors}, 400


@message_routes.route('/messages/<int:message_id>', methods=['PUT'])
@login_required
def update_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return {'errors': 'Message not found'}, 404
    if message.user_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message.text = form.data['text']
        db.session.commit()

        # Emit an event after updating a message
        socketio.emit('message_updated', message.to_dict(), room=str(message.channel_id))
        
        return message.to_dict()
    return {'errors': form.errors}, 400


@message_routes.route('/messages/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return {'errors': 'Message not found'}, 404
    if message.user_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    channel_id = message.channel_id # Save the channel_id before deleting
    db.session.delete(message)
    db.session.commit()

    # Emit an event after deleting a message
    socketio.emit('message_deleted', {'message_id': message_id, 'channel_id': channel_id}, room=str(channel_id))

    return {'message': 'Message deleted successfully'}