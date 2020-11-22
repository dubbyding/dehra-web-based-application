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

function checkpassword(){
    var password = document.getElementById('enterPassword');
    var repassword = document.getElementById('ReenterPassword');
    if(password.value == repassword.value){
        return true;
    }else{
        console.log('Not Equal');
        password.classList.add("is-invalid");
        repassword.classList.add("is-invalid");
        return false;
    }

}