var contacted_people = {"id":[1, 2, 3, 4, 5, 6], "name":["Ram", "Shyam", "Hari", "Gita", "Sita", "Rita"], room_id:[1, 2, 3, 4, 5, 6]};
var profileElements = document.getElementsByClassName("for-profile-details");
var choose = ['account-details', 'add-advertisement', 'contacted-people']
// For initializing profile details
$(".for-profile-details").on('click', function(){
    id = String($(this).attr('id'));
    document.getElementById(id.replace('-','')).style.display = "block";
    document.getElementById(id).style.backgroundColor="black";
    $('.for-profile-details').each(function () {
        other = this.id;
        if(id != other){
            document.getElementById(other.replace('-','')).style.display = "none";
            document.getElementById(other).style.backgroundColor="#535353";
        }
    });
    document.getElementById("addingAdvertisement").style.display = "none";
    if(id == 'contacted-people'){
        var counter = 0;
        var capable = Math.floor(contacted.length/8)+1;
        counter = addContactedPeopleOnProfile(counter, capable, counterNeed = 1);   // 1 repesentes forward and -1 represents backward
    }
    if(id == 'add-advertisement'){
        var advertisement_counter = 0;
        var capable = Math.floor(actual_advertisement.length/8)+1;
        
    }
});
function requestLocationByGeo(Latitude=27.6791296, Longitude=85.32459519999999){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us1.locationiq.com/v1/reverse.php?key=pk.aefdd1e94586b32241589dadb011b72e&lat='+ Latitude +'&lon='+ Longitude +'&format=json', true);
    
    return new Promise(resolve => {
        xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.status);
            requestAddress = JSON.parse(xhr.responseText).address;
            resolve(requestAddress);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
});
}
async function adding_advertisement(){
    document.getElementById('addadvertisement').style.display = "none";
    document.getElementById('addingAdvertisement').style.display = "block";
    alert("GeoLocation Is taken from the brower. Please allow the use of Location. For Better performance use mobile application.")
    locationGPS = window.GlobalVar;
    locationGPS = locationGPS.toString().split(',');
    request_address = await requestLocationByGeo(Latitude=parseFloat(locationGPS[0]),Longitude=parseFloat(locationGPS[1]));
    total_address = request_address["suburb"]+','+request_address["neighbourhood"]+','+request_address["city"]+','+request_address["state"]+','+request_address["country"];
    document.getElementById("propertyAddress").value = total_address;
}   

function addadvertisementOfPeople(counter, capable, counterNeed, button=0){
    var addingAds = '';
    var buttonAdding = '';
    var column = 0;
    
}

function addContactedPeopleOnProfile(counter, capable, counterNeed, button = 0){
    var addingPeople = '';
    var buttonAdding = ''; 
    var column = 0;
    if(counterNeed == 1 && counter<=capable){
        counter++;
    }
    if(counterNeed == -1 && counter > 0){
        counter--;
    }
    if(button>1){
        counter = button;
    }
    if(capable<=5){
        for(var i=0; i<capable; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="addContactedPeopleOnProfile(`+counter+`,`+ capable +`,0, `+ (i+1) +`);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
    }else if((counter+3)>=capable){
        buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="addContactedPeopleOnProfile(`+counter+`,`+ capable +`,0, `+ (1) +`);" id="page-`+(1).toString() +`">`+(1).toString()+`</button>
                </div>`;
        buttonAdding = buttonAdding + `<div class="button-pages">...
            </div>`;
        for(var i=capable-3; i<capable; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="addContactedPeopleOnProfile(`+counter+`,`+ capable +`,0, `+ (i+1) +`);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
    }else{
        for(var i=counter; i<3; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="addContactedPeopleOnProfile(`+counter+`,`+ capable +`,0, `+ (i+1) +`);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
        buttonAdding = buttonAdding + `<div class="button-pages">...
            </div>`;
        buttonAdding = buttonAdding + `<div class="button-pages">
            <button type="button" class="btn btn-primary btn-sm" onclick="addContactedPeopleOnProfile(`+counter+`,`+ capable +`,0, `+ (capable) +`);" id="page-`+(capable).toString() +`">`+(capable).toString()+`</button>
        </div>`;
    }
    
    buttons_adding = document.getElementById('buttons-below');
    buttons_adding.innerHTML = buttonAdding;
    if(contacted.length<8){
        var display = contacted.length-(8*(counter-1));
    }else{
        var display = counter;
    }
    for(var i = 8*(counter-1); i< display; i++){
        console.log(contacted.length);
        if(column > 1){
            column = 0;
            addingPeople = addingPeople + `</div>`
        }else if(column == 0){
            addingPeople = addingPeople + `<div class="row contacted-people-show">`;
        }
        addingPeople = addingPeople + `<div class="col d-flex display-contacted-people-onclick align-items-center" id="displayingContactedPeople`+ contacted[i] +`">
                <i class="fas fa-user user-face"></i>
                <span id="username-chatting">` + contacted[i] + `</span>
        </div>`;
        column++;
    }
    document.getElementById('adding-contacted-people').innerHTML=addingPeople;
    return counter;
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
});
$("#ads-pic-upload").change(function(){
    file = document.getElementById("ads-pic-upload");
    var fr=new FileReader();
    fr.readAsDataURL(file.files[0]);
    fr.onload = function(e){
        document.getElementById("advertisement-upload-image").style.backgroundImage = "url(" + this.result + ")"; 
    };
    console.log(file.files[0]["name"]);
    console.log(fr);
});
$("#change-password").on('click', function(){
    $("#change-password").addClass("d-none");
    $("#display-reenterPassword").removeClass("d-none");
});
$(document).ready(function(){
    document.getElementById(choose[0]).click();
});
$("#Ads-adding").submit(function(eventObj){
    console.log(window.GlobalVar);
    $("<input />").attr("type", "hidden").attr("name","geolocation").attr("value", window.GlobalVar).appendTo("#Ads-adding");
    return true;
});
