var lastInfoWindow; //tracks the last info window to open

window.onload = function(){
    initializeRoute("Dallas, TX", "Austin, TX");
    initializeNearby();
    initializeSearch("Plano, TX");
}

//create Road Map and directions
function initializeRoute(start, end) {
    var geocoder = new google.maps.Geocoder();
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

            for (var count = 0; restrooms && count <= restrooms.length(); count++){
                var title = restrooms[count]['title'];
                var stars = restrooms[count]['stars'];
                var lat = restrooms[count]['lat'];
                var lng = restrooms[count]['long'];
                var icons = restrooms[count]['icons'];
                var location = new google.maps.LatLng(lat, lng);
innerloop:      for (index in path){
                    if (Math.pow(lat - path[index].lat(),2) + Math.pow(lng - path[index].lng(),2) <= 0.1){
                        var marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: title
                        });
                        attachInfo(map, marker, title, stars, icons);
                        break innerloop;    //breaks the innerloop so that the same marker isn't added twice
                    }
                }
            }
        }
    });
}

function GeoLocateSuccess(position){
    createNearbyMap(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 1);   //geolocate user's current position
}

function GeoLocateError(msg){
    alert("Geolocation error: " + msg.code + "\nCould not get your current location, defaulting to Dallas, Texas.");
    createNearbyMap(new google.maps.LatLng(32.779193,-96.800537), 0);
}

//create nearby Restrooms
function initializeNearby() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(GeoLocateSuccess,GeoLocateError);
    }
    else{
        alert("Could not get your current location, defaulting to Dallas, Texas.");
        createNearbyMap(new google.maps.LatLng(32.779193,-96.800537), 0);
    }
}

function createNearbyMap(center, success){
    var mapOptions = {
        center: center,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas_2"), mapOptions);

    var restrooms = getRestrooms1(center);   //get Restrooms from Database

    for (var count = 0; restrooms && count <= restrooms.length(); count++){
        var title = restrooms[count]['title'];
        var stars = restrooms[count]['stars'];
        var lat = restrooms[count]['lat'];
        var lng = restrooms[count]['long'];
        var icons = restrooms[count]['icons'];
        var location = new google.maps.LatLng(lat, lng);

        //add if statement to check icons if we do that

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title
        });
        attachInfo(map, marker, title, stars, icons);

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

//create Search
function initializeSearch(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            createSearchMap(results[0].geometry.location, address);
        }
        else {
            alert("Sorry. We were unable to find that location.\nError: " + status);
        }
    });
}

function createSearchMap(coords, address){
    var mapOptions = {
        center: coords,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas_3"), mapOptions);

    var restrooms = getRestrooms1(coords);   //get Restrooms from Database

    for (var count = 0; restrooms && count <= restrooms.length(); count++){
        var title = restrooms[count]['title'];
        var stars = restrooms[count]['stars'];
        var lat = restrooms[count]['lat'];
        var lng = restrooms[count]['long'];
        var icons = restrooms[count]['icons'];
        var location = new google.maps.LatLng(lat, lng);

        //add if statement to check icons if we do that

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title
        });
        attachInfo(map, marker, title, stars, icons);

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

    title += "<br>";

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
}

//query database for Restrooms nearby 1 location
function getRestrooms1(location){
    var request = new XMLHttpRequest();
    request.open("GET", "../Database/phpscript/get_lat_long.php?latitude="+location.lat()+"&longitude="+location.lng()+"&radius=10", false);
    request.send();

    if(request.status === 200){
        return $.parseJSON(request.responseText);
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
    request.open("GET", "../Database/phpscript/get_lat_long.php?latitude="+centerLat+"&longitude="+centerLng+"&radius="+distance+10, false);
    request.send();

    if(request.status === 200){
        return $.parseJSON(request.responseText);
    }
    else {
        alert("Error Retrieving Restrooms: " + request.status);
        return null;
    }
}