from flask import (Blueprint,
                   jsonify,
                   render_template,
                   request)

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
    DBSession = open_db_session()
    tools = DBSession.query(Tools).all()
    # for t in tools:
    #     print(f"======= ID LIST ======= {t.id}")
    DBSession.close()
    return render_template('recipes.html', tools=tools)

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