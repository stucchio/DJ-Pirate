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


function stylePlaylist(songnum, selectedsong, doc) {
    var even = false;

    // obtain a reference to the desired list
    var lst = doc.getElementById('playlist');
    if (! lst) { return; }

    // by definition, lists can have multiple elements, so we'll have to get all my children (i.e. <li>'s)
    var lbodies = lst.getElementsByTagName("li");

    for (var h = 0; h < lbodies.length; h++) { //Now loop over list elements, set class appropriately
        lbodies[h].className = even ? "even" : "odd";
        even =  ! even;
        if (h+1 == ( parseInt(songnum) )){
            lbodies[h].className = 'currentsong';
        }
        if (h+1 == ( parseInt(selectedsong) )){
            lbodies[h].className = 'selectedsong';
        }

    }
}

