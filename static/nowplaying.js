Import = function(uri){
    document.write('<script src="' + uri +'" type="text/javascript"></script>\n');
}

Import("misc.js");

function updateStatus() {
    var httpRequest;
    document.getElementById("playingsong").innerHTML = "Loading...";
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
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true); };
    httpRequest.open('GET', '../simpleajax/status', true);
    httpRequest.send('');
}

function updateStatusCallback(httpRequest,repeat) {

    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            xmlresponse = httpRequest.responseXML;
            root = xmlresponse.getElementsByTagName('root').item(0);

            //Display current song/volume
            document.getElementById("playingsong").innerHTML = xmlresponse.getElementsByTagName('currentsong')[0].childNodes[0].nodeValue;
            document.getElementById("volume").innerHTML = 'Volume: ' + xmlresponse.getElementsByTagName('volume')[0].childNodes[0].nodeValue;

            // Change text on Play/Pause Button
            if (xmlresponse.getElementsByTagName('state')[0].childNodes[0].nodeValue == '2'){
                document.getElementById("playpausebutton").value = "Pause";
            }else {
                document.getElementById("playpausebutton").value = "Play ";
            }

            //Update playlist
            stylePlaylist(xmlresponse.getElementsByTagName('playlistposition')[0].childNodes[0].nodeValue, -1, parent.playlist.document);

            if (repeat){ //Now try this again in 20,000 microseconds
                setTimeout("updateStatus();", 20000);
            }

        } else {
            document.getElementById("playingsong").innerHTML = "Check your network connection";
            if (repeat){
                setTimeout("updateStatus();", 5000);
            }
        }
    }
}
