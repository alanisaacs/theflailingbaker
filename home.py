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

