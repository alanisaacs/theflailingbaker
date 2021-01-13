#!/usr/bin/env python3

"""Initialize Flask application framework for The Flailing Baker"""
import os

from flask import Flask

from home import home_bp
from blog.blog import blog_bp
from insights.insights import insights_bp
from loaflog.loaflog import loaflog_bp
from recipes.recipes import recipes_bp

# Create Flask app
app = Flask(__name__)

# Register Blueprints
app.register_blueprint(home_bp)
app.register_blueprint(blog_bp)
app.register_blueprint(insights_bp)
app.register_blueprint(loaflog_bp)
app.register_blueprint(recipes_bp)

# Set Flask app configs from environment variables
# TODO: Make sure to make new variables for this site
app.env = os.environ.get('FLASK_ENV')
app.secret_key = os.environ.get('FLASK_SECRET_KEY')

# Run the app
if __name__ == '__main__':
    app.run()
