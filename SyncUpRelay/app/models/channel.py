from .db import db, environment, SCHEMA
from sqlalchemy.sql import func

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Foreign Key to the servers table
    server_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.servers.id" if environment == "production" else "servers.id"), nullable=False)
    
    # Foreign Key to the users table
    owner_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.users.id" if environment == "production" else "users.id"), nullable=False)
    
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    
    # Defines the relationship to the Server model
    server = db.relationship("Server", back_populates="channels")
    messages = db.relationship("Message", back_populates="channel", cascade="all, delete-orphan")
    owner = db.relationship("User", back_populates="owned_channels")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'serverId': self.server_id,
            'ownerId': self.owner_id
        }