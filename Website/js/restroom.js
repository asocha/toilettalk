var lastInfoWindow; //tracks the last info window to open
var geocoder;

window.onload = function(){
    geocoder = new google.maps.Geocoder();

	initializeLogin();

    createSearchMap();
}

/* MAP CREATION */

function createSearchMap(){
    var restroom = getRestroom();   //get Restroom from Database

    var stars = restroom['final_average'];
    var lat = restroom['latitude'];
    var lng = restroom['longitude'];
    var icons = [];
    icons[0] = restroom['sum(unisex)'];
    icons[1] = restroom['sum(handicap_accessible)'];
    icons[2] = restroom['sum(diaper_changing_station)'];
    icons[3] = restroom['sum(24_hour)'];
    icons[4] = restroom['sum(customer_only)'];
    var location = new google.maps.LatLng(lat, lng);

    var mapOptions = {
        center: location,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    geocodeMarker(map, marker, location, stars, icons);
}

//geocode a marker's location and then set it's title and info window
function geocodeMarker(map, marker, location, stars, icons){
    geocoder.geocode( { 'latLng': location}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            marker.setTitle(results[0].formatted_address);
            attachInfo(map, marker, results[0].formatted_address, stars, icons);
        }
        else {
            attachInfo(map, marker, location, stars, icons);
        }
    });
}

//add Info Window for when user clicks on a map marker
function attachInfo(map, marker, title, stars, icons){
    var html = "";
    html += "<h1 class='restroomName'>" + title + "</h1>";

    //html += "<img class='restroom_image' src=img/" + image + ">";

    //add stars
    for (var count = 1; count <= 5; count++){
        if (stars >= count){
            html += "<img class='star' src='img/star.png'>";
        }
        else{
            html += "<img class='star' src='img/transparentStar.png'>";
        }
    }
    
    html += "<br />";

/*
    //add icons
    if (icons[0]){
        html += "<img class='icon' src='img/icon_men.jpg'>";
    }
    if (icons[1]){
        html += "<img class='icon' src='img/icon_women.jpg'>";
    }
    if (icons[2]){
        html += "<img class='icon' src='img/icon_handicap.jpg'>";
    }
    if (icons[3]){
        html += "<img class='icon' src='img/icon_24.jpg'>";
    }
    if (icons[4]){
        html += "<img class='icon' src='img/icon_diaper.jpg'>";
    }
    if (icons[5]){
        html += "<img class='icon' src='img/icon_pay.jpg'>";
    }
*/

    html += "<br /><br />";

    var infoWindow = new InfoBox({
        content: html
    });
    google.maps.event.addListener(marker, 'click', function() {
        if (lastInfoWindow){
            lastInfoWindow.close(); //closes the last info window that opened, ensuring only one is open at a time
        }
        infoWindow.open(map,marker);
        lastInfoWindow = infoWindow;
    });
}

//query database for Restrooms nearby 1 location
function getRestroom(){
    var id = getUrlVars()["id"];

    var request = new XMLHttpRequest();
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/restroombyid/rrid/"+id, false);
    //request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/restroombyid/method/location/rrid/"+id, false);
    request.send();

    if(request.status === 200 && request.responseText){
        return $.parseJSON(request.responseText);
    }
    else if (!request.responseText){
        alert("Somehow you tried to view a restroom that doesn't exist.");
        return null;
    }
    else {
        alert("Error Retrieving Restroom: " + request.status);
        return null;
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}