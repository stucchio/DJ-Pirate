// this function is need to work around
// a bug in IE related to element attributes
function hasClass(obj) {
    var result = false;
    if (obj.getAttributeNode("class") != null) {
	result = obj.getAttributeNode("class").value;
    }
    return result;
}

function stripe(id) {

    var even = false;

    var evenColor = arguments[1] ? arguments[1] : "#fff";
    var oddColor = arguments[2] ? arguments[2] : "#eee";

    // obtain a reference to the desired list
    var lst = document.getElementById(id);
    if (! lst) { return; }

    // by definition, lists can have multiple elements, so we'll have to get all my children (i.e. <li>'s)
    var lbodies = lst.getElementsByTagName("li");

    for (var h = 0; h < lbodies.length; h++) { //Now loop over list elements, set background appropriately
        if (!hasClass(lbodies[h]) && ! lbodies[h].style.backgroundColor) {
	    lbodies[h].style.backgroundColor = even ? evenColor : oddColor;
	    even =  ! even;
	}
    }
}
