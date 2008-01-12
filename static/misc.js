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

            if (repeat){ //Now try this again in 20,000 microseconds
                setTimeout("updateStatus(document, parent.playlist.document);", 20000);
            }

        } else {
            nowplaying.getElementById("playingsong").innerHTML = "Check your network connection";
            if (repeat){
                setTimeout("updateStatus();", 5000);
            }
        }
    }
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

