from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class ReactionForm(FlaskForm):
    emoji = StringField('emoji', validators=[DataRequired()])