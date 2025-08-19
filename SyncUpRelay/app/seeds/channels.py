from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text

def seed_channels():
    # --- Channels for Server 1: SyncUp HQ ---
    channels_server1 = [
        Channel(name='general', server_id=1, owner_id=1),
        Channel(name='announcements', server_id=1, owner_id=1),
        Channel(name='dev-team-chat', server_id=1, owner_id=1),
        Channel(name='random', server_id=1, owner_id=1),
        Channel(name='project-planning', server_id=1, owner_id=1)
    ]

    # --- Channels for Server 2: Coding Tips & Helpers ---
    channels_server2 = [
        Channel(name='python-help', server_id=2, owner_id=2),
        Channel(name='react-redux-help', server_id=2, owner_id=2),
        Channel(name='study-group-lobby', server_id=2, owner_id=2),
        Channel(name='code-reviews', server_id=2, owner_id=2),
        Channel(name='pair-programming', server_id=2, owner_id=2)
    ]

    # --- Channels for Server 3: Gaming & Memes ---
    channels_server3 = [
        Channel(name='off-topic', server_id=3, owner_id=3),
        Channel(name='voice-chat-1', server_id=3, owner_id=3),
        Channel(name='looking-for-group', server_id=3, owner_id=3),
        Channel(name='screenshots', server_id=3, owner_id=3),
        Channel(name='tech-support', server_id=3, owner_id=3)
    ]
    
    # --- Channels for Server 4: Fantasy Football League ---
    channels_server4 = [
        Channel(name='league-chat', server_id=4, owner_id=1),
        Channel(name='trade-talk', server_id=4, owner_id=1),
        Channel(name='waiver-wire', server_id=4, owner_id=1),
        Channel(name='matchups', server_id=4, owner_id=1),
        Channel(name='commissioner-updates', server_id=4, owner_id=1)
    ]

    # --- Channels for Server 5: Weekend Coders ---
    channels_server5 = [
        Channel(name='project-ideas', server_id=5, owner_id=2),
        Channel(name='show-your-work', server_id=5, owner_id=2),
        Channel(name='ask-for-help', server_id=5, owner_id=2),
        Channel(name='resources', server_id=5, owner_id=2),
        Channel(name='coffee-chat', server_id=5, owner_id=2)
    ]

    # Add all channels to the session
    db.session.add_all(channels_server1)
    db.session.add_all(channels_server2)
    db.session.add_all(channels_server3)
    db.session.add_all(channels_server4)
    db.session.add_all(channels_server5)
    
    # Commit the changes
    db.session.commit()

def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))
        
    db.session.commit()