import web
import mpdclient

urls = ( '/', 'index',
         '/simpleajax/status', 'status',
         '/simpleajax/command/(.*)', 'command',
         '/simpleajax/playlist', 'playlist',
         '/simpleajax/playsong/([0-9]*)', 'playsong',
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
        status_str += "<currentsong>" + song.title + ", by " + song.artist + "</currentsong>\n"
    else:
        status_str += "<currentsong>" + "No song playing" + "</currentsong>\n"
    status_str += "<state>"+ str(mpd_status.state) + "</state>\n"
    status_str += "<volume>" + str(mpd_status.volume) + "</volume>"
    status_str += "<playlistposition>" + str(get_mpd().getPlaylistPosition()[0]) + "</playlistposition>\n"
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
        print render.viewdir(songs,dirs)


if __name__ == "__main__":
    web.webapi.internalerror = web.debugerror
    web.run(urls, globals(),web.reloader)
