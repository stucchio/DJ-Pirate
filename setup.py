#!/Library/Frameworks/Python.framework/Versions/Current/bin/python

from distutils.core import setup

setup(name='djpirate',
      version='0.1',
      description='D.J. Pirate',
      author='Chris Stucchio',
      author_email='stucchio@cims.nyu.edu',
      url='http://cims.nyu.edu/~stucchio',
      packages=['djpirate', 'djpirate.web', 'djpirate.web.wsgiserver'],
      package_dir={'djpirate': 'djpirate'},
      package_data={'djpirate': ['templates/*.html', 'static/*.html', 'static/*.js', 'static/*.css', 'static/*.png']},
      scripts=['start_djpirate.py',],
     )
