from .db import db, environment, SCHEMA
from sqlalchemy.sql import func

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(2000), nullable=False)
    
    # Foreign Keys
    channel_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.channels.id" if environment == "production" else "channels.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.users.id" if environment == "production" else "users.id"), nullable=False)
    
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    # Relationships
    channel = db.relationship("Channel", back_populates="messages")
    user = db.relationship("User", back_populates="messages")
    reactions = db.relationship("Reaction", back_populates="message", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'channelId': self.channel_id,
            'userId': self.user_id,
            'userName': self.user.username, 
            'createdAt': self.created_at.isoformat(),
            'reactions': [reaction.to_dict() for reaction in self.reactions]
        }
