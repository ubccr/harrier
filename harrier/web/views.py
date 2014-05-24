import flask
import csv
import cStringIO
from harrier.core import db
import harrier.model as model

bp = flask.Blueprint('views', __name__)

@bp.route('/')
def index():
    form = model.ImageSetForm()
    offset = flask.request.args.get('offset', 0, type=int)
    limit = flask.request.args.get('limit', 20, type=int)
    sets = model.ImageSet.query.order_by(model.ImageSet.created_at).offset(offset).limit(limit)
    return flask.render_template('index.html', sets=sets, form=form)

@bp.route('/about')
def about():
    return flask.render_template('about.html')

@bp.route('/import', methods=['POST'])
def import_file():
    form = model.ImageSetForm()
    if form.validate_on_submit():
        db.session.add(form.iset)
        db.session.commit()
        flask.flash("Successfully imported {} images".format(len(form.iset)))
    else:
        flask.flash(', '.join(form.errors['input_file']))

    return flask.redirect(flask.url_for('views.index'))

@bp.route('/image/<int:id>')
def image_targets(id):
    image = model.Image.query.filter_by(id=id).first_or_404()
    return flask.render_template('targets.html', image=image)

@bp.route('/image/<int:id>/export')
def image_export(id):
    image = model.Image.query.filter_by(id=id).first_or_404()

    def generate():
        queue = cStringIO.StringIO()
        writer = csv.writer(queue)
        writer.writerow(['x', 'y', 'image_name', 'image_category'])
        data = queue.getvalue()
        queue.truncate(0)
        yield data
        for t in image.targets:
            writer.writerow([t.x, t.y, image.name, image.category])
            data = queue.getvalue()
            queue.truncate(0)
            yield data

    return flask.Response(generate(), mimetype='text/plain')

@bp.route('/imageset/<int:id>/target')
def add_targets(id):
    iset = model.ImageSet.query.filter_by(id=id).first_or_404()
    iid = flask.request.args.get('iid', 0, type=int)
    index = 0
    match = [i for i,image in enumerate(iset.images) if image.id == iid]
    if len(match) == 1:
        index = match[0]

    return flask.render_template('add_targets.html', iset=iset, index=index)

@bp.route('/imageset/<int:id>/export')
def imageset_export(id):
    iset = model.ImageSet.query.filter_by(id=id).first_or_404()

    def generate():
        queue = cStringIO.StringIO()
        writer = csv.writer(queue)
        writer.writerow(['x', 'y', 'image_name', 'image_category'])
        data = queue.getvalue()
        queue.truncate(0)
        yield data
        for image in iset.images:
            for t in image.targets:
                writer.writerow([t.x, t.y, image.name, image.category])
                data = queue.getvalue()
                queue.truncate(0)
                yield data

    return flask.Response(generate(), mimetype='text/plain')

@bp.route('/imageset/<int:id>')
def results(id):
    iset = model.ImageSet.query.filter_by(id=id).first_or_404()
    return flask.render_template('results.html', iset=iset)

@bp.route('/data/imageset/<int:id>')
def imageset(id):
    iset = model.ImageSet.query.filter_by(id=id).first_or_404()
    return flask.jsonify(model.ImageSetSerializer(iset).data)

@bp.route('/data/image/<int:id>', methods=['GET'])
def image(id):
    image = model.Image.query.filter_by(id=id).first_or_404()
    return flask.jsonify(model.ImageSerializer(image).data)

@bp.route('/data/image/<int:id>/target/add', methods=['POST'])
def image_target_add(id):
    image = model.Image.query.filter_by(id=id).first_or_404()
    try:
        x = int(flask.request.form['x'])
        y = int(flask.request.form['y'])
        target = model.Target()
        target.x = x
        target.y = y
        image.targets.append(target)

        db.session.add(image)
        db.session.commit()
    except:
        return flask.jsonify({'error': True}), 400
        
    return flask.jsonify({'error': False})

@bp.route('/data/image/<int:id>/target/del', methods=['DELETE'])
def image_target_del(id):
    image = model.Image.query.filter_by(id=id).first_or_404()
    image.targets = []
    db.session.add(image)
    db.session.commit()
    return flask.jsonify({'error': False})

@bp.route('/data/image/<int:id>/category', methods=['POST'])
def image_category(id):
    image = model.Image.query.filter_by(id=id).first_or_404()
    image.category = flask.request.form['cat']
    db.session.add(image)
    db.session.commit()
    return flask.jsonify({'error': False})
