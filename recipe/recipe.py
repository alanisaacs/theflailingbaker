from flask import (Blueprint,
                   jsonify,
                   render_template,
                   request)
from flask_login import login_required
from sqlalchemy import (asc,
                        desc)

from models import (open_db_session,
                    model_classes,
                    Procedure,
                    Substeps,
                    Tools,
                    Variables)

recipe_bp = Blueprint(
    'recipe_bp', __name__,
    static_folder='static',
    template_folder='templates'
    )

# Display recipe page
@recipe_bp.route('/recipe')
def showRecipes():
    """Display recipe page"""
    DBSession = open_db_session()
    procedure = DBSession.query(Procedure).order_by('step_id').all()
    substeps = DBSession.query(Substeps).order_by('substep_id').all()
    variables = DBSession.query(Variables).order_by('variable_id').all()
    DBSession.close()
    return render_template(
        'recipe.html', 
        procedure = procedure,
        substeps = substeps,
        variables = variables)

# Display recipe page in editing mode
@recipe_bp.route('/recipe/recipe_edit')
@login_required
def editRecipe():
    """Display recipe page in editing mode"""
    DBSession = open_db_session()
    procedure = DBSession.query(Procedure).order_by('step_id').all()
    substeps = DBSession.query(Substeps).order_by('substep_id').all()
    variables = DBSession.query(Variables).order_by('variable_id').all()
    DBSession.close()
    return render_template(
        'recipe_edit.html', 
        procedure = procedure,
        substeps = substeps,
        variables = variables)

# Display tools page
@recipe_bp.route('/recipe/tools')
def showTools():
    """Display tools page"""
    DBSession = open_db_session()
    tools = DBSession.query(Tools).order_by('id').all()
    DBSession.close()
    return render_template('tools.html', tools=tools)

# Display tools page in editing mode
@recipe_bp.route('/recipe/tools_edit')
@login_required
def editTools():
    """Display tools page in editing mode"""
    DBSession = open_db_session()
    tools = DBSession.query(Tools).order_by('id').all()
    DBSession.close()
    return render_template('tools_edit.html', tools=tools)

@recipe_bp.route('/update_cell', methods=['POST'])
def update_cell():
    """Update the DB with data sent from page"""
    # data is in form {tableid: <string>, record_id: <int>, 
    #     <col_head>:<newtext>}
    d = request.json
    tableid = d.pop('tableid')
    record_id = d.pop('record_id')
    if len(d) == 1:
        for k in d:
            col_head = k
            newtext = d[k] 
    DBSession = open_db_session()
    # Query from table (class name from model_classes)
    # getting primary key (id)
    record_to_update = DBSession.query(
        model_classes[tableid]).get(record_id)
    setattr(record_to_update, col_head, newtext)
    DBSession.commit()
    DBSession.close()
    return {'status':'ok'}