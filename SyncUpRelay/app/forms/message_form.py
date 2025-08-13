from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class MessageForm(FlaskForm):
    text = StringField('text', validators=[DataRequired(), Length(min=1, max=2000)])
