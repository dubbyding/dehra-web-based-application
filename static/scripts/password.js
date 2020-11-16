function showPassword(element){
    var id = element.className.split(" ");
    id = String(id[id.length-1]);
    var elementId = document.getElementById(id);
    if(elementId.type==="password"){
        elementId.type="text";
        $("i",element).addClass("fa-eye-slash").removeClass("fa-eye");
    }else{
        elementId.type="password";
        $("i",element).addClass("fa-eye").removeClass("fa-eye-slash");
    }
}