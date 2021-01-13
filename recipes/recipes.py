from flask import (Blueprint,
                   render_template)

recipes_bp = Blueprint(
    'recipes_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display recipes page
@recipes_bp.route('/recipes')
def showRecipes():
    """Display recipes page"""
    return render_template('recipes.html')