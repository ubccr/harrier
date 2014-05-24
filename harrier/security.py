from functools import wraps
import flask

def check_auth():
    if not flask.current_app.config['BASIC_AUTH']:
        return True

    auth = flask.request.authorization
    if not auth:
        return False

    if auth.username not in flask.current_app.config['USERS']:
        return False

    if auth.password != flask.current_app.config['USERS'][auth.username]:
        return False

    return True

def authenticate():
    return flask.Response('Login required', 401, {'WWW-Authenticate': 'Basic realm="Harrier"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not check_auth():
            return authenticate()
        return f(*args, **kwargs)
    return decorated
