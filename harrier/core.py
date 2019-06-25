from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class HarrierError(Exception):
    """Base error class."""

    def __init__(self, msg):
        self.msg = msg
