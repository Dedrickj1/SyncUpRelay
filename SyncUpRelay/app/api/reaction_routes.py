from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Reaction, Message, db
from app.forms import ReactionForm
# DO NOT import socketio at the top of the file to avoid circular imports.

reaction_routes = Blueprint('reactions', __name__)


@reaction_routes.route('/messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction(message_id):
    """
    Add a reaction to a specific message
    """
    # Import socketio inside the function to avoid circular imports
    from app import socketio
    
    form = ReactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Check if the user has already reacted with this emoji
        existing_reaction = Reaction.query.filter(
            Reaction.message_id == message_id,
            Reaction.user_id == current_user.id,
            Reaction.emoji == form.data['emoji']
        ).first()

        if existing_reaction:
            return {'errors': 'You have already reacted with this emoji.'}, 400

        new_reaction = Reaction(
            emoji=form.data['emoji'],
            message_id=message_id,
            user_id=current_user.id
        )
        db.session.add(new_reaction)
        db.session.commit()

        # After saving, get the parent message to send its updated data
        message = Message.query.get(message_id)
        socketio.emit('reaction_updated', message.to_dict(), room=str(message.channel_id))
        
        return new_reaction.to_dict()
    return {'errors': form.errors}, 400


@reaction_routes.route('/reactions/<int:reaction_id>', methods=['DELETE'])
@login_required
def remove_reaction(reaction_id):
    """
    Remove a reaction from a specific message
    """
    # Import socketio inside the function
    from app import socketio

    reaction = Reaction.query.get(reaction_id)
    if not reaction:
        return {'errors': 'Reaction not found'}, 404
    if reaction.user_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    message = reaction.message # Get the parent message before deleting
    db.session.delete(reaction)
    db.session.commit()

    # After deleting, get the updated message and send it
    updated_message = Message.query.get(message.id)
    socketio.emit('reaction_updated', updated_message.to_dict(), room=str(updated_message.channel_id))

    return {'message': 'Reaction removed successfully'}