$(document).ready(function(){
    navigator.geolocation.getCurrentPosition(function(position){
        var gps = (position.coords.latitude.toString()+','+position.coords.longitude.toString());
        window.GlobalVar = gps;
    });
});