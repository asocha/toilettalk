var user_id;
var geocoder;
var origins = [];
var destinations = [];

window.onload = function(){
	geocoder = new google.maps.Geocoder();

	document.getElementById("logout").addEventListener('click',function(){logout();},false);
	checklogin();

	load_saved_restrooms();
	load_saved_routes();
	load_reviewed_restroom();
}

function logout(){
	var request = new XMLHttpRequest();
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/logout", false);
	request.send();
	window.location = "index.html";
}

function load_saved_routes(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/routesbyid/id/"+user_id, false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		
		for(var i= 0; i<jsonResponse.length;i++){
			var ul = document.getElementById("routes_list");
			var li = document.createElement('li');  
			li.className=jsonResponse[i].route_id;
			li.className+="*"+jsonResponse[i].origin;
			li.className+="*"+jsonResponse[i].destination;
			li.addEventListener('click',function(){redirect_to_route(this);},false);
			li.innerHTML += "<em>Origin</em>: "+jsonResponse[i].origin;
			li.innerHTML += "<br />";
			li.innerHTML += "<em>Destination</em>: "+jsonResponse[i].destination;
			ul.appendChild(li);
		}
	}
}

function load_reviewed_restroom(){
	var request = new XMLHttpRequest();

	request.open("GET", "../API_Server/index.php/api/toilettalkapi/restroombyuid/uid/"+user_id, false);
	request.send();

	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		
		for(var i= 0; i<jsonResponse.length;i++){
			var address="";
			var id =jsonResponse[i].restroom_id;
			var latlng = new google.maps.LatLng(jsonResponse[i].latitude,jsonResponse[i].longitude);
			geocoder.geocode( { 'latLng': latlng}, function(results, status) {
				var ul = document.getElementById("review_list");
				var li = document.createElement('li');
				if (status === google.maps.GeocoderStatus.OK) {
					address =results[0].formatted_address ;
					var txt=document.createTextNode('text');
					li.appendChild(document.createTextNode(address));
					li.addEventListener('click',function(){redirect_to_restroom(id);},false);
					ul.appendChild(li);
				}
			});
		}
	}
}

function load_saved_restrooms(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/savedrestrooms/id/"+user_id, false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);

		for(var i= 0; i<jsonResponse.length;i++){
			var id = jsonResponse[i].saved_restrooms;
			load_saved_restrooms2(id);
		}
	}
}

function load_saved_restrooms2(id){
	var request2 = new XMLHttpRequest();
	request2.open("GET", "../API_Server/index.php/api/toilettalkapi/restroombyid/rrid/"+id, false);
	request2.send();
	if(request2.status === 200 && request2.responseText){
		var jsonResponse2 = JSON.parse(request2.responseText);
		var latlng = new google.maps.LatLng(jsonResponse2[0].latitude,jsonResponse2[0].longitude);
		geocoder.geocode( { 'latLng': latlng}, function(results, status) {
			var ul = document.getElementById("saved_restrooms_list");
			var li = document.createElement('li');  
			if (status === google.maps.GeocoderStatus.OK) {
				var address =results[0].formatted_address ;
				var txt=document.createTextNode('text');
				li.appendChild(document.createTextNode(address));
				li.addEventListener('click',function(){redirect_to_restroom(id);},false);
				ul.appendChild(li);
			}
		});
	}
}

function redirect_to_restroom(id){
	window.location = "restroomID.html?id="+id;
}

function redirect_to_route(li){
	var data = li.className;
	var mydata = ["", "", ""];
	var count = 0;
	for (var i = 0; i < data.length; i++){
		if (data[i] != '*') mydata[count] += data[i];
		else count++;
	}
	window.location = "index.html?id="+mydata[0]+"&origin="+mydata[1]+"&destination="+mydata[2];
}

function checklogin(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.send();
	if(request.status === 200 && request.responseText){

		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
			user_id = jsonResponse['user_id'];
		}
		else{
			alert('Please login.');
			window.location = "index.html";
		}
	}
}