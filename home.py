from flask import (Blueprint,
                   render_template)

home_bp = Blueprint(
    'home_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display front end for the whole site
@home_bp.route('/')
def showSiteIndex():
    """Display index page"""
    return render_template('home.html')

# Display about page
@home_bp.route('/about')
def showAbout():
    """Display about page"""
    return render_template('about.html')

# Display flag page
@home_bp.route('/flag')
def showFlag():
    """Display flag page"""
    return render_template('flag.html')