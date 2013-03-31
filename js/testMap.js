//create Road Map and directions
function initializeRoute() {
    var start = new google.maps.LatLng(32.8442304, -96.7856456);
    var end = new google.maps.LatLng(31, -97);

    //create route
    var directions = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var mapOptions = {
        center: start,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map and directions
    var renderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    renderer.setMap(map);
    renderer.setPanel(document.getElementById("directions"));

    //render route overlay
    var service = new google.maps.DirectionsService();
    service.route(directions, function(result,status){
        if (status === google.maps.DirectionsStatus.OK){
            renderer.setDirections(result);

            var path = result["routes"][0]["overview_path"];    //Array of LatLng that are positions along route

            var titles = ["McDonalds", "Chick-fil-a", "Pizza Hut"];
            var stars = [4, 5, 3];
            var lats = [31, 32, 33];
            var longs = [-95, -96, -97];
            var icons = [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1]];
            for (var count = 0; count <= 2; count++){
                var location = new google.maps.LatLng(lats[count], longs[count]);
innerloop:      for (index in path){
                    if (Math.pow(location.lat() - path[index].lat(),2) + Math.pow(location.lng() - path[index].lng(),2) <= 0.1){
                        var marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: titles[count]
                        });
                        attachInfo(map, marker, titles[count], stars[count], icons[count]);
                        break innerloop;    //breaks the innerloop so that the same marker isn't added twice
                    }
                }
            }
        }
    });
}

function GeoLocateSuccess(position){
    createNearbyMap(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));   //geolocate user's current position
}

function GeoLocateError(msg){
    alert("Geolocation error: " + msg.code + "\nCould not get your current location, defaulting to Dallas, Texas.");
    createNearbyMap(new google.maps.LatLng(32.779193,-96.800537));
}

//create nearby Restrooms
function initializeNearby() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(GeoLocateSuccess,GeoLocateError);
    }
    else{
        alert("Could not get your current location, defaulting to Dallas, Texas.");
        createNearbyMap(new google.maps.LatLng(32.779193,-96.800537));
    }
}

function createNearbyMap(center){
    var mapOptions = {
        center: center,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas_2"), mapOptions);

    var titles = ["McDonalds", "Chick-fil-a", "Pizza Hut"];
    var stars = [4, 5, 3];
    var lats = [31, 32, 33];
    var longs = [-95, -96, -97];
    var icons = [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1]];
    for (var count = 0; count <= 2; count++){
        //add if statement to check icons
        var location = new google.maps.LatLng(lats[count], longs[count]);
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: titles[count]
        });
        attachInfo(map, marker, titles[count], stars[count], icons[count]);

        //zoom map so only a few markers are visible
        while (map.getBounds().contains(location)){
            map.setZoom(map.getZoom() + 1);
        }
    }
    map.setZoom(map.getZoom() - 2);
}

//add Info Window for when user clicks on a map marker
function attachInfo(map, marker, title, stars, icons){
    title = "<h1 class='restroomName'>" + title + "</h1>";

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

    var infoWindow = new google.maps.InfoWindow({
        content: title,
        size: new google.maps.Size(50,50)
    });
    google.maps.event.addListener(marker, 'click', function() {
        if (window.lastInfoWindow){
            lastInfoWindow.close(); //closes the last info window that opened, ensuring only one is open at a time
        }
        infoWindow.open(map,marker);
        lastInfoWindow = infoWindow;
    });
}

window.onload = function(){
    window.lastInfoWindow; //tracks the last info window to open

    initializeRoute();
    initializeNearby();
}