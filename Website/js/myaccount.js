window.onload = function(){
	document.getElementById("logout").addEventListener('click',function(){logout();},false);
	checklogin();
	alert(user_id);
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
    	console.log(request.responseText);
    	
    	for(var i= 0; i<jsonResponse.length;i++){
    		
    		var ul = document.getElementById("routes_list");
        	var li = document.createElement('li');  
        	li.appendChild(document.createTextNode(jsonResponse[i].origin + "\n" +jsonResponse[i].destination));
	        //var txt=document.createTextNode('text');
	        
	        li.addEventListener('click',function(){alert("hi");},false);
    		ul.appendChild(li);
    	}


    }

}
function load_reviewed_restroom(){
	var request = new XMLHttpRequest();
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/restroombyid/rrid/"+user_id, false);
    request.send();
    if(request.status === 200 && request.responseText){
    	var jsonResponse = JSON.parse(request.responseText);
    	console.log(request.responseText);
    	
    	for(var i= 0; i<jsonResponse.length;i++){
    		
    		var ul = document.getElementById("review_list");
        	var li = document.createElement('li');  
        	li.appendChild(document.createTextNode(jsonResponse[i].restroom_id));
	        //var txt=document.createTextNode('text');
	        
	        li.addEventListener('click',function(){alert("hi");},false);
    		ul.appendChild(li);
    	}


    }

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
    		var ul = document.getElementById("saved_restrooms_list");
        	var li = document.createElement('li');  
        	li.appendChild(document.createTextNode("Restroom Id:"+jsonResponse[i].saved_restrooms));
	        //var txt=document.createTextNode('text');
	        
	        li.addEventListener('click',function(){alert("hi");},false);
    		ul.appendChild(li);
    	}


    }

}
function redirect_to_restroom(){
	console.log('click');


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

		    //window.user_id = jsonResponse['user_id'];
		             
		}
		else{
			alert('Please login');
			window.location = "index.html";

		}
	}
}