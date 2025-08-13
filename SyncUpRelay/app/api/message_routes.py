from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Message, Reaction, db
from app.forms import MessageForm, ReactionForm

message_routes = Blueprint('messages', __name__)