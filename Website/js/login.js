function initializeLogin(){
    checklogin();
    document.getElementById("register").addEventListener('click',function(){register();},false);
    document.getElementById("login").addEventListener('click',function(){login();},false);
    document.getElementById("home").addEventListener('click',function(){home();},false);
    document.getElementById("logout").addEventListener('click',function(){logout();},false);
    document.getElementById("login_button").addEventListener('click',function(){validatelogin();},false);
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
function validatelogin(){
    
    var uname=document.forms.loginform.uname.value;
    var password=document.forms.loginform.password.value;
    var data = new FormData(document.getElementById("loginform"));
    
    var request = new XMLHttpRequest();
    
    request.open("POST", "../API_Server/index.php/api/toilettalkapi/login", false);
    
    request.send(data);
    console.log(request.status);
    if(request.status===200 && request.responseText){
        var jsonResponse = JSON.parse(request.responseText);
        if(jsonResponse['success']) {
            window.location = "index.html";
            alert('hello');
            }
         else{
        alert("Login is incorrent. Please Try again")
             }
    }
    else{
        alert("Login is incorrent. Please Try again")
    }
    //return false;

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
		    console.log('hello');
		    document.getElementById("login").style.display='none';
		    document.getElementById("logout").style.display='inline';
		    document.getElementById("register").style.display='none';
		    document.getElementById("myaccount").style.display='inline';
		             
		}
	}
}