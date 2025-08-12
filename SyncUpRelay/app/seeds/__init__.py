from flask.cli import AppGroup
from .users import seed_users, undo_users
from .servers import seed_servers, undo_servers
from .channels import seed_channels, undo_channels
from .messages import seed_messages, undo_messages
from .reactions import seed_reactions, undo_reactions

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    # Before seeding in production, you want to run the seed undo
    # Run the undo commands first to clear the database tables.
    # The undo functions are called in reverse order of model creation
    undo_reactions()
    undo_messages()
    undo_channels()
    undo_servers()
    undo_users()

    # --- Seed the database tables ---
    seed_users()
    seed_servers()
    seed_channels()
    seed_messages()
    seed_reactions()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # Run undo commands in reverse order of creation
    undo_reactions()
    undo_messages()
    undo_channels()
    undo_servers()
    undo_users()