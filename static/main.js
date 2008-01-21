var playlistqueue = 0;

function updateStatus(nowplaying, playlist) {
    var httpRequest = buildXmlHttpRequest();
    nowplaying.getElementById("playingsong").innerHTML = "Loading...";
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '/simpleajax/status', true);
    httpRequest.send('');
}

function addToPlaylist(path){
    var httpRequest = buildXmlHttpRequest();
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,false, parent.nowplaying.document, parent.playlist.document); };
    httpRequest.open('GET', '/simpleajax/addsong/' + path, true);
    httpRequest.send('');
}

function runCommand(cmd){
    var httpRequest = buildXmlHttpRequest();
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,false, document, parent.playlist.document); };
    httpRequest.open('GET', '/simpleajax/command/' + cmd, true);
    httpRequest.send('');
}

function updateStatusCallback(httpRequest,repeat, nowplaying, playlist) {

    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            xmlresponse = httpRequest.responseXML;
            root = xmlresponse.getElementsByTagName('root').item(0);

            //Display current song/volume
            nowplaying.getElementById("playingsong").innerHTML = xmlresponse.getElementsByTagName('currentsong')[0].childNodes[0].nodeValue;
            nowplaying.getElementById("volume").innerHTML = 'Volume: ' + xmlresponse.getElementsByTagName('volume')[0].childNodes[0].nodeValue;

            // Change text on Play/Pause Button
            if (xmlresponse.getElementsByTagName('state')[0].childNodes[0].nodeValue == '2'){
                nowplaying.getElementById("playpausebutton").value = "Pause";
            }else {
                nowplaying.getElementById("playpausebutton").value = "Play ";
            }

            //Update playlist
            stylePlaylist(xmlresponse.getElementsByTagName('playlistposition')[0].childNodes[0].nodeValue, -1, playlist);

	    //If playlistqueue is changed, update the playlist
	    current_playlistqueue = xmlresponse.getElementsByTagName('playlistqueue')[0].childNodes[0].nodeValue;
	    if (playlistqueue != current_playlistqueue){
		playlistqueue = current_playlistqueue;
		updatePlaylist(nowplaying, playlist, false);
	    }

            if (repeat){ //Now try this again in 10,000 microseconds
                setTimeout("updateStatus(document, parent.playlist.document);", 10000);
            }

        } else {
            nowplaying.getElementById("playingsong").innerHTML = "Check your network connection";
            if (repeat){
                setTimeout("updateStatus();", 5000);
            }
        }
    }
}

function updatePlaylist(nowplaying, playlist, repeat) {
    var httpRequest = buildXmlHttpRequest();
    httpRequest.onreadystatechange = function() { updatePlaylistCallback(httpRequest, repeat, nowplaying, playlist); };
    httpRequest.open('GET', '/simpleajax/playlist', true);
    httpRequest.send('');
}

function updatePlaylistCallback(httpRequest, repeat, nowplaying, playlist) {
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            playlist.getElementById("playlist").innerHTML = httpRequest.responseText;
            if (repeat){
                setTimeout("updatePlaylist(parent.nowplaying.document, document, true);", 30000);
            }
        } else {
            playlist.getElementById("playlist").innerHTML = "Check your network connection";
            if (repeat){
                setTimeout("updatePlaylist(document, parent.nowplaying.document," + repeat + ");", 5000);
            }
        }
    }
}

function clearSong(song_elem){
    song_elem.className = "selectedsong";
    song_elem.ondblclick = "";
    song_elem.innerHTML = "Loading...";
}

function move(songnum, dir){
    swapSongXmlRequest(songnum,parseInt(songnum)+parseInt(dir), parent.nowplaying.document, parent.playlist.document);
    cur_song = document.getElementById("song"+(songnum));
    targ_song = document.getElementById("song"+(parseInt(songnum)+parseInt(dir)));
    clearSong(cur_song);
    clearSong(targ_song);
}

function playSong(songnum){
    song = document.getElementById("song"+songnum);
    playSongXmlRequest(songnum, parent.nowplaying.document, document);
    stylePlaylist(-1,songnum,document);
}

function removeSong(songid,songnum){
    removeSongXmlRequest(songid, parent.nowplaying.document, document);
    song = document.getElementById("song"+songnum);
    clearSong(song)
}

function buildXmlHttpRequest(){
    var httpRequest;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    return httpRequest;
}

function playSongXmlRequest(songnum, nowplaying, playlist) {
    var httpRequest = buildXmlHttpRequest();
    nowplaying.getElementById("playingsong").innerHTML = "Loading...";

    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '/simpleajax/playsong/' + songnum, true);
    httpRequest.send('');
}

function removeSongXmlRequest(songnum, nowplaying, playlist) {
    var httpRequest = buildXmlHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '/simpleajax/removesong/' + songnum, true);
    httpRequest.send('');
}

function swapSongXmlRequest(song1,song2, nowplaying, playlist) {
    var httpRequest = buildXmlHttpRequest();
    nowplaying.getElementById("playingsong").innerHTML = "Loading...";

    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '/simpleajax/swapsong/' + song1 + "/"+song2, true);
    httpRequest.send('');
}

function stylePlaylist(songnum, selectedsong, doc) {
    var even = false;

    // obtain a reference to the desired list
    var lst = doc.getElementById('playlist');
    if (! lst) { return; }

    // by definition, lists can have multiple elements, so we'll have to get all my children (i.e. <li>'s)
    var lbodies = lst.getElementsByTagName("li");

    for (var h=0; h < lbodies.length; h++) { //Now loop over list elements, set class appropriately
        lbodies[h].className = even ? "even" : "odd";
        even =  ! even;
        if (h+1 == ( parseInt(songnum) )){
            lbodies[h].className = 'currentsong';
        }
        if (h == ( parseInt(selectedsong) )){
            lbodies[h].className = 'selectedsong';
        }

    }
}

