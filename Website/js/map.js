var lastInfoWindow; //tracks the last info window to open
var geocoder;

window.onload = function(){
    geocoder = new google.maps.Geocoder();
    initializeNearby();

    //remaining code only runs on website, not on Android
    if(document.getElementById("SearchButton")){
        document.getElementById("SearchButton").addEventListener('click',function(){initializeSearch(document.getElementById('location').value);},false);
        document.getElementById("NearbyButton").addEventListener('click',initializeNearby,false);
        document.getElementById("RouteButton").addEventListener('click',function(){initializeRoute(document.getElementById('origin').value,document.getElementById('destination').value);},false);
        document.getElementById("register").addEventListener('click',function(){register();},false);
        document.getElementById("login").addEventListener('click',function(){login();},false);
        document.getElementById("home").addEventListener('click',function(){home();},false);
        var options = {types: ['geocode']};
        var autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('location'),options);
        var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('origin'),options);
        var autocomplete3 = new google.maps.places.Autocomplete(document.getElementById('destination'),options);

        //prevent the autocomplete boxes from messing with the div sizes
        //done via event listeners because the autocomplete divs wont exist until a few seconds after the page loads
        var event1 = document.getElementById('location').addEventListener('click',function(){
            document.getElementsByClassName('pac-container')[0].addEventListener('mouseover',function(){
                document.getElementById("Search").style.height="250px";
            },false);
            document.getElementsByClassName('pac-container')[0].addEventListener('mouseout',function(){
                document.getElementById("Search").style.height="";
            },false);
            document.getElementsByClassName('pac-container')[0].addEventListener('click',function(){
                document.getElementById("Search").style.height="";
            },false);

            document.removeEventListener('click', event1);
        },false);
        var event2 = document.getElementById('origin').addEventListener('click',function(){
            document.getElementsByClassName('pac-container')[1].addEventListener('mouseover',function(){
                document.getElementById("RoadTrip").style.height="250px";
            },false);
            document.getElementsByClassName('pac-container')[1].addEventListener('mouseout',function(){
                document.getElementById("RoadTrip").style.height="";
            },false);
            document.getElementsByClassName('pac-container')[1].addEventListener('click',function(){
                document.getElementById("RoadTrip").style.height="";
            },false);

            document.removeEventListener('click', event2);
        },false);
        var event3 = document.getElementById('destination').addEventListener('click',function(){
            document.getElementsByClassName('pac-container')[2].addEventListener('mouseover',function(){
                document.getElementById("RoadTrip").style.height="250px";
            },false);
            document.getElementsByClassName('pac-container')[2].addEventListener('mouseout',function(){
                document.getElementById("RoadTrip").style.height="";
            },false);
            document.getElementsByClassName('pac-container')[2].addEventListener('click',function(){
                document.getElementById("RoadTrip").style.height="";
            },false);

            document.removeEventListener('click', event3);
        },false);
    }
}


/* ROAD MAP CREATION */

//create Road Map and directions
function initializeRoute(start, end) {
    //clear Restrooms list
    var nav = document.getElementsByClassName("Restrooms")[0];
    if (nav) nav.innerHTML = "";

    geocoder.geocode( { 'address': start}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            geocoder.geocode( { 'address': end}, function(results2, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    createRoute(results[0].geometry.location, results2[0].geometry.location);
                }
                else {
                    alert("Sorry. We were unable to find that Destination.\nError: " + status);
                }
            });
        }
        else {
            alert("Sorry. We were unable to find that Origin.\nError: " + status);
        }
    });
}

function createRoute(start, end){
    //create route
    var directions = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var mapOptions = {
        center: start,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var renderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    renderer.setMap(map);
    //renderer.setPanel(document.getElementById("directions")); //render directions

    //render route overlay
    var service = new google.maps.DirectionsService();
    service.route(directions, function(result,status){
        if (status === google.maps.DirectionsStatus.OK){
            renderer.setDirections(result);

            var path = result["routes"][0]["overview_path"];    //Array of LatLng that are positions along route

            var restrooms = getRestrooms2(start, end);   //get Restrooms from Database

            for (var count = 0; restrooms && count < restrooms.length; count++){
                var stars = restrooms[count]['avg_rating'];
                var lat = restrooms[count]['latitude'];
                var lng = restrooms[count]['longitude'];
                var icons = restrooms[count]['icons'];
                var location = new google.maps.LatLng(lat, lng);

innerloop:      for (index in path){
                    if (Math.pow(lat - path[index].lat(),2) + Math.pow(lng - path[index].lng(),2) <= 10000){ //was 0.1
                        var marker = new google.maps.Marker({
                            position: location,
                            map: map
                        });

                        geocodeMarker(map, marker, location, stars, icons);
                        break innerloop;    //breaks the innerloop so that the same marker isn't added twice
                    }
                }
            }
        }
    });
}


/* NEARBY MAP CREATION */

function GeoLocateSuccess(position){
    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //geolocate user's current position
    var mapOptions = {
        center: center,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var listener = google.maps.event.addListener(map, 'tilesloaded', function(event) {
        createNearbyMap(map, center, 1);
        google.maps.event.removeListener(listener);
    });
}

function GeoLocateError(msg){
    alert("Geolocation error: " + msg.code + "\nCould not get your current location, defaulting to Dallas, Texas.");
    var center = new google.maps.LatLng(32.779193,-96.800537);
    var mapOptions = {
        center: center,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var listener = google.maps.event.addListener(map, 'tilesloaded', function(event) {
        createNearbyMap(map, center, 0);
        google.maps.event.removeListener(listener);
    });
}

//create nearby Restrooms
function initializeNearby() {
    //clear Restrooms list
    var nav = document.getElementsByClassName("Restrooms")[0];
    if (nav) nav.innerHTML = "";

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(GeoLocateSuccess,GeoLocateError);
    }
    else{
        alert("Could not get your current location, defaulting to Dallas, Texas.");
        var center = new google.maps.LatLng(32.779193,-96.800537);
        var mapOptions = {
            center: center,
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        //render map
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        var listener = google.maps.event.addListener(map, 'tilesloaded', function(event) {
            createNearbyMap(map, center, 0);
            google.maps.event.removeListener(listener);
        });
    }
}

function createNearbyMap(map, center, success){
    var restrooms = getRestrooms1(center);   //get Restrooms from Database
    
    for (var count = 0; restrooms && count < restrooms.length; count++){
        var stars = restrooms[count]['avg_rating'];
        var lat = restrooms[count]['latitude'];
        var lng = restrooms[count]['longitude'];
        var icons = restrooms[count]['icons'];
        var location = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        geocodeMarker(map, marker, location, stars, icons);
        
        //zoom map so only a few markers are visible
        while (map.getBounds() && map.getBounds().contains(location) && map.getZoom() < 18){
            map.setZoom(map.getZoom() + 1);
        }
    }
    map.setZoom(map.getZoom() - 2);

    //add You Are Here marker
    if (success){
        var marker = new google.maps.Marker({
            position: center,
            map: map,
            icon: "img/you_are_here.png",
            title: "You Are Here"
        });
    }
}


/* SEARCH MAP CREATION */

//create Search
function initializeSearch(address) {
    //clear Restrooms list
    var nav = document.getElementsByClassName("Restrooms")[0];
    if (nav) nav.innerHTML = "";
    
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var coords = results[0].geometry.location;
            var mapOptions = {
                center: coords,
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //render map
            var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            var listener = google.maps.event.addListener(map, 'tilesloaded', function(event) {
                createSearchMap(map, coords, address);
                google.maps.event.removeListener(listener);
            });
        }
        else {
            alert("Sorry. We were unable to find that location.\nError: " + status);
        }
    });
}

function createSearchMap(map, coords, address){
    var restrooms = getRestrooms1(coords);   //get Restrooms from Database

    for (var count = 0; restrooms && count < restrooms.length; count++){
        var stars = restrooms[count]['avg_rating'];
        var lat = restrooms[count]['latitude'];
        var lng = restrooms[count]['longitude'];
        var icons = restrooms[count]['icons'];
        var location = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        geocodeMarker(map, marker, location, stars, icons);

        //zoom map so only a few markers are visible
        while (map.getBounds() && map.getBounds().contains(location) && map.getZoom() < 18){
            map.setZoom(map.getZoom() + 1);
        }
    }
    map.setZoom(map.getZoom() - 2);

    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: "img/you_are_here.png",
        title: address
    });
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
    title = "<h1 class='restroomName'>" + title + "</h1>";

    //title += "<img class='restroom_image' src=img/" + image + ">";

    //add stars
    for (var count = 1; count <= 5; count++){
        if (stars >= count){
            title += "<img class='star' src='img/star.png'>";
        }
        else{
            title += "<img class='star' src='img/transparentStar.png'>";
        }
    }

    title += "<br><br>";
/*
    //add icons
    if (icons[0]){
        title += "<img class='icon' src='img/icon_men.jpg'>";
    }
    if (icons[1]){
        title += "<img class='icon' src='img/icon_women.jpg'>";
    }
    if (icons[2]){
        title += "<img class='icon' src='img/icon_handicap.jpg'>";
    }
    if (icons[3]){
        title += "<img class='icon' src='img/icon_24.jpg'>";
    }
    if (icons[4]){
        title += "<img class='icon' src='img/icon_diaper.jpg'>";
    }
    if (icons[5]){
        title += "<img class='icon' src='img/icon_pay.jpg'>";
    }
*/
    var infoWindow = new InfoBox({
        content: title
    });
    google.maps.event.addListener(marker, 'click', function() {
        if (lastInfoWindow){
            lastInfoWindow.close(); //closes the last info window that opened, ensuring only one is open at a time
        }
        infoWindow.open(map,marker);
        lastInfoWindow = infoWindow;
    });

    //add Restroom to the side navigation list
    var nav = document.getElementsByClassName("Restrooms")[0];
     if (nav) nav.innerHTML += title;
}

//query database for Restrooms nearby 1 location
function getRestrooms1(location){
    var request = new XMLHttpRequest();
    request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/restrooms/method/location/longitude/"+location.lng()+"/latitude/"+location.lat()+"/radius/10000", false);
    request.send();

    if(request.status === 200 && request.responseText){
        alert(request.responseText);
        return $.parseJSON(request.responseText);
    }
    else if (!request.responseText){
        alert("Sorry. Your search returned no restrooms.")
    }
    else {
        alert("Error Retrieving Restrooms: " + request.status);
        return null;
    }
}

//query database for Restrooms nearby 2 locations (start/end of a route)
function getRestrooms2(location1, location2){
    var centerLat = (location1.lat() + location2.lat()) / 2;
    var centerLng = (location1.lng() + location2.lng()) / 2;
    var distance = Math.sqrt(Math.pow(location1.lat() - location2.lat(),2) + Math.pow(location1.lng() + location2.lng(), 2)) * 69.055;

    var request = new XMLHttpRequest();
    request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/restrooms/method/location/longitude/"+centerLng+"/latitude/"+centerLat+"/radius/"+(distance+10000), false);
    request.send();

    if(request.status === 200 && request.responseText){
        return $.parseJSON(request.responseText);
    }
    else if (!request.responseText){
        alert("Sorry. Your search returned no restrooms.")
    }
    else {
        alert("Error Retrieving Restrooms: " + request.status);
        return null;
    }
}