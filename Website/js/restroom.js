var lastInfoWindow; //tracks the last info window to open
var geocoder;
var set = false; //is star rating set for Add Review

//Add Review Data
var numstars = 0;
var reviewid = null;
var respondid = 0;
var userid = 0;
var gender = true;
var comments, id;
var icons = [0, 0, 0, 0, 0];
var id;
var user_id=0;

window.onload = function(){
	/*	//add 100 restrooms to the database
	for (var i = 0; i < 100; i++){
		var lat = 32.8 + (Math.random());
		var lng = -96.8 + (Math.random());

		$.post("../API_Server/index.php/api/toilettalkapi/restroom", {"lat":lat,"long":lng,"name":"test","address":"test","respondstoid":0,"usercomments":"test","gender":0,"reviewstarrating":3,"dcs":0,"ha":0,"unisex":0,"co":0,"24":0},
			function(result){
			}).fail(
			function(jqxhr, errorText, errorThrown){
				alert("Restroom is already saved");
				alert(JSON.stringify(jqxhr));
			});	
	}
	*/
	geocoder = new google.maps.Geocoder();

	initializeLogin();

	createSearchMap();
	checklogin2();
	loadsavebutton();
}

function loadsavebutton(){
	var savebutton = document.getElementById("SaveButton");
	savebutton.addEventListener("click",function(){saverestroom();},false);
	if(user_id===0){
		savebutton.style.display="none";
	}
}

function saverestroom(){
	$.post("../API_Server/index.php/api/toilettalkapi/saverestroom", {"rrid":id,"uid":user_id},
		function(result){
			var savebutton = document.getElementById("SaveButton");
			savebutton.style.display="none";
		}).fail(
		function(jqxhr, errorText, errorThrown){
			var savebutton = document.getElementById("SaveButton");
			savebutton.style.display="none";
			alert("Restroom is already saved");
		});	
}

/* MAP CREATION */

function createSearchMap(){
	var restroom = getRestroom()[0];   //get Restroom from Database
	
	var stars = restroom['final_average'];
	var lat = restroom['latitude'];
	var lng = restroom['longitude'];
	var icons = [];
	icons[0] = restroom['sum(diaper_changing_station)'];
	icons[1] = restroom['sum(handicap_accessible)'];
	icons[2] = restroom['sum(unisex)'];
	icons[3] = restroom['sum(customer_only)'];
	icons[4] = restroom['sum(24_hour)'];
	
	var location = new google.maps.LatLng(lat, lng);

	var comments = getComments();

	var commentnav = document.getElementById("comments");

	for (var i = 0; comments && i < comments.length; i++){
		var username = getUser(comments[i]['user_id']);
		var html = "";
		var isResponse = parseInt(comments[i]['responds_to_id']);
		if (isResponse !== 0) isResponse = 1;	//fix to remove broking threading
		html += "<div style=''><div class='comment' style='margin-left:"+(12+10*isResponse)+"px; margin-top:"+(15-10*isResponse)+"px; width:"+(430-10*isResponse)+"px;display:block;'>";

		//add thumbs counts
		html += "<div style='overflow:visible;height:23px;'><p>+</p><p id='up"+i+"' style='margin:0;'>"+comments[i]['thumbs_up']+"</p><p> -</p><p id='down"+i+"' style='margin:0;'>"+comments[i]['thumbs_down']+"</p><p>&nbsp;&nbsp;&nbsp;</p>";

		if (isResponse === 0){	//add stars
			for (var j = 0; j < 5; j++){
				if (comments[i]['review_star_rating'] > j) html += "<img class='star' src='img/star.png'>";
				else html += "<img class='star' src='img/transparentStar.png'>";
			}
		}

		//add reply button
		if (!comments[i+1] || comments[i+1]['responds_to_id'] <= comments[i]['responds_to_id']) html += "<a class='addReply' onclick='addReview("+comments[i]['review_id']+","+(parseInt(comments[i]['responds_to_id'])+1)+");'>Reply</a>";

		html += "</div><p style='font-style:italic;'>"+username+":</p>";

		//add comment
		html += "<p>" + comments[i]['user_comments'] + "</p>";

		//add thumbs images
		html += "</div><div style=''><img class='thumb_up' src='img/thumb_up.png' style='margin-top:"+(16-10*isResponse)+"px;' onClick='upVote("+comments[i]['review_id']+","+comments[i]['responds_to_id']+","+i+");this.parentNode.style.visibility=\""+"hidden"+"\";'><img class='thumb_down' src='img/thumb_down.png' onClick='downVote("+comments[i]['review_id']+","+comments[i]['responds_to_id']+","+i+");this.parentNode.style.visibility=\""+"hidden"+"\";'></div></div>";

		commentnav.innerHTML += html;
	}

	var button = document.getElementsByClassName("addReview")[0];
	button.addEventListener("click",buttonclick,false);
	
	var mapOptions = {
		center: location,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	//render map
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	var marker = new google.maps.Marker({
		position: location,
		map: map
	});

	geocodeMarker(map, marker, location, stars, icons);
}

function buttonclick(){
	addReview(0,0);
}

//geocode a marker's location and then set it's title and info window
function geocodeMarker(map, marker, location, stars, icons){
	geocoder.geocode( { 'latLng': location}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			marker.setTitle(results[0].formatted_address);
			attachInfo(map, marker, results[0].formatted_address, stars, icons);
		}
		else {
			attachInfo(map, marker, location, stars, icons);
		}
	});
}

//add Info Window for when user clicks on a map marker
function attachInfo(map, marker, title, stars, icons){
	var html = "";
	html += "<h1 class='restroomName'>" + title + "</h1>";

	//html += "<img class='restroom_image' src=img/" + image + ">";

	//add stars
	for (var count = 1; count <= 5; count++){
		if (stars >= count){
			html += "<img class='star' src='img/star.png'>";
		}
		else{
			html += "<img class='star' src='img/transparentStar.png'>";
		}
	}
	
	html += "<br />";

	//add icons
	if (icons[0] > 1){
		html += "<img class='icon' title='Diaper Changing Station' src='img/icon_diaper.png'>";
	}
	if (icons[1] > 1){
		html += "<img class='icon' title='Handicap Accessible' src='img/icon_handicap.png'>";
	}
	if (icons[2] > 1){
		html += "<img class='icon' title='Unisex' src='img/icon_men.png'>";
	}
	if (icons[3] > 1){
		html += "<img class='icon' title='Customers Only' src='img/icon_pay.png'>";
	}
	if (icons[4] > 1){
		html += "<img class='icon' title='Open 24/7' src='img/icon_24.png'>";
	}

	var infoWindow = new InfoBox({
		content: html
	});
	google.maps.event.addListener(marker, 'click', function() {
		if (lastInfoWindow){
			lastInfoWindow.close(); //closes the last info window that opened, ensuring only one is open at a time
		}
		infoWindow.open(map,marker);
		lastInfoWindow = infoWindow;
	});

	//add Restroom to the side navigation list
	var nav = document.getElementsByClassName("RestroomTitle")[0];
	nav.innerHTML = html;
	document.getElementById("comments").style.height=(435-nav.offsetHeight)+"px";
}

//query database for a Restroom's data
function getRestroom(){
	id = getUrlVars()["id"];

	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/restroombyid/rrid/"+id, false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/restroombyid/method/location/rrid/"+id, false);
	request.send();

	if(request.status === 200 && request.responseText && $.parseJSON(request.responseText)[0]['restroom_id']){
		return $.parseJSON(request.responseText);
	}
	else if (!request.responseText || !$.parseJSON(request.responseText)[0]['restroom_id']){
		alert("Somehow you tried to view a restroom that doesn't exist.");
		window.location = "index.html";
		return null;
	}
	else {
		alert("Error Retrieving Restroom: " + request.status);
		window.location = "index.html";
		return null;
	}
}

//query database for a Restroom's comments
function getComments(){
	id = getUrlVars()["id"];

	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/response/rrid/"+id, false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/response/method/location/id/"+id, false);
	request.send();

	if(request.status === 200 && request.responseText){
		return $.parseJSON(request.responseText);
	}
	else if (!request.responseText){
		alert("This restroom has no reviews... Perhaps you could add one!");
		return null;
	}
	else {
		alert("Error Retrieving Restroom: " + request.status);
		return null;
	}
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//change to add review page review from that page
function addReview(review,response){
	if (response) reviewid = review;
	respondid = response;

	var comments = document.getElementById("comments");
	comments.style.display="none";

	var saveButton = document.getElementById("SaveButton");
	saveButton.style.display="none";

	var addReview = document.getElementById("addReview");
	addReview.style.display="block";

	var button = document.getElementsByClassName("addReview")[0];
	button.removeEventListener("click",buttonclick,false);
	button.addEventListener("click",insertReview,false);

	var div = document.getElementsByClassName("Restrooms")[0];
	var stars = div.getElementsByClassName("star");
	var icons = div.getElementsByClassName("icon");
	var breaks = div.getElementsByTagName("br");
	for (var i = 0; i < 5; i++){
		stars[i].style.display="none";
		if (icons[i]){
			icons[i].style.display="none";
		}
		if (breaks[i]){
			breaks[i].style.display="none";
		}
	}
	if (response === 0){
		var div = document.getElementsByClassName("RestroomTitle")[0];
		div.innerHTML += "<img class='star' src='img/transparentStar.png' id='1' onmouseover='highlight(1);this.style.cursor = \"pointer\";' onclick='setStar(1)' onmouseout='losehighlight();this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='star' src='img/transparentStar.png' id='2' onmouseover='highlight(2);this.style.cursor = \"pointer\";' onclick='setStar(2)' onmouseout='losehighlight();this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='star' src='img/transparentStar.png' id='3' onmouseover='highlight(3);this.style.cursor = \"pointer\";' onclick='setStar(3)' onmouseout='losehighlight();this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='star' src='img/transparentStar.png' id='4' onmouseover='highlight(4);this.style.cursor = \"pointer\";' onclick='setStar(4)' onmouseout='losehighlight();this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='star' src='img/transparentStar.png' id='5' onmouseover='highlight(5);this.style.cursor = \"pointer\";' onclick='setStar(5)' onmouseout='losehighlight();this.style.cursor = \"normal\";' /><br />";

		div.innerHTML += "<img class='icon 0' src='img/icon_diaper.png' title='Diaper Changing Station' style='opacity:0.4;border:1px solid #27ADC3;' onmouseover='this.style.cursor = \"pointer\";' onclick='setIcon(0)' onmouseout='this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='icon 1' src='img/icon_handicap.png' title='Handicap Accessible' style='opacity:0.4;border:1px solid #27ADC3;' onmouseover='this.style.cursor = \"pointer\";' onclick='setIcon(1)' onmouseout='this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='icon 2' src='img/icon_men.png' title='Unisex' style='opacity:0.4;border:1px solid #27ADC3;' onmouseover='this.style.cursor = \"pointer\";' onclick='setIcon(2)' onmouseout='this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='icon 3' src='img/icon_pay.png' title='Customers Only' style='opacity:0.4;border:1px solid #27ADC3;' onmouseover='this.style.cursor = \"pointer\";' onclick='setIcon(3)' onmouseout='this.style.cursor = \"normal\";' />";
		div.innerHTML += "<img class='icon 4' src='img/icon_24.png' title='Open 24/7' style='opacity:0.4;border:1px solid #27ADC3;' onmouseover='this.style.cursor = \"pointer\";' onclick='setIcon(4)' onmouseout='this.style.cursor = \"normal\";' />";
	}
}

//insert Review into database
function insertReview(){
	comments = document.getElementById("addReview").innerHTML;
	//check logged in
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
			userid = jsonResponse['user_id'];
		}
	}

	//"http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/response/saveresponse"
	$.post("../API_Server/index.php/api/toilettalkapi/saveresponse", {"reviewid":reviewid,"respondstoid":respondid,"userid":userid,"usercomments":comments,"gender":gender,"reviewstarrating":numstars,"rrid":id},
		function(result){
			//"http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/response/icons"
			if (respondid === 0){
				$.post("../API_Server/index.php/api/toilettalkapi/icons", {"rrid":result[0]['LAST_INSERT_ID()'],"dcs":icons[0],"ha":icons[1],"unisex":icons[2],"co":icons[3],"24":icons[4]},
					function(result){
						document.location.reload(true);
					}).fail(
					function(jqxhr, errorText, errorThrown){
						alert("Error adding restroom icons.\n"+"Error Type: " + errorThrown);
						document.location.reload(true);
					});
			}
			else document.location.reload(true);	//reload page
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Error adding review.\n"+"Error Type: " + errorThrown);
			alert(JSON.stringify(jqxhr));
		});
}

function upVote(id, respondid, i){
	//"http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/thumbs"
	$.post("../API_Server/index.php/api/toilettalkapi/thumbs", {"up":1,"reviewid":id,"respondstoid":respondid},
		function(result){
			document.getElementById("up"+i).innerHTML = parseInt(document.getElementById("up"+i).innerHTML)+1;
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Error upvoting.\n"+"Error Type: " + errorThrown);
		});
}

function downVote(id, respondid, i){
	//"http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/thumbs"
	$.post("../API_Server/index.php/api/toilettalkapi/thumbs", {"up":0,"reviewid":id,"respondstoid":respondid},
		function(result){
			document.getElementById("down"+i).innerHTML = parseInt(document.getElementById("down"+i).innerHTML)+1;
		}).fail(
		function(jqxhr, errorText, errorThrown){
			alert("Error downvoting.\n"+"Error Type: " + errorThrown);
		});
}

//highlight stars for rating
function highlight(x)
{
	if (set==false){
		for (i=1;i<x+1;i++){
			document.getElementById(i).src='img/star.png';
		}
	}
}

//unhighlight stars for rating
function losehighlight()
{
	if (set==false){
		for (i=1;i<6;i++){
			document.getElementById(i).src='img/transparentStar.png';
		}
	}
}

//set star rating
function setStar(x)
{
	for (i=1;i<6;i++){
		document.getElementById(i).src='img/transparentStar.png';
	}
	for (i=1;i<x+1;i++){
		document.getElementById(i).src='img/star.png';
	}
	numstars=x;
	set=true;
}

//get username from user id
function getUser(id){
	if (id === "0") return "anonymous";

	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/user/id/"+id, false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/users/method/user/id/"+id, false);
	request.send();

	if(request.status === 200 && request.responseText){
		return $.parseJSON(request.responseText)[0]['username'];
	}
	else if (!request.responseText){
		return "Unknown User";
	}
	else {
		return "Error Retrieving User: " + request.status;
	}
}

//set selected icons
function setIcon(x)
{
	if (icons[x] === 0){
		document.getElementsByClassName(x)[0].style.border="1px solid yellow";
		document.getElementsByClassName(x)[0].style.opacity=1;
		icons[x] = 1;
	}
	else{
		document.getElementsByClassName(x)[0].style.border="1px solid #27ADC3";
		document.getElementsByClassName(x)[0].style.opacity=0.4;
		icons[x] = 0;
	}
}

function checklogin2(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
			user_id = jsonResponse['user_id'];
			if(jsonResponse['permission']==='2'){
				document.getElementById("myaccount").style.display='none';
				document.getElementById("admin").style.display='inline';
			}
		}
	}
}