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
            stylePlaylist(xmlresponse.getElementsByTagName('playlistposition')[0].childNodes[0].nodeValue);

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

function stylePlaylist(songnum) {
    var even = false;

    // obtain a reference to the desired list
    var lst = parent.playlist.document.getElementById('playlist');
    if (! lst) { return; }

    // by definition, lists can have multiple elements, so we'll have to get all my children (i.e. <li>'s)
    var lbodies = lst.getElementsByTagName("li");

    for (var h = 0; h < lbodies.length; h++) { //Now loop over list elements, set class appropriately
        lbodies[h].className = even ? "even" : "odd";
        even =  ! even;
        if (h+1 == ( parseInt(songnum) )){
            lbodies[h].className = 'currentsong';
        }
    }
}


function runCommand(cmd){
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
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,false); };
    httpRequest.open('GET', '../simpleajax/command/' + cmd, true);
    httpRequest.send('');
}

