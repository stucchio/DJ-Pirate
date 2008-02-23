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
         '/search', 'search',
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
    mpd = get_mpd()
    playlist = mpd.playlist()
    position = mpd.getPlaylistPosition()[0]
    return render.playlist(enumerate(clean_paths(playlist)), position)

def lsinfo(path):
    songs,dirs = [], []
    for s in get_mpd().ls_full([path,]):
        if isinstance(s,mpdclient.Song):
            songs += [s,]
        if isinstance(s,mpdclient.Directory):
            dirs += [s,]
    return songs,dirs

def clean_paths(lst):
    for o in lst:
        o.pathEsc = saxutils.escape(o.path)
        o.pathEscJS = o.pathEsc.replace("'","\\'")
    return lst

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
    commands = [ "prev", "next", "shuffle", "stop", "clear", "update"]
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
        print render.viewdir(clean_paths(songs),clean_paths(dirs), os.path.split(path)[0], "/" + path)

class search:
    def POST(self):
        word = web.input().word
        title_matches = clean_paths(get_mpd().search_for_songs("title",word))
        artist_matches = clean_paths(get_mpd().search_for_songs("artist",word))
        album_matches = clean_paths(get_mpd().search_for_songs("album",word))
        filename_matches = clean_paths(get_mpd().search_for_songs("filename",word))

        song_ids = [s.path for s in title_matches] + [s.path for s in artist_matches] + [s.path for s in album_matches]
        filename_matches = [s for s in filename_matches if not (s.path in song_ids)]


        for s in title_matches + artist_matches + album_matches + filename_matches: #The basepath is the path to the directory containing the file.
            s.basepath = saxutils.escape(os.path.dirname(s.path))
        if title_matches or artist_matches or album_matches or filename_matches: #If we actually have results, display them:
            print render.searchresults(title_matches, artist_matches, album_matches, filename_matches, word)
        else: #Otherwise, show the not found page.
            print render.searchnotfound(word)

class addsong:
    def GET(self,path):
        get_mpd().add([path,])
        print get_status_xml()


if __name__ == "__main__":
    web.webapi.internalerror = web.debugerror
    web.run(urls, globals(),web.reloader)
