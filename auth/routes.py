""" Views and logic for TFB authentication """

import hashlib
import uuid

from flask import (Blueprint,
                   flash,
                   redirect,
                   render_template,
                   request,
                   session as login_session,
                   url_for)
from flask_login import (login_required,
                         login_user,
                         logout_user)


from models import (open_db_session,
                    User)


auth_bp = Blueprint(
    'auth_bp', __name__,
    static_folder='static',
    static_url_path='/auth/static',
    template_folder='templates'
    )


# Log In Existing User
@auth_bp.route('/login', methods=['GET', 'POST'])
def tfbLogin():
    """Log in as existing user"""
    # Simplest flow
    # Validate submission
    if request.method == 'POST':
        # Get User associated with user in db
        DBSession = open_db_session()
        user = DBSession.query(User).filter_by(username = request.form['username']).one_or_none()
        DBSession.close()
        # Show error if username not found
        if not user:
            flash("Username not found! Please try again.", "messageError")
            return render_template('/login.html')
        # Confirm password matches hashed version
        pwMatch = check_password(user.password, request.form['password'])
        if pwMatch:
            login_user(user)
            flash("Login successful!", "messageSuccess")
            return redirect(url_for('home_bp.showSiteIndex'))
        else:
            flash("Incorrect password! Please try again.", "messageError")
            return render_template('login.html')
    # Display form
    else:
        return render_template('/login.html')

# Log out user
@auth_bp.route('/logout')
@login_required
def tfbLogout():
    """ Remove the username from the session if it's there """
    logout_user()
    flash('Log out successful!', 'messageSuccess')
    return redirect(url_for('home_bp.showSiteIndex'))

def hash_password(password):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt

def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()
 
# Manage Users
@auth_bp.route('/usermgmt')
@login_required
def tfbUserMgmt():
    """ Manage users """
    return render_template('/usermgmt.html')

# Create new user
@auth_bp.route('/tfbNewUser', methods=['GET', 'POST'])
@login_required
def tfbNewUser():
    """ Create new user with hashed password in db """
    if request.method == 'POST':
        DBSession = open_db_session()
        # Make sure requested username is unique
        username = request.form['username']
        user_exists = DBSession.query(User).filter_by(
            username=username).first()
        if user_exists:
            flash('Username is taken. Please choose another.', 'messageError')
            DBSession.close()
            return redirect(url_for('auth_bp.tfbUserMgmt'))
        # Hash password with salt
        hashed_pw = hash_password(request.form['password'])
        # create new user in database
        newuser = User(
            username = username,
            password = hashed_pw,
        )
        DBSession.add(newuser)
        DBSession.commit()
        DBSession.close()
        flash("Account successfully created.", "messageSuccess")
        return render_template('/usermgmt.html')
    else:
        return redirect(url_for("auth_bp.tfbLogin"))
