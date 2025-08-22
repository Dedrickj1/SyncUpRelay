import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_socketio import SocketIO
from werkzeug.middleware.proxy_fix import ProxyFix
from .models import db, User
from .config import Config
from .seeds import seed_commands

# --- Pre-initialization ---
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        "https://syncuprelay.onrender.com"
    ]
else:
    origins = "*"

# --- App, Extension, and Config Setup ---
app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')
app.wsgi_app = ProxyFix(app.wsgi_app)

login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

app.cli.add_command(seed_commands)
app.config.from_object(Config)
db.init_app(app)
Migrate(app, db)
CORS(app)

# --- Initialize SocketIO with Eventlet ---
socketio = SocketIO(app, cors_allowed_origins=origins, async_mode='eventlet')

# --- Import and Register Blueprints ---
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.server_routes import server_routes
from .api.channel_routes import channel_routes
from .api.message_routes import message_routes
from .api.reaction_routes import reaction_routes

app.register_blueprint(user_routes, url_prefix='/api')
app.register_blueprint(auth_routes, url_prefix='/api')
app.register_blueprint(server_routes, url_prefix='/api')
app.register_blueprint(channel_routes, url_prefix='/api')
app.register_blueprint(message_routes, url_prefix='/api')
app.register_blueprint(reaction_routes, url_prefix='/api')

# --- Import Socket Event Handlers ---
from .sockets import *

# --- Request Hooks and Final Routes ---
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True
    )
    return response

@app.route("/api/docs")
def api_help():
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return route_list

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
