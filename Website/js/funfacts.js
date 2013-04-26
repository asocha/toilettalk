function initializefunfacts(){
	setnumberofreviews();
	setnumberofusers();
	setlatestreview();
}

function setlatestreview(){
	var id;
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/latestreview", false);
	request.send();
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		var geocoder = new google.maps.Geocoder();
		var address="";
		id = jsonResponse[0].restroom_id;

		var latlng = new google.maps.LatLng(jsonResponse[0].latitude,jsonResponse[0].longitude);
		geocoder.geocode( { 'latLng': latlng}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				address = results[0].formatted_address;
				document.getElementById('latestreview').innerHTML=address;
			}
		});
		document.getElementById('latestreview').addEventListener('click',function(){redirect_to_restroom(id);},false);
	}
}

function redirect_to_restroom(id){
	window.location = "restroomID.html?id="+id;
}

function setnumberofreviews(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/reviewno", false);
	request.send();
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		document.getElementById('numberofreviews').innerHTML=jsonResponse[0].numofreviews;
	}
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function setnumberofusers(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/userno", false);
	request.send();
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		document.getElementById('numberofusers').innerHTML=jsonResponse[0].registeredusers;
	}
}