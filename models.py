#!/usr/bin/env python3

""" Database models for TFB Apps """

import os

from flask_login import UserMixin
from sqlalchemy import (create_engine, 
                        Column, 
                        ForeignKey,
                        Integer, 
                        String, 
                        Text)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import urllib.parse

# Define class to map to db table
Base = declarative_base()

# Define procedure table as class
class Procedure(Base):
    __tablename__ = 'procedure'
    step_id = Column(Integer, primary_key=True)
    step = Column(Integer)
    name = Column(Text)
    description = Column(Text)
    notes = Column(Text)

# Define substeps table as class
class Substeps(Base):
    __tablename__ = 'substeps'
    substep_id = Column(Integer, primary_key=True)
    substep = Column(Integer)
    description = Column(Text)
    step_id = Column(Integer, ForeignKey('procedure.step_id'))
    procedure = relationship(Procedure)
    
# Define tools table as class
class Tools(Base):
    __tablename__ = 'tools'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    description = Column(Text)
    notes = Column(Text)

# Define variables table as class
class Variables(Base):
    __tablename__ = 'variables'
    variable_id = Column(Integer, primary_key=True)
    name = Column(Integer)
    description = Column(Text)
    notes = Column(Text)
    step_id = Column(Integer, ForeignKey('procedure.step_id'))
    procedure = relationship(Procedure)

# Define metrics table as class
class Metrics(Base):
    __tablename__ = 'metrics'
    metric_id = Column(Integer, primary_key=True)
    name = Column(Integer)
    description = Column(Text)
    notes = Column(Text)
    step_id = Column(Integer, ForeignKey('procedure.step_id'))
    procedure = relationship(Procedure)

# Define users table as class
class User(UserMixin, Base):
    """Registered user information"""
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), nullable=False)
    password = Column(String(1024))

# Create interface to db without connecting
pw = os.getenv('TFB_DB_USER_PW')
pw_encoded = urllib.parse.quote_plus(pw)
engine = create_engine('postgresql://tfb_dbuser:' + pw_encoded + \
    '@localhost/tfb')
# Create a session (not a connection, more a "workspace" for objects)
open_db_session = sessionmaker(bind=engine)
# To be made available throughout the app using syntax:
#     from models import open_db_session
#     DBSession = open_db_session()
# Create a dictionary with the class names as values
# to be retrieved with keys corresponding to html table ids
model_classes = {'procedure' : Procedure, 'substeps' : Substeps, 
    'tools' : Tools, 'variables' : Variables, 'metrics' : Metrics}