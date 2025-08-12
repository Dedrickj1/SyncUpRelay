from app.models import db, Reaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reactions():
    # Reactions for Message 1 ('Welcome...')
    reactions_msg1 = [
        Reaction(emoji='👋', message_id=1, user_id=2),
        Reaction(emoji='🎉', message_id=1, user_id=3),
    ]
    # Reactions for Message 3 ('Can anyone help...')
    reactions_msg3 = [
        Reaction(emoji='👍', message_id=3, user_id=1),
    ]
    # Reactions for Message 5 ('Anyone playing...')
    reactions_msg5 = [
        Reaction(emoji='🎮', message_id=5, user_id=1),
        Reaction(emoji='🎮', message_id=5, user_id=3),
    ]

    db.session.add_all(reactions_msg1)
    db.session.add_all(reactions_msg3)
    db.session.add_all(reactions_msg5)
    db.session.commit()

def undo_reactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reactions"))
    db.session.commit()