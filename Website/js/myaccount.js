window.onload = function(){
	document.getElementById("logout").addEventListener('click',function(){logout();},false);




}
function logout(){
    var request = new XMLHttpRequest();
        //request.open("GET", "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/session", false);
    request.open("GET", "../API_Server/index.php/api/toilettalkapi/logout", false);
    request.send();
    window.location = "index.html";

}