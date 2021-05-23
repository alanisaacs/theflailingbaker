#!/usr/bin/env python3

""" Database models for TFB Apps """

import os

from flask_login import UserMixin
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse

# Define class to map to db table
Base = declarative_base()

# Define procedure table as class
class Procedure(Base):
    __tablename__ = 'procedure'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    description = Column(Text)
    notes = Column(Text)

# Define tools table as class
class Tools(Base):
    __tablename__ = 'tools'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    description = Column(Text)
    notes = Column(Text)

class User(UserMixin, Base):
    """Registered user information"""
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), nullable=False)
    password = Column(String(1024))

# Create interface to db without connecting
# TODO: Use env var for pw
#pw = os.getenv('TFB_DB_USER_PW')
#pw_encoded = urllib.parse.quote_plus(pw)
pw = '7liminE##'
pw_encoded = urllib.parse.quote_plus(pw)
engine = create_engine('postgresql://whitman:' + pw_encoded + \
    '@localhost/tfb')
# Create a session (not a connection, more a "workspace" for objects)
open_db_session = sessionmaker(bind=engine)
# To be made available throughout the app using syntax:
# from models import open_db_session
# DBSession = open_db_session()