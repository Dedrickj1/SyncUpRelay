from app.models import db, Server, environment, SCHEMA
from sqlalchemy.sql import text

def seed_servers():
    # 5 demo servers
    server1 = Server(name='SyncUp HQ', owner_id=1)
    server2 = Server(name='Coding Tips & Helpers', owner_id=2)
    server3 = Server(name='Gaming & Memes', owner_id=3)
    server4 = Server(name='Fantasy Football League', owner_id=1)
    server5 = Server(name='Weekend Coders', owner_id=2)

    # Add all servers to the session
    db.session.add(server1)
    db.session.add(server2)
    db.session.add(server3)
    db.session.add(server4)
    db.session.add(server5)
    
    # Commit the changes to the database
    db.session.commit()

def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM servers"))
        
    db.session.commit()