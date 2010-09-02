=========
DJ Pirate
=========

D.J. Pirate is a webapp which you use to control music player daemon. Then you can use nearly any web browser (it must support javascript) to control your music. So just take out your Nexus 1 or iPhone and use it as a remote control for your music.

URL: http://cims.nyu.edu/~stucchio/software/djpirate/index.html

Installing
==========

Download the latest version. Then::

    $ tar -xvzf djpirate-0.1.tar.gz
    $ cd djpirate
    $ python setup.py build
    $ sudo python setup.py install

Or you can get it from the public git repo::

    git@github.com:stucchio/DJ-Pirate.git


Using
=====

Make sure mpd is running, and accepts connections from 127.0.0.1. Then:

    $ run start_djpirate.py

Finally, point a javascript-enabled web browser at http://yourIPaddress:8080. The rest should be self explanatory.

Security
========

I’m a firm believer in security through obscurity. D.J. Pirate is intended for use on a local wireless network (hopefully encrypted). In all likelihood, no one within 50 meters of your house really wants to hack you. If you run this on a computer with public access to the internet, someone will use it to play some great songs at 3AM. You will deserve it.

FAQ
===

How do I turn it off?
---------------------
::

    killall start_djpirate.py

This is ugly. Can I change it?
------------------------------

Look in the djpirate module in your python library. There are folders “templates” and “static”. You can modify the html/templates.

I found a bug.
--------------

Ok, email me about it. Feel free to send a patch. stucchio@gmail.com

Don’t other programs like this exist?
-------------------------------------

Yes. I wrote this one for the following reasons:
* I wanted to learn how to write a webapp.
* I couldn’t figure out how to make most of the others work (but I didn’t put a lot of effort in).
* phpMp is ugly (but otherwise very functional).
