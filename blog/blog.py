from flask import (Blueprint,
                   render_template)

blog_bp = Blueprint(
    'blog_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display blog page
@blog_bp.route('/blog')
def showBlog():
    """Display blog page"""
    return render_template('blog.html')