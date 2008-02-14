import web
import mpdclient
import os
from xml.sax import saxutils

urls = ( '/', 'index',
         '/simpleajax/status', 'status',
         '/simpleajax/command/(.*)', 'command',
         '/simpleajax/playlist', 'playlist',
         '/simpleajax/playsong/([0-9]*)', 'playsong',
         '/simpleajax/removesong/([0-9]*)', 'removesong',
         '/simpleajax/swapsong/([0-9]*)/([0-9]*)', 'swapsong',
         '/simpleajax/addsong/(.*)', 'addsong',
         '/viewdir/(.*)', 'viewdir',
         )

render = web.template.render('templates/')

def get_mpd(host="192.168.1.5", port="6600"):
    return mpdclient.MpdController(host=host,port=6600)

def get_status_xml():
    song = get_mpd().getCurrentSong()
    mpd_status = get_mpd().status()
    status_str = "<?xml version=\"1.0\" ?> \n<root>\n"
    if song:
        if song.title.strip() != "" and song.artist.strip() != "": #If title and artist of current song are not whitespace, then return them
            status_str += "<currentsong>" + saxutils.escape(song.title) + ", by " + saxutils.escape(song.artist) + "</currentsong>\n"
        else: #Otherwise just return the path
            status_str += "<currentsong>" + saxutils.escape(song.path) + "</currentsong>\n"
    else:
        status_str += "<currentsong>" + "No song playing" + "</currentsong>\n"
    status_str += "<state>"+ saxutils.escape(str(mpd_status.state)) + "</state>\n"
    status_str += "<volume>" + saxutils.escape(str(mpd_status.volume)) + "</volume>\n"
    status_str += "<playlistqueue>" + saxutils.escape(str(mpd_status.playlist)) + "</playlistqueue>\n"
    status_str += "<playlistposition>" + saxutils.escape(str(get_mpd().getPlaylistPosition()[0])) + "</playlistposition>\n"
    status_str += "</root>\n"
    return status_str

def get_playist_xml():
    playlist = get_mpd().playlist()
    return render.playlist(enumerate(playlist), get_mpd().getPlaylistPosition()[0])

def lsinfo(path):
    songs,dirs = [], []
    for s in get_mpd().ls_full([path,]):
        if isinstance(s,mpdclient.Song):
            songs += [s,]
        if isinstance(s,mpdclient.Directory):
            dirs += [s,]
    return songs,dirs

class index:
    def GET(self):
        web.seeother("static/frames.html")

class status:
    def GET(self):
        print get_status_xml()

class playlist:
    def GET(self):
        print get_playist_xml()

class playsong:
    def GET(self,songnum):
        get_mpd().play(int(songnum))
        print get_status_xml()

class removesong:
    def GET(self,songnum):
        get_mpd().deleteid([int(songnum),])
        print get_status_xml()

class swapsong:
    def GET(self,song1,song2):
        get_mpd().swap(int(song1),int(song2))
        print get_status_xml()


class command:
    commands = [ "prev", "next", "shuffle", "stop", "clear"]
    tougher_commands = [ "voldown", "volup", "pause", "play"]

    def GET(self,command):
        if command in self.commands: getattr(get_mpd(), command)()
        if command in self.tougher_commands: getattr(self, command)()
        print get_status_xml()

    def play(self):
        if get_mpd().status().state < 2:
            get_mpd().play(get_mpd().getPlaylistPosition()[0])
        else:
            get_mpd().play()

    def pause(self):
        state = get_mpd().status().state
        if  state < 2:
            get_mpd().play(get_mpd().getPlaylistPosition()[0])
        if state == 2:
            get_mpd().pause()
        else:
            get_mpd().play()


    def voldown(self):
        get_mpd().volume( 5 * int((get_mpd().status().volume - 5)/5))

    def volup(self):
        get_mpd().volume( 5 * int((get_mpd().status().volume + 5)/5))

class viewdir:
    def GET(self,path):
        songs,dirs = lsinfo(path)
        for d in dirs: #Add javascript-escaped versions of the path.
            d.pathEsc = saxutils.escape(d.path)
        for s in songs:
            s.pathEsc = saxutils.escape(s.path)
        print render.viewdir(songs,dirs, os.path.split(path)[0])

class addsong:
    def GET(self,path):
        get_mpd().add([path,])
        print get_status_xml()


if __name__ == "__main__":
    web.webapi.internalerror = web.debugerror
    web.run(urls, globals(),web.reloader)
