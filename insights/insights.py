from flask import (Blueprint,
                   render_template)

insights_bp = Blueprint(
    'insights_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display insights page
@insights_bp.route('/insights')
def showInsights():
    """Display insights page"""
    return render_template('insights.html')