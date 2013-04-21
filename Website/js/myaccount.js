var user_id;

window.onload = function(){
	document.getElementById("logout").addEventListener('click',function(){logout();},false);
	checklogin();
	alert(user_id);
	load_saved_restrooms();


}
function logout(){
    var request = new XMLHttpRequest();
        //request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/logout", false);
    request.send();
    window.location = "index.html";

}

function load_saved_restrooms(){
	var request = new XMLHttpRequest();
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/savedrestrooms/id/"+user_id, false);
    request.send();
    if(request.status === 200 && request.responseText){
    	var jsonResponse = JSON.parse(request.responseText);
    	console.log(request.responseText);
    	
    	for(var i= 0; i<jsonResponse.length;i++){
    		console.log(jsonResponse[i].saved_restrooms);


    	}


    }

}

function checklogin(){
    var request = new XMLHttpRequest();
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
    //request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
    request.send();
    if(request.status === 200 && request.responseText){
        console.log(request.responseText);

        var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {

		    user_id = jsonResponse['user_id'];
		             
		}
		else{
			alert('Please login');
			window.location = "index.html";

		}
	}
}