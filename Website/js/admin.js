var user_id;
var geocoder;
window.onload = function(){
document.getElementById("logout").addEventListener('click',function(){logout();},false);	
checklogin();
load_users();
load_restrooms();
load_responses();
	
}

function logout(){
	var request = new XMLHttpRequest();
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/logout", false);
	request.send();
	window.location = "index.html";
}

function load_users(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/allusers", false);
	request.send();
	if(request.status === 200 && request.responseText){
		console.log(request.responseText);
		var jsonResponse = JSON.parse(request.responseText);
		//console.log(request.responseText);
		
		for(var i= 0; i<jsonResponse.length;i++){
			var ul = document.getElementById("users_list");
			var li = document.createElement('li');  
			li.appendChild(document.createTextNode(jsonResponse[i].username));
			var btn=document.createElement("BUTTON");
			var t=document.createTextNode("Delete");
			btn.appendChild(t);
			
			li.appendChild(btn);
			//var txt=document.createTextNode('text');
			
			btn.addEventListener('click',function(){alert("hello");},false);

			ul.appendChild(li);
		}
	}
}

function load_restrooms(){
	var request = new XMLHttpRequest();
	console.log('load');
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/allrestroom", false);
	request.send();

	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		console.log(request.responseText);
		
		for(var i= 0; i<jsonResponse.length;i++){
			geocoder = new google.maps.Geocoder();
			var address="";
			//li.appendChild(document.createTextNode("Restroom Id:"+jsonResponse[i].restroom_id));
			//var txt=document.createTextNode('text');
			var id =jsonResponse[i].restroom_id;
			var latlng = new google.maps.LatLng(jsonResponse[i].latitude,jsonResponse[i].longitude);
				 geocoder.geocode( { 'latLng': latlng}, function(results, status) {
				 	var ul = document.getElementById("restroom_list");
					var li = document.createElement('li');
        			if (status === google.maps.GeocoderStatus.OK) {
            		address =results[0].formatted_address ;
            		var txt=document.createTextNode('text');
					li.appendChild(document.createTextNode(address));
					var btn=document.createElement("BUTTON");
					var t=document.createTextNode("Delete");
					btn.appendChild(t);
					li.appendChild(btn);
					btn.addEventListener('click',function(){},false);
					
					ul.appendChild(li);
					//console.log(address);
        				}
        			});
			
		}
	}
}

function load_responses(){
	var address;
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/allresponse", false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		//console.log(request.responseText);
		
		


		for(var i= 0; i<jsonResponse.length;i++){
			//console.log(jsonResponse[i].saved_restrooms);
			var ul = document.getElementById("responses_list");
			var li = document.createElement('li');  
			li.appendChild(document.createTextNode(jsonResponse[i].user_comments));
			var btn=document.createElement("BUTTON");
			var t=document.createTextNode("Delete");
			btn.appendChild(t);
			
			li.appendChild(btn);
			//var txt=document.createTextNode('text');
			
			btn.addEventListener('click',function(){alert("hello");},false);

			ul.appendChild(li);
				
				
					//console.log("http://maps.googleapis.com/maps/api/geocode/json?latlng="+jsonResponse2[0].latitude+","+jsonResponse2[0].longitude+"&sensor=false");
			}
			//console.log(address);

			
		
	}
}


function redirect_to_restroom(id){
	window.location = "restroomID.html?id="+id;
}
function redirect_to_route(id){
	window.location = "index.html?id="+id;
}

function checklogin(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.send();
	if(request.status === 200 && request.responseText){
		//console.log(request.responseText);

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