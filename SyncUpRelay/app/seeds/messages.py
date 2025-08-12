from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text

def seed_messages():
    # Server 1, Channel 1 (general)
    messages_ch1 = [
        Message(text='Welcome to SyncUp HQ!', channel_id=1, user_id=1),
        Message(text='Glad to be here! This looks great.', channel_id=1, user_id=2),
    ]
    # Server 2, Channel 4 (python-help)
    messages_ch4 = [
        Message(text='Can anyone help me with a Flask IntegrityError?', channel_id=4, user_id=3),
        Message(text='Sure, what\'s the traceback? Usually that means a UNIQUE constraint failed.', channel_id=4, user_id=1),
    ]
    # Server 3, Channel 9 (off-topic)
    messages_ch9 = [
        Message(text='Anyone playing the new update tonight?', channel_id=9, user_id=2),
    ]
    # Server 4, Channel 14 (league-chat)
    messages_ch14 = [
        Message(text='Wow, what a trade! Can\'t believe that went through.', channel_id=14, user_id=1),
    ]
    # Server 5, Channel 19 (project-ideas)
    messages_ch19 = [
        Message(text='I have an idea for a new app, but not sure where to start.', channel_id=19, user_id=2),
    ]

    db.session.add_all(messages_ch1)
    db.session.add_all(messages_ch4)
    db.session.add_all(messages_ch9)
    db.session.add_all(messages_ch14)
    db.session.add_all(messages_ch19)
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))
    db.session.commit()