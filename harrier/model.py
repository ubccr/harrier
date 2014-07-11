import csv
import os
import datetime
from urlparse import urlparse
from flask import current_app
import flask_wtf
import flask_wtf.file
from werkzeug import secure_filename
from harrier.core import db
from marshmallow import Serializer, fields

class ImageSet(db.Model):
    __tablename__ = 'imageset'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    images = db.relationship("Image", backref=db.backref("imageset", lazy='joined'), lazy='joined')

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.now)

    @staticmethod
    def from_csv(file_stream, name=None, description=None):
        iset = ImageSet()
        iset.name = name
        iset.description = description

        reader = csv.reader(file_stream)
        count = 0
        for row in reader:
            if len(row) < 2: continue
            image = Image()
            image.name = row[0]
            image.url = row[1]
            if len(row) == 3:
                image.category = row[2]

            s = ImageSerializer(image)
            if not s.is_valid(['url']):
                continue

            if len(current_app.config['ALLOWED_DOMAINS']) > 0:
                u = urlparse(image.url)
                if u.netloc not in current_app.config['ALLOWED_DOMAINS']:
                    continue

            iset.images.append(image)
                    
            if count > current_app.config['MAX_IMAGES']:
                break

        return iset

    def __len__(self):
        return len(self.images)

    def __repr__(self):
        return '<ImageSet %r>' % (self.name)

class Image(db.Model):
    __tablename__ = 'image'

    id = db.Column(db.Integer, primary_key=True)
    imageset_id = db.Column(db.Integer, db.ForeignKey('imageset.id'))
    name = db.Column(db.String(255))
    url = db.Column(db.Text)
    category = db.Column(db.Text)
    targets = db.relationship("Target", backref=db.backref("image", lazy='joined'), lazy='joined')

    def __len__(self):
        return len(self.targets)

    def __repr__(self):
        return '<Image %r>' % (self.name)

class Target(db.Model):
    __tablename__ = 'target'

    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('image.id'))
    x = db.Column(db.Float)
    y = db.Column(db.Float)

    def __repr__(self):
        return '<Target %r>' % (self.name)

class TargetSerializer(Serializer):
    class Meta:
        additional = ('id', 'x', 'y')

class ImageSerializer(Serializer):
    targets = fields.Nested(TargetSerializer, many=True)
    url = fields.Url()
    class Meta:
        additional = ('id', 'name', 'category')

class ImageSetSerializer(Serializer):
    images = fields.Nested(ImageSerializer, many=True)
    class Meta:
        additional = ('id', 'name', 'description')

class ImageSetForm(flask_wtf.Form):
    input_file = flask_wtf.file.FileField('Import CSV File', validators=[flask_wtf.file.FileRequired('ERROR: Please provide a valid CSV file'), flask_wtf.file.FileAllowed(['csv'], 'ERROR: Invalid file extension. Allowed files: .csv')])

    def __init__(self, *args, **kwargs):
        flask_wtf.Form.__init__(self, *args, **kwargs)
        self.iset = None

    def validate(self):
        rv = flask_wtf.Form.validate(self)
        if not rv: return False

        self.iset = ImageSet.from_csv(self.input_file.data.stream)
        if len(self.iset) == 0:
            self.iset = None
            self.input_file.errors.append("ERROR: Invalid file format. No valid images found!")
            return False

        filename = secure_filename(self.input_file.data.filename)
        self.iset.name = os.path.splitext(os.path.basename(filename))[0]

        return True
