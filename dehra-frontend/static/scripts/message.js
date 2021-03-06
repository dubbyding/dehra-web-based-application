details = {'Location': 'Kathmandu', 'Price': "Rs. 2000 per month","Room Count": 2,"Water Source": "Well", 
        "Bathroom": "Connected", "Terrace Access": "Allowed", "Details":"Pariatur consectetur adipisicing mollit duis nostrud veniam in velit ipsum.",
         "Owner":"Raj Maharjan"}

connected_status = false
var connected_id = null;
var checkElement = document.getElementsByClassName("messages");
$(document).ready(function(){
    document.getElementById("user-face-showing").style.display="none";
    displayAllAvailableConnectedUsers();
    $(".messages").on('click', function () {
        id=String($(this).attr('id'));
        if(connected_id != id && connected_id != null){
            socket.disconnect();
            connected_id = null;
            connected_status = false;
        }
        document.getElementById("details-for-texting").innerHTML="";
        for(i=0; i<checkElement.length;i++){
            document.getElementById(checkElement[i].id).style.backgroundColor="#1E1E1E";
            document.getElementById(id).style.backgroundColor="black";
        };
        displayChattingArea(id);
        if(connected_status == false && connected_id == null){
            connectIO(id);
            connected_status = true;
            connected_id = id;
        }
        
        
    });
    
    document.getElementById(checkElement[0].id).click();
    
    document.getElementById("message_input").focus();
});
function displayChattingArea(id){
    if(actual_data[id]["owner_name"] != currentUser){
        username_to_display = actual_data[id]["owner_name"];
    }else{
        username_to_display = actual_data[id]["renter_name"];;
    }
    document.getElementById("user-face-showing").style.display="block";
    document.getElementById("username-chatting").innerHTML=username_to_display;
}
function displayAllAvailableConnectedUsers(){
    document.getElementById("messages-show").innerHTML="No Messages";
    if(displayChat){
        var side_display="";
        for(i=0; i<actual_data.length;i++){
            side_display += `<div class="row messages" id="`+ i +`">
            <i class="fas fa-user user-face"></i>
            <div class="col">`;
            for(j=0;j<2;j++){
                side_display +=`
                <div class="row">`;
                if(j==0){
                    side_display +=`
                    <div class="col" id="Username-side-display">`;
                    if(actual_data[i]["owner_name"]!=currentUser)
                        side_display += actual_data[i]["owner_name"];
                    else
                        side_display += actual_data[i]["renter_name"];
                }else{
                    
                    side_display +=`
                    <div class="col" id="message-side-display-`+ i +`">`;
                    side_display += actual_data[i]["message"].substring(0,20)+"...";
                }
                side_display += `</div></div>`;
            }
            side_display += `</div></div>`;
        }
        document.getElementById("messages-show").innerHTML=side_display;
    }
}

function connectIO(i){
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);  
    var owner_status = 0;  // Connecting to socket io to the domain with configured protocol
    if(actual_data[i]["owner_name"] == currentUser){
        username_to_send = currentUser;
        owner_status = 1;
    }else{
        username_to_send = actual_data[i]["renter_name"];
    }
    
    count = 0;
    document.getElementById("messages").innerHTML="";
    socket.on('connect', function (){   // When connected run this function
        socket.emit('joined_room',{ //triggers joined_room event and passes username and room
            username: username_to_send, 
            owner_status: owner_status,
            room: roomId[i]["room_id"]
        });
    });
    socket.on('join_room', function (all_info_data){ // Frontend rejoin_room envoked
        // previous messages restored
        datas = all_info_data["data"];
        message = datas["Message"];
        username = datas["Username"];
        if(count==0){
            for (var i = message.length-1; i>=0 ; i--){
                count++;
                addMessages(username[message[i][0]], message[i][1]);
            }
        }
        if(currentUser === datas["current_username"]){
            updateScroll();
            detailsShowingOwnerRenter(all_info_data);
        }
    });
    document.getElementById("message_input_form").onsubmit = function (e) {
        e.preventDefault();
        let message = document.getElementById("message_input").value.trim();
        if(actual_data[i]["owner_name"] == currentUser){
            user_id_to_send = roomId[i]["owner"];
        }else{
            user_id_to_send = roomId[i]["renter"];;
        }
        if(message.length){
            socket.emit('send_message',{
                username: user_id_to_send,
                room: roomId[i]["room_id"],
                message: message
            })
        }
        
        document.getElementById("message_input").value = "";   // Clear the input
        document.getElementById("message_input").focus();  // Put the input box to focus for typing again
    }
    socket.on('recieve_message', function (data){   // Frontend recieve_message envoked
        // Inserts new message
        var message_side_display_element = !!document.getElementById("message-side-display-"+i);
        if(!message_side_display_element){
            console.log("No exists");
        }
        if(data.message.length>15){
            document.getElementById("message-side-display-"+i).innerHTML = data.message.substring(0,15)+"...";
        }else{
            document.getElementById("message-side-display-"+i).innerHTML = data.message;
        }
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${data.username}: &nbsp;</b> ${data.message}`;
        document.getElementById("messages").appendChild(newNode);
        
        if(currentUser === datas["current_username"])
            updateScroll();

    });
}
function parseDataProperly(data){
    var data_data = data.replaceAll(/\[|\]/g,"").replaceAll(/}, {/g, "} , {").split(' , ');
        var seperated_message = [];
        for(var i = 0; i<data_data.length; i++){
            each_detail = data_data[i].replaceAll(/}|{/g,"").split(", ");
            var single_message = [];
            for(var j = 0; j<each_detail.length;j++){
                single_values = each_detail[j].replaceAll(/'/g,"").split(": ");
                single_message[single_values[0].replaceAll(/"/g,"")] = single_values[1].replaceAll(/"/g,"");
            }
            seperated_message.push(single_message);
        }
        return seperated_message;
}
function addMessages(username, message){
    if(message.includes(`{"email": `) || message.includes(`"phone": `)){
        var seperated_message = parseDataProperly(message);
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${username}: &nbsp;</b><mark>Email: ${seperated_message[0]["email"]}</mark>
        <br><mark>Phone Number: ${seperated_message[0]["phone"]}</mark>`;
        document.getElementById("messages").appendChild(newNode);
    }else if(message.includes(`{"latitude": `) || message.includes(`, "longitude": `)){
        var seperated_message = parseDataProperly(message);
        const newNode = document.createElement('div');
        newNode.setAttribute("id", "map");
        newNode.innerHTML = `<b>${username}:`;
        document.getElementById("messages").appendChild(newNode);
        addMap(seperated_message[0]["longitude"], seperated_message[0]["latitude"])
    }
    else{
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${username}: &nbsp;</b> ${message}`;
        document.getElementById("messages").appendChild(newNode);
    }

}

function updateScroll(){
    // While putting scroll bar on webpages it focuses on the object on the bottom of the scrollbar i.e. new messages
    var element = document.getElementById("message");
    console.log(element);
    element.scrollTop = element.scrollHeight;
}
function detailsShowingOwnerRenter(all_info_data){
    var owner_status = all_info_data["data"]["owner_status"]
    if(owner_status == 0){
        var details = all_info_data;
        displayAllAdvertisementByOwner(all_info_data["data"]["owner_status"], details["advertisement_list"], details["photo_link"]);
    }
    else{
        displaySendingData(all_info_data);
    }
}
function displaySendingData(all_info_data){
    var showDetails = document.getElementById('details-for-texting');
    showDetails.innerHTML="";
    showDetails.classList.remove("justify-content-center");
    const newNode = document.createElement('div');
    newNode.classList.add("row");
    newNode.innerHTML=`<div class="col">
        <button type="button" class="btn btn-primary chatDetailsSendButton" id="sendGeoLocation">Send Map Location</button>
        <button type="button" class="btn btn-primary chatDetailsSendButton" id="sendContact">Send Contact Info</button>
        </div>`;
    showDetails.appendChild(newNode);
    $(".chatDetailsSendButton").on('click', function () {
        id=String($(this).attr('id'));
        if(id=="sendGeoLocation"){
            displayAllAdvertisementToSendDetails(all_info_data);
        }
        if(id == "sendContact"){
            document.getElementById("message_input").value=`{"email": `+ all_info_data["contact_info"]["email"]+`, "phone": `+all_info_data["contact_info"]["phone"]+`}`;;
            document.getElementById("message-send").click();
        }
    });
}
function displayAllAdvertisementToSendDetails(all_info_data){
    var showDetails = document.getElementById('details-for-texting');
    var adDetail = all_info_data["advertisement_list"];
    var photo_link = all_info_data["photo_link"];
    var allAdvertisementDisplay = `<div class="container">
    <p id="Going-Back-Owner" style="cursor: pointer;">
    <button type="button" class="btn btn-light"><i class="fas fa-chevron-left" style="color: black;"></i> Back
    </button>
    </p>`;
    for(var i = 0; i < adDetail.length; i++){
        allAdvertisementDisplay += `<div class="row contacted-people-show chat-ads-display" id = "`+i+`">`;
        allAdvertisementDisplay += `<div class="col-6 d-flex display-contacted-people-onclick align-items-center" id="displayingAdvertisement`+ adDetail[i]["advertisement_id"]+`">
        <img src="`+photo_link[i]+`" width=100px height=100px style="margin-left:5px; border-radius:10px;">
        <span id="location-name">Type:- `+adDetail[i]["property_type"]+`<br> Location:- `+ adDetail[i]["property_address"].split(',')[0] +`</span>
    </div></div>`;
    }
    allAdvertisementDisplay +=`</div>`;
    showDetails.innerHTML= allAdvertisementDisplay;
    $(".chat-ads-display").on('click', function () {
        var id=String($(this).attr('id'));
        document.getElementById("message_input").value=`{"latitude": `+ all_info_data["geoLocation"][id]["latitude"]+`, "longitude": `+all_info_data["geoLocation"][id]["longitude"]+`}`;
        document.getElementById("message-send").click();
    });
    $("#Going-Back-Owner").on("click",function(){
        displaySendingData(all_info_data);
    });
}
function displayDetails(i, adDetail, photo_link, owner_status){
    details = adDetail[i];
    var showDetails = document.getElementById('details-for-texting');
    showDetails.innerHTML="";
    showDetails.classList.remove("justify-content-center");
    const newNode = document.createElement('div');
    newNode.classList.add("row");
    newNode.innerHTML = `<div class="col align-items-center">
        <p id="Going-Back" style="cursor: pointer;">
        <button type="button" class="btn btn-light"><i class="fas fa-chevron-left" style="color: black;"></i> Back
        </button>
        </p>
        <p>
        <img src="`+photo_link[i]+`" width=100px height=100px style="margin-left:5px; border-radius:10px;">
        </p>
        <p>
        <b>Location</b>: `+details['property_address']+`
        </p>
        <p>
        <b>Price</b>: `+details['price']+`
        </p>
        <p>
        <b>Room Count</b>: `+details['room_count']+`
        </p>
        <p>
        <b>Water Source</b>: `+details['water_source']+`
        </p>
        <p>
        <b>Bathroom</b>: `+details['bathroom']+`
        </p>
        <p>
        <b>Terrace Access</b>: `+details['terrace_access']+`
        </p>
        <p>
        <b>Details</b>: `+details['description']+`
        </p>
        <p>
        <b>Owner</b>: `+details["username"]+`
        </p>
        </div>`;
    showDetails.appendChild(newNode);
    $("#Going-Back").on("click",function(){
        displayAllAdvertisementByOwner(owner_status, adDetail, photo_link);
    });
}
function displayAllAdvertisementByOwner(owner_status, adDetail, photo_link){
    var showDetails = document.getElementById('details-for-texting');

    allAdvertisementDisplay = `<div class="container">`;
    for(var i = 0; i< adDetail.length; i++){
        allAdvertisementDisplay += `<div class="row contacted-people-show chat-ads-display" id = "`+i+`">`;
        allAdvertisementDisplay += `<div class="col-6 d-flex display-contacted-people-onclick align-items-center" id="displayingAdvertisement`+ adDetail[i]["advertisement_id"]+`">
        <img src="`+photo_link[i]+`" width=100px height=100px style="margin-left:5px; border-radius:10px;">
        <span id="location-name">Type:- `+adDetail[i]["property_type"]+`<br> Location:- `+ adDetail[i]["property_address"].split(',')[0] +`</span>
    </div></div>`;
    }
    allAdvertisementDisplay +=`</div>`;
    showDetails.innerHTML= allAdvertisementDisplay;
    $(".chat-ads-display").on('click', function () {
        id=String($(this).attr('id'));
        if(owner_status==0){
            displayDetails(id, adDetail, photo_link, owner_status);
        }
    });
}

