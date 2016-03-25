===============================================================================
Harrier - touch screen image targeting
===============================================================================

.. image:: docs/harrier-logo.jpg

------------------------------------------------------------------------
What is Harrier?
------------------------------------------------------------------------

Harrier is a point and share image library analysis tool. 

------------------------------------------------------------------------
Install
------------------------------------------------------------------------

Installing from source::
    
    $ git clone git://github.com/ubccr/harrier.git harrier
    $ cd harrier
    $ pip install -r requirements.txt
    $ python setup.py install

Run Harrier in Docker container::

    $ docker build -t harrier .
    $ docker run -it --rm --name harrier \
         -p 5000:5000 harrier runserver --host=0.0.0.0

------------------------------------------------------------------------
Quick Start
------------------------------------------------------------------------

*Note* Any targets you create will be stored in memory only. To store targets
in a database see next section. 

1. Run the harrier web server::

    $ harrier runserver
    [INFO]  * Running on http://127.0.0.1:5000/

2. Open your web browser to http://127.0.0.1:5000/
    
3. Import image set library. Upload an image set library in CSV format.

4. Add Targets. Use the interface to click on image features. The coordinates
   of each target will be saved.

5. Share. Export the image feature targets and share with external services,
   for example an X-ray beam etc.

------------------------------------------------------------------------
Save results to sqlite database
------------------------------------------------------------------------

1. First create database directory and configuration file::

    $ mkdir target-data
    $ cd target-data
    $ vim harrier.cfg
    import os
    _basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(_basedir, 'harrier.db')

2. Create empty databse, run the server::

    $ harrier -c /path/to/target-data/harrier.cfg db rebuild
    $ harrier -c /path/to/target-data/harrier.cfg runserver
    [INFO]  * Running on http://127.0.0.1:5000/
    
3. Open your web browser to http://127.0.0.1:5000/ and load image set. Any targets
   you add will be saved to the harrier.db sqlite database and persist after
   Harrier is shutdown.

------------------------------------------------------------------------
Image Set CSV Format
------------------------------------------------------------------------

Image set libraries can be imported in a simple CSV format. The fields are as
follows::

    [image name],[image url],[category]

The last field (category) is optional. For example, lysozyme images from plate
X000014542 are stored in a file called X000014542-images.csv::

    1488,http://localhost/drops/X000014542/X0000145421488201407081119.jpg
    1175,http://localhost/drops/X000014542/X0000145421175201407081123.jpg
    61,http://localhost/drops/X000014542/X0000145420061201407081137.jpg

See the data/ directory from the harrier source distribution. To import from
the command line run::

    $ harrier -c /path/to/target-data/harrier.cfg load -f X000014542-images.csv

------------------------------------------------------------------------
Run using uWSGI
------------------------------------------------------------------------

To run Harrier using uWSGI::

    $ pip install uwsgi
    $ cd [path to harrier]
    $ uwsgi --socket 127.0.0.1:5000 --protocol=http -w wsgi:application

------------------------------------------------------------------------
License
------------------------------------------------------------------------

Harrier is released under the GNU General Public License ("GPL") Version 3.0.
See the LICENSE file.
