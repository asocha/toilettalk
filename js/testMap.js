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
        zoom: 8,
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
            var icons;
            for (var count = 0; count <= 2; count++){
                var location = new google.maps.LatLng(lats[count], longs[count]);
innerloop:      for (index in path){
                    if (Math.pow(location.lat() - path[index].lat(),2) + Math.pow(location.lng() - path[index].lng(),2) <= 0.1){
                        var marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: titles[count]
                        });
                        attachInfo(map, marker, titles[count], stars[count], icons);
                        break innerloop;    //breaks the innerloop so that the same marker isn't added twice
                    }
                }
            }
        }
    });
}

//create nearby Restrooms
function initializeNearby() {
    var centerLocation = new google.maps.LatLng(32.8442304, -96.7856456);

    var mapOptions = {
        center: centerLocation,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //render map
    var map = new google.maps.Map(document.getElementById("map_canvas_2"), mapOptions);

    var titles = ["McDonalds", "Chick-fil-a", "Pizza Hut"];
    var stars = [4, 5, 3];
    var lats = [31, 32, 33];
    var longs = [-95, -96, -97];
    var icons;
    for (var count = 0; count <= 2; count++){
        var location = new google.maps.LatLng(lats[count], longs[count]);
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: titles[count]
        });
        attachInfo(map, marker, titles[count], stars[count], icons);
    }
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

    title += "icons go here";
    //add icons
    for (var count = 1; count <= 6; count++){
        //title += "<img class=\'icon\' src=\'img/star.png\'>";
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