from .db import db, environment, SCHEMA
from sqlalchemy.sql import func

class Reaction(db.Model):
    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    emoji = db.Column(db.String, nullable=False)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.users.id" if environment == "production" else "users.id"), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey(f"{SCHEMA}.messages.id" if environment == "production" else "messages.id"), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = db.relationship("User", back_populates="reactions")
    message = db.relationship("Message", back_populates="reactions")

    def to_dict(self):
        return {
            'id': self.id,
            'emoji': self.emoji,
            'userId': self.user_id,
            'messageId': self.message_id
        }