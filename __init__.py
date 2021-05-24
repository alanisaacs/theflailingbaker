#!/usr/bin/env python3

"""Initialize Flask application framework for The Flailing Baker"""
import os

from flask import Flask
from flask_login import LoginManager

from auth.routes import auth_bp
from blog.blog import blog_bp
from home import home_bp
from insights.insights import insights_bp
from loaflog.loaflog import loaflog_bp
from models import (open_db_session,
                    User)
from recipe.recipe import recipe_bp

# Create Flask app
app = Flask(__name__)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(blog_bp)
app.register_blueprint(home_bp)
app.register_blueprint(insights_bp)
app.register_blueprint(loaflog_bp)
app.register_blueprint(recipe_bp)

# Set Flask app configs from environment variables
# TODO: Make sure to make new variables for this site
app.env = os.environ.get('FLASK_ENV')
app.secret_key = os.environ.get('FLASK_SECRET_KEY')

# Initialize LoginManager
login_manager = LoginManager()
login_manager.login_view = '/login'
login_manager.login_message = 'Access requires logging in'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    DBSession = open_db_session()
    user = DBSession.query(User).get(int(user_id))
    DBSession.close()
    return user

# Run the app
if __name__ == '__main__':
    app.run()
