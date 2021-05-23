from flask import (Blueprint,
                   jsonify,
                   render_template,
                   request)
from flask_login import login_required
from sqlalchemy import (asc,
                        desc)

from models import (Tools,
                    open_db_session) 

recipes_bp = Blueprint(
    'recipes_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display recipes page
@recipes_bp.route('/recipes')
def showRecipes():
    """Display recipes page"""
    #DBSession = open_db_session()
    #tools = DBSession.query(Tools).order_by('id').all()
    #DBSession.close()
    return render_template('recipes.html')

# Display tools page
@recipes_bp.route('/recipes/tools')
def showTools():
    """Display tools page"""
    DBSession = open_db_session()
    tools = DBSession.query(Tools).order_by('id').all()
    DBSession.close()
    return render_template('tools.html', tools=tools)

# Display tools page in editing mode
@recipes_bp.route('/recipes/tools_edit')
@login_required
def editTools():
    """Display tools page in editing mode"""
    DBSession = open_db_session()
    tools = DBSession.query(Tools).order_by('id').all()
    DBSession.close()
    return render_template('tools_edit.html', tools=tools)

@recipes_bp.route('/update_cell', methods=['POST'])
def update_cell():
    """ Update the DB with data sent from page """
    # data is in form {id: <num>, <col_head>:<newtext>}
    d = request.json
    record_id = d.pop('id')
    if len(d) == 1:
        for k in d:
            col_head = k
            newtext = d[k] 
    DBSession = open_db_session()
    # Query from table getting primary key (id)
    record_to_update = DBSession.query(Tools).get(record_id)
    setattr(record_to_update, col_head, newtext)
    DBSession.commit()
    DBSession.close()
    return {'status':'ok'}