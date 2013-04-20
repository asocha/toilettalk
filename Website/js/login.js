window.onload = function(){
    checklogin();
    document.getElementById("register").addEventListener('click',function(){register();},false);
    document.getElementById("login").addEventListener('click',function(){login();},false);
    document.getElementById("home").addEventListener('click',function(){home();},false);
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

function checklogin(){
    var request = new XMLHttpRequest();
    request.open("GET", "http://ec2-54-234-249-110.compute-1.amazonaws.com/semester_project/Team6/API_Server/index.php/api/toilettalkapi/session", false);
    request.send();
    if(request.status === 200 && request.responseText){
        console.log(request.responseText);

        var jsonResponse = JSON.parse(request.responseText);
		if(jsonResponse['logged_in']) {
		    console.log('hello');
		    document.getElementById("login").style.display='none';
		    document.getElementById("logout").style.display='inline';
		    document.getElementById("register").style.display='none';
		    document.getElementById("myaccount").style.display='inline';
		             
		}
	}
}