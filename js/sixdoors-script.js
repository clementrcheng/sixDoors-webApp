/* Web application using SixDoors REST-API and Handlebars.js for templating. */

var query
,   lastIndex
,   data
,   parentPath
,   result
,   root = "https://api-staging.sixdoors.com/v1"
,   source
,   template
,   xhr
;

/* Get the HTML source and compile it */
source = document.getElementById('template').innerHTML;
template = Handlebars.compile(source);

/* Makes a XMLHttpRequest object with @method and @uri as the call method and uri, respectively.
Connects with the SD REST API, takes the responseText JSON data and populates the appropriate template html file. */

var makeApiCall = function (method, uri) {
    xhr = new XMLHttpRequest();
    xhr.open(method, uri, true);
    //xhr.setRequestHeader("6D-Client", "Web-Consumer(#buildnumber)");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                result = xhr.responseText;
                data = jQuery.parseJSON(result);
                document.getElementById('main').innerHTML = template(data);
            }
            else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };
};

/* Uses the query portion of the current uri as parameters for a function call to makeApiCall. */

window.onload = function(){
    query = window.location.href.split('?')[1];
    if(!query){
        query = "/feed_entries";
    }
    makeApiCall("GET", root + query);
}

var loadWindow = function(class_name, id, title) {
    lastIndex = window.location.pathname.lastIndexOf("/");
    parentPath = window.location.pathname.substring(0, lastIndex);
    window.location.href = parentPath + "/sixdoors-feed-items-template.html" + "?/" + class_name + "/" + id + "/feed_items" + "?" + title;
};

/* Helper function to get the collection title from the query portion of the uri. */

Handlebars.registerHelper("getTitle", function(){
    return decodeURI(window.location.href.split('?')[2]);
});