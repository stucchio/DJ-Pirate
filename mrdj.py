import web
import mpdclient

urls = ( '/', 'index',
         '/simpleajax/status', 'status',
         '/simpleajax/command/(.*)', 'command',
         )


def get_mpd(host="192.168.1.5", port="6600"):
    return mpdclient.MpdController(host=host,port=6600)

def get_status_xml():
    song = get_mpd().getCurrentSong()
    mpd_status = get_mpd().status()
    status_str = "<?xml version=\"1.0\" ?> \n" + "<root>"
    if song:
        status_str += "<currentsong>" + song.title + ", by " + song.artist + "</currentsong>"
    else:
        status_str += "<currentsong>" + "No song playing" + "</currentsong>"
    status_str += "<state>"+ str(mpd_status.state) + "</state>"
    status_str += "<volume>" + str(mpd_status.volume) + "</volume>" + "</root>"
    return status_str

class index:
    def GET(self):
        web.seeother("static/frames.html")

class status:
    def GET(self):
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
        if get_mpd().status().state < 2:
            get_mpd().play(get_mpd().getPlaylistPosition()[0])
        else:
            get_mpd().play()


    def voldown(self):
        get_mpd().volume( 5 * int((get_mpd().status().volume - 5)/5))

    def volup(self):
        get_mpd().volume( 5 * int((get_mpd().status().volume + 5)/5))


if __name__ == "__main__":
    web.webapi.internalerror = web.debugerror
    web.run(urls, globals(),web.reloader)
