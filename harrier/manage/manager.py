import logging
import csv
import os
from flask_script import Manager,Shell,prompt
from flask import current_app
from harrier.web import create_app
from harrier.core import db
import harrier.model as model
from harrier.manage.database import manager as db_mgr 

def _make_context():
    return dict(app=create_app, db=db, model=model)

logging.basicConfig(
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.WARN
)

manager = Manager(create_app, with_default_commands=False)
manager.add_option('-c', '--config', dest='config_file', required=False)
manager.add_command("db", db_mgr)
manager.add_command("shell", Shell(make_context=_make_context))

@manager.command
def runserver(host='127.0.0.1'):
    "Run stand alone test server"
    logging.getLogger().setLevel(logging.INFO)
    db.create_all()
    current_app.run(host=host, debug=False)

@manager.command
def load(file=None):
    "Load data from file"
    if file is None:
        print("Please provide an input file")
        return 1

    path = os.path.splitext(os.path.basename(file))[0]
    name = prompt("Name", default=path)
    description = prompt("Description", default='')
    if len(description) == 0:
        description = None

    with open(file, 'rb') as fh:
        iset = model.ImageSet.from_csv(fh, name=name, description=description)
        if len(iset) == 0:
            print("Invalid file format. No images found!")
            return 1

    db.session.add(iset)
    db.session.commit()

def main():
    manager.run()

if __name__ == "__main__":
    main()
