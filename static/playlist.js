Import = function(uri){
    document.write('<script src="' + uri +'" type="text/javascript"></script>\n');
}

Import("misc.js");

function updatePlaylist() {
    var httpRequest;
    //document.getElementById("playlist").innerHTML = "Loading...";
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
    httpRequest.onreadystatechange = function() { updatePlaylistCallback(httpRequest,true); };
    httpRequest.open('GET', '../simpleajax/playlist', true);
    httpRequest.send('');
}

function updatePlaylistCallback(httpRequest,repeat,nowplaying,playlist) {

    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            document.getElementById("playlist").innerHTML = httpRequest.responseText;
            //stripe('playlist', 'rgb(245,245,245)', 'rgb(220,220,255)')

            if (repeat){
                setTimeout("updatePlaylist();", 25000);
            }

        } else {
            document.getElementById("playlist").innerHTML = "Check your network connection";
            if (repeat){
                setTimeout("updatePlaylist();", 5000);
            }
        }
    }
}

function playSong(songnum){
    song = document.getElementById("song"+songnum);
    playSongXmlRequest(songnum, parent.nowplaying.document, document);
    stylePlaylist(-1,songnum,document);
}

function playSongXmlRequest(songnum, nowplaying, playlist) {
    var httpRequest;
    nowplaying.getElementById("playingsong").innerHTML = "Loading...";
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
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '../simpleajax/playsong/' + songnum, true);
    httpRequest.send('');
}
