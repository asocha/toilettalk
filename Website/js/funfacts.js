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
			//li.appendChild(document.createTextNode("Restroom Id:"+jsonResponse[i].restroom_id));
			//var txt=document.createTextNode('text');
			 id =jsonResponse[0].restroom_id;

			var latlng = new google.maps.LatLng(jsonResponse[0].latitude,jsonResponse[0].longitude);
				 geocoder.geocode( { 'latLng': latlng}, function(results, status) {
				 	
        			if (status === google.maps.GeocoderStatus.OK) {
            		address =results[0].formatted_address ;
            		console.log(address);
            		document.getElementById('latestreview').innerHTML=address;
					console.log(id);
					
					
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
		//console.log(request.responseText);
		//console.log(jsonResponse[0].numofreviews);
		document.getElementById('numberofreviews').innerHTML=jsonResponse[0].numofreviews;
	}
}

function setnumberofusers(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/userno", false);
	request.send();
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		//console.log(request.responseText);
		//console.log(jsonResponse[0].numofreviews);
		document.getElementById('numberofusers').innerHTML=jsonResponse[0].registeredusers;
	}
}