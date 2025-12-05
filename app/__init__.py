from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

from app.models import db
from app.utils import setup_test_db


def create_app():
    app = Flask(__name__,
                static_folder='static',
                template_folder='templates')

    app.config['APP_ENV'] = os.environ.get('APP_ENV', 'PROD')

    if app.config['APP_ENV'] == 'DEV':
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DEV_DATABASE_URI')
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'SECRET-DEV-KEY'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    db.init_app(app)

    with app.app_context():
        if app.config['APP_ENV'] == 'DEV':
            setup_test_db(app)
        else:
            db.create_all()

    from app.routes import register_routes
    register_routes(app)

    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
