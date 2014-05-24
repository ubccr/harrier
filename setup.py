from setuptools import setup, find_packages

VERSION = '0.1.0'

setup(
    name='harrier',
    description='harrier - touch screen image targeting',
    long_description='',
    author='Andrew E. Bruno',
    url='https://github.com/ubccr/harrier',
    license='GNU General Public License v3 (GPLv3)',
    author_email='aebruno2@buffalo.edu',
    version=VERSION,
    include_package_data=True,
    packages=find_packages(exclude=['tests*']),
    package_data={'harrier': ['data/*.csv']},
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'flask-script',
        'flask-wtf',
        'marshmallow',
    ],
    entry_points='''
        [console_scripts]
        harrier=harrier.manage.manager:main
    ''',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Programming Language :: Python',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Topic :: Scientific/Engineering :: Bio-Informatics',
     ]
)
