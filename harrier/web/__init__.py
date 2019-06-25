from flask import Flask
from ..core import db
from .views import bp

def create_app(config_file='harrier.cfg', settings_override=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('harrier.default_config')
    if config_file is not None:
        app.config.from_pyfile(config_file, silent=False)

    app.config.from_object(settings_override)

    db.init_app(app)

    app.register_blueprint(bp)
    
    return app
