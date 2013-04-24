function initializefunfacts(){
	setnumberofreviews();
	setnumberofusers();
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