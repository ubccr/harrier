from flask_script import Manager,prompt_bool,prompt
from harrier.core import db
import harrier.model as model

manager = Manager(usage="Perform database operations")

@manager.command
def drop():
    "Drops all database tables"
    if prompt_bool("**DANGER AREA** Are you sure you want to proceed?"):
        if prompt_bool("You are about to delete the ENTIRE database. Are you sure?"):
            db.drop_all()

@manager.command
def create():
    "Creates database tables"
    if prompt_bool("**DANGER AREA** Are you sure you want to proceed?"):
        if prompt_bool("You are about to create the ENTIRE database from scratch. Are you sure?"):
            db.create_all()

@manager.command
def rebuild():
    "Rebuild database tables"
    if prompt_bool("**DANGER AREA** Are you sure you want to proceed?"):
        if prompt_bool("You are about to rebuild the ENTIRE database from scratch. Are you sure?"):
            db.drop_all()
            db.create_all()
