var profileElements = document.getElementsByClassName("for-profile-details");
/*
// For initializing profile details
$(document).ready(function(){
    document.getElementById("account-details").click();
});
*/
$(".for-profile-details").on('click', function(){
    id = String($(this).attr('id'));
    var displayArea = document.getElementById("add-content-profile");
    displayArea.innerHTML='';
    displayArea.classList="";
    if(id=="account-details"){
        displayArea.classList.add("col-md-8", "form-group", "align-items-center", "all-profile-content");
        displayArea.innerHTML=`<div class="row">
        <div class="col"><h4>`+ id +`</h4></div>
        </div>
        <div class="row">
        <div class="col">
            <div class="row my-account-features justify-items-center">
                <div class="col-md-3 profile-image" id="profile-image"></div>
            </div>
            <div class="row my-account-features">
                <div class="col input-group">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="profile-pic-upload">
                        <label class="custom-file-label" for="profile-pic-upload">Choose file</label>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="col">
            <div class="row my-account-features">
                <div class="col">Username: <input class="form-control" type="text" placeholder="Username" id="username"></div>
            </div>
            <div class="row my-account-features">
                <div class="col">Email: <input class="form-control" type="email" placeholder="Email Id" id="email"></div>
            </div>
            <div class="row my-account-features">
                <div class="col">
                    <label for="Enter Password">Enter Password</label>
                    <div class="input-group">
                        <input type="password" class="form-control enterPassword" id="enterPassword" placeholder="Enter Password" aria-label="Enter Password" aria-describedby="password-show">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary enterPassword" type="button" id="password-show" onclick="showPassword(this)"><i class="far fa-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row my-account-features">
                <div class="col" id="change-password"><button class="btn btn-secondary" type="button">Change Password</button></div>
                <div class="col d-none" id="display-reenterPassword">
                    <label for="Re-Enter Password">Re-Enter Password</label>
                    <div class="input-group">
                        <input type="password" class="form-control ReEnterPassword" id="ReEnterPassword" placeholder="Re-Enter Password" aria-label="Re-Enter Password" aria-describedby="password-show">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary ReEnterPassword" type="button" id="password-show" onclick="showPassword(this)"><i class="far fa-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row justify-content-between">
        <div class="col-md-3">
            <button type="button" class="btn btn-danger">Delete Account</button>
        </div>
        <div class="col-md-3">
            <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
    </div>
    `
    };
    $("#profile-pic-upload").change(function(){
        file = document.getElementById("profile-pic-upload");
        var fr=new FileReader();
        fr.readAsDataURL(file.files[0]);
        fr.onload = function(e){
            document.getElementById("profile-image").style.backgroundImage = "url(" + this.result + ")"; 
        };
        console.log(file.files[0]["name"]);
        console.log(fr);
    })
    $("#change-password").on('click', function(){
        $("#change-password").addClass("d-none");
        $("#display-reenterPassword").removeClass("d-none");
    });

    for(i=0; i<profileElements.length;i++){
        document.getElementById(profileElements[i].id).style.backgroundColor="#535353";
        document.getElementById(id).style.backgroundColor="black";
    };
});
