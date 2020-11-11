var contacted_people = {"id":[1, 2, 3, 4, 5, 6], "name":["Ram", "Shyam", "Hari", "Gita", "Sita", "Rita"], room_id:[1, 2, 3, 4, 5, 6]};

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
    } else if (id =="contacted-people"){
        displayArea.classList.add("col-md-8", "container", "all-profile-content", "h-75");
        displayArea.innerHTML=`<div class="row pb-3 border-bottom show-profile-header align-items-start">
                    <div class="col">
                        <h4>Contacted People</h4>
                    </div>
                    <div class="col">
                        <div class="input-group">
                            <input type="text" class="form-control" id="EnterPeople" placeholder="Enter People's Name" aria-label="Enter People's Name" aria-describedby="button-addon">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="submit" id="button-addon"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row people-show-container">
                    <div class="col container-fluid" id = "contacted-people-add">
                        
                    </div>
                </div>
                <div class="row choose-next-page border-top pt-2">
                    <div class="col-1 next-button">
                        <button type="button" class="btn btn-primary btn-sm"><i class="fas fa-chevron-left"></i></button>
                    </div>
                    <div class="col-10 d-flex justify-content-center" id="buttons-below">
                        
                    </div>
                    <div class="col-1 prev-button">
                        <button type="button" class="btn btn-primary btn-sm"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>`;
        var counter = 0;
        var display_contacted_people_variable = "";
        initial_button = 0;
        total_page = contacted_people["id"].length/10;
        button_display="";
        if(total_page>5){
            if(initial_button==total_page-1){
                button_number = 0;
            }else{
                button_number=initial_button;
            }
            for(i=button_display;i<initial_button+2;i++){
                button_display += `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" id="page-`+String(i+1)+`">`+String(i+1)`</button>
                </div>`;
            }
            button_display += `<div class="button-pages">...</div>
            <div class="button-pages">
                <button type="button" class="btn btn-primary btn-sm" id="page-`+String(total_page)+`">`+String(total_page)+`</button>
            </div>`
        }else{
            for(i=initial_button;i<total_page;i++){
                button_display += `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" id="page-`+String(i+1)+`">`+String(i+1)+`</button>
                </div>`;
            }
        }
        document.getElementById("buttons-below").innerHTML=button_display;
        if((contacted_people["id"].length - counter)>10){
            length_of_contacted_people = 10;
        }else{
            length_of_contacted_people = (contacted_people["id"].length - counter)/2;
        }

        for(i=0; i < length_of_contacted_people;i++){
            display_contacted_people_variable = display_contacted_people_variable + `<div class="row contacted-people-show">`;
            for(j=0; j<2; j++){
                display_contacted_people_variable += `<div class="col d-flex display-contacted-people-onclick align-items-center" id="displayingContactedPeople`+ contacted_people.room_id[counter] +`">
                        <i class="fas fa-user user-face"></i>
                        <span id="username-chatting">`+contacted_people.name[counter]+`</span>
                    </div>`;
                
                counter++;
            }
            display_contacted_people_variable += "</div>";
        }
        document.getElementById("contacted-people-add").innerHTML = display_contacted_people_variable;
        $(".display-contacted-people-onclick").on("click", function(){
            id=String($(this).attr('id'));
            room_id = id.replace("displayingContactedPeople", "");
            alert(room_id);
        });
    }
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
