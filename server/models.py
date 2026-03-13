from flask_sqlalchemy import SQLAlchemy
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(256), unique=True, nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    name = db.Column(db.String(256))
    avatar_url = db.Column(db.String(512))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    comparisons = db.relationship('Comparison', backref='user', lazy=True)

class Comparison(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Nullable for free try
    type = db.Column(db.String(50)) # 'reference' or 'two_ppt'
    ppt1_name = db.Column(db.String(256))
    ppt2_name = db.Column(db.String(256))
    score = db.Column(db.Float)
    summary = db.Column(db.Text)
    full_result = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    user = db.relationship(User)
