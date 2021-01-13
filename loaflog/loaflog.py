from flask import (Blueprint,
                   render_template)

loaflog_bp = Blueprint(
    'loaflog_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display loaflog page
@loaflog_bp.route('/loaflog')
def showLoaflog():
    """Display loaflog page"""
    return render_template('loaflog.html')