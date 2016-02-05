===============================================================================
harrier - touch screen image targeting
===============================================================================

Harrier is a point and share image library analysis tool. 

------------------------------------------------------------------------
Install
------------------------------------------------------------------------

To install harrier via pip::

    $ pip install harrier

Installing from source::
    
    $ git clone git://github.com/ubccr/harrier.git harrier
    $ cd harrier
    $ python setup.py install

------------------------------------------------------------------------
Quick Start
------------------------------------------------------------------------

0. Create database directory and configuration file::

    $ mkdir target-data
    $ cd target-data
    $ vim harrier.cfg
    import os
    _basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(_basedir, 'harrier.db')


1. Create empty databse, run the server::

    $ harrier -c /path/to/target-data/harrier.cfg db rebuild
    $ harrier -c /path/to/target-data/harrier.cfg runserver
    
2. Import image library. Upload an image library in CSV format.

3. Add Targets. Use the interface to click on image features. The coordinates
   of each target will be saved.

4. Share. Export the image feature targets and share with external services,
   for example an X-ray beam etc.

------------------------------------------------------------------------
Image Library CSV Format
------------------------------------------------------------------------

Image libraries can be imported in a simple CSV format. The fields are as
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
License
------------------------------------------------------------------------

harrier is released under the GNU General Public License ("GPL") Version 3.0.
See the LICENSE file.