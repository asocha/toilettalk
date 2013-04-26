function initializeLogin(){
	checklogin();
	document.getElementById("register").addEventListener('click',function(){register();},false);
	document.getElementById("login").addEventListener('click',function(){login();},false);
	document.getElementById("home").addEventListener('click',function(){home();},false);
	document.getElementById("logout").addEventListener('click',function(){logout();},false);
	document.getElementById("login_button").addEventListener('click',function(){validatelogin();},false);
	document.getElementById("register_button").addEventListener('click',function(){validateregister();},false);
	document.getElementById("exit1").addEventListener('click',function(){exit();},false);
	document.getElementById("exit2").addEventListener('click',function(){exit();},false);
}

function exit(){
	document.getElementById("loginform").style.display="none";
	document.getElementById("Registerform").style.display="none";
}
function home(){
	document.getElementById("loginform").style.display="none";
	document.getElementById("Registerform").style.display="none";
}
function register(){
	document.getElementById("loginform").style.display="none";
	document.getElementById("Registerform").style.display="inline";
}
function login(){
	document.getElementById("Registerform").style.display="none";
	document.getElementById("loginform").style.display="inline";
}

function logout(){
	var request = new XMLHttpRequest();
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/logout", false);
	request.send();
	window.location = "index.html";
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

function setnumberofusers(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/userno", false);
	request.send();
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		document.getElementById('numberofusers').innerHTML=jsonResponse[0].registeredusers;
	}
}

function validatelogin(){
	var uname=document.forms.loginform.uname.value;
	var password=document.forms.loginform.password.value;
	var data = new FormData(document.getElementById("loginform"));
	
	var request = new XMLHttpRequest();
	
	request.open("POST", "../API_Server/index.php/api/toilettalkapi/login", false);
	request.send(data);
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['success']) {
			window.location = "index.html";
		}
		else{
			alert("Login is invalid. Please try again.");
		}
	}
	else{
		alert("Login is invalid. Please try again.");
	}
}

function validateregister(){
	var uname=document.forms.Registerform.uname.value;
	var password=document.forms.Registerform.password.value;
	var data = new FormData(document.getElementById("Registerform"));
	
	var request = new XMLHttpRequest();
	
	request.open("POST", "../API_Server/index.php/api/toilettalkapi/user", false);
	request.send(data);
	if(request.status===200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['success']) {
			window.location = "index.html";
		}
		else{
			alert("Registration is invalid. Please try again.");
		}
	}
	else{
		alert("Registration is invalid. Please try again.");
	}
}

function checklogin(){
	var request = new XMLHttpRequest();
	request.open("GET", "../API_Server/index.php/api/toilettalkapi/session", false);
	//request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
	request.send();
	if(request.status === 200 && request.responseText){
		var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
			document.getElementById("login").style.display='none';
			document.getElementById("logout").style.display='inline';
			document.getElementById("register").style.display='none';
			document.getElementById("myaccount").style.display='inline';
			if(jsonResponse['permission']==='2'){
				document.getElementById("myaccount").style.display='none';
				document.getElementById("admin").style.display='inline';
			}
		}
	}
}