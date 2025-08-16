from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Reaction, db
from app.forms import ReactionForm

reaction_routes = Blueprint('reactions', __name__)


# This route adds a reaction to a specific message
@reaction_routes.route('/messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction(message_id):
    """
    Add a reaction to a specific message
    """
    form = ReactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_reaction = Reaction(
            emoji=form.data['emoji'],
            message_id=message_id,
            user_id=current_user.id
        )
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()
    return {'errors': form.errors}, 400


# This route removes a specific reaction
@reaction_routes.route('/<int:reaction_id>', methods=['DELETE'])
@login_required
def remove_reaction(reaction_id):
    """
    Remove a reaction from a specific message
    """
    reaction = Reaction.query.get(reaction_id)
    if not reaction:
        return {'errors': 'Reaction not found'}, 404
    if reaction.user_id != current_user.id:
        return {'errors': 'Forbidden'}, 403

    db.session.delete(reaction)
    db.session.commit()
    return {'message': 'Reaction removed successfully'}