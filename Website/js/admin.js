var user_id;
var geocoder;

window.onload = function(){
	checklogin();
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
		var jsonResponse = JSON.parse(request.responseText);
		
		for(var i= 1; i<jsonResponse.length;i++){
			var ul = document.getElementById("users_list");
			var li = document.createElement('li');  
			li.appendChild(document.createTextNode(jsonResponse[i].username));

			var breaknode = document.createElement("BR");
			li.appendChild(breaknode);
			var id = jsonResponse[i].user_id;
			var btn=document.createElement("BUTTON");
			var t=document.createTextNode("Delete");
			btn.appendChild(t);
			
			li.appendChild(btn);
			
			btn.id = id
			btn.addEventListener('click',function(){deleteuser(this.id);},false);

			ul.appendChild(li);
		}
	}
}

function load_restrooms(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/allrestroom", false);
	request.send();

	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		
		for(var i = 0; i<jsonResponse.length; i++){
			var latlng = new google.maps.LatLng(jsonResponse[i].latitude,jsonResponse[i].longitude);
			var id = jsonResponse[i].restroom_id;
			load_restrooms2(latlng, id);
		}
	}
}

function load_restrooms2(latlng, id){
	geocoder.geocode( { 'latLng': latlng}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			var ul = document.getElementById("restroom_list");
			var li = document.createElement('li');
			var address =results[0].formatted_address ;
			var txt=document.createTextNode('text');
			li.appendChild(document.createTextNode(address));
			var breaknode = document.createElement("BR");
			li.appendChild(breaknode);
			var btn=document.createElement("BUTTON");
			var t=document.createTextNode("Delete");
			btn.appendChild(t);
			li.appendChild(btn);

			btn.id=id;
			btn.addEventListener('click',function(){deleterestroom(this.id);},false);
			
			ul.appendChild(li);
		}
	});
}

function load_responses(){
	var address;
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/allresponse", false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);

		for(var i= 0; i<jsonResponse.length;i++){
			var ul = document.getElementById("responses_list");
			var li = document.createElement('li');  
			li.appendChild(document.createTextNode(jsonResponse[i].user_comments));
			var breaknode = document.createElement("BR");
			li.appendChild(breaknode);
			var btn=document.createElement("BUTTON");
			var t=document.createTextNode("Delete");
			btn.appendChild(t);
			
			li.appendChild(btn);
			var rid = jsonResponse[i].review_id;
			var rtid= jsonResponse[i].responds_to_id;

			btn.id = rid;
			btn.class = rtid
			btn.addEventListener('click',function(){deleteresponse(this.id,this.class);},false);

			ul.appendChild(li);
		}
	}
}
function deleteuser(uid){
	$.post("../API_Server/index.php/api/toilettalkapi/deluser", {"uid":uid},
		function(result){
			window.location = "admin.html";
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Deletion Failure");
		});	
}

function deleterestroom(rrid){
	$.post("../API_Server/index.php/api/toilettalkapi/delrestroom", {"rrid":rrid},
		function(result){
			window.location = "admin.html";
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Deletion Failure");
		});	
}

function deleteresponse(rid,rtid){
	$.post("../API_Server/index.php/api/toilettalkapi/delresponse", {"rid":rid,"rtid":rtid},
		function(result){
			window.location = "admin.html";
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Deletion Failure");
		});	
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

		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
			user_id = jsonResponse['user_id'];
			if(jsonResponse['permission']==='2')
			{
					document.getElementById("myaccount").style.display='none';
					document.getElementById("admin").style.display='inline';
					geocoder = new google.maps.Geocoder();

					document.getElementById("logout").addEventListener('click',function(){logout();},false);	
					
					load_users();
					load_restrooms();
					load_responses();
			}
			else{
				alert('Access Denied! Authorized Admins only');
				window.location = "index.html";
			}
		}
		else{
			alert('Please login.');
			window.location = "index.html";
		}
	}
}