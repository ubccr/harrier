#==============================================================================
# Harrier default configuration
#==============================================================================

#------------------------------------------------------------------------------
# Flask application and database settings
#------------------------------------------------------------------------------
DEBUG = False
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
DATABASE_CONNECT_OPTIONS = {}
SECRET_KEY='secret'
CACHE_VERSION=1404745082

#------------------------------------------------------------------------------
# Harrier app settings
#------------------------------------------------------------------------------

# Image width and height used in computing plate coordinates
IMAGE_WIDTH=632
IMAGE_HEIGHT=504

# Resolution of images in millimeters/pixel
MU=0.003

# Plate left margin in millimeters
MARGIN_X=11.005

# Plate top margin in millimeters
MARGIN_Y=7.865

# Spacing between wells in millimeters
WELL_SPACING=2.25

# Wells per row
WELLS_PER_ROW=48

# Max number of images allowed in an image set
MAX_IMAGES=100

# By default Harrier will load images from any domain (URL). Set this option 
# to restrict images to specific trusted sites.
ALLOWED_DOMAINS=[]

# Default target shape. Valid values are circle or square
DEFAULT_SHAPE='square'

# By default there is no security in Harrier. This means anyone using the app
# can add targets. Set this to true to restrict editing of images to value
# USERS.
BASIC_AUTH=False

# If BASIC_AUTH is true this should be set to define valid users. Format is:
# USERS={
#    'username': 'password'
# }
USERS={}
