Import = function(uri){
    document.write('<script src="' + uri +'" type="text/javascript"></script>\n');
}

Import("misc.js");

function updateStatus(nowplaying, playlist) {
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
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,true, nowplaying,playlist); };
    httpRequest.open('GET', '../simpleajax/status', true);
    httpRequest.send('');
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
    httpRequest.onreadystatechange = function() { updateStatusCallback(httpRequest,false, document, parent.playlist.document); };
    httpRequest.open('GET', '../simpleajax/command/' + cmd, true);
    httpRequest.send('');
}
