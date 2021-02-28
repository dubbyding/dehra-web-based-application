details = {'Location': 'Kathmandu', 'Price': "Rs. 2000 per month","Room Count": 2,"Water Source": "Well", 
        "Bathroom": "Connected", "Terrace Access": "Allowed", "Details":"Pariatur consectetur adipisicing mollit duis nostrud veniam in velit ipsum.",
         "Owner":"Raj Maharjan"}

connected_status = false
var connected_id = null;
var checkElement = document.getElementsByClassName("messages");
$(document).ready(function(){
    console.log(checkElement[0].id);
    document.getElementById("user-face-showing").style.display="none";
    displayAllAvailableConnectedUsers();
    $(".messages").on('click', function () {
        id=String($(this).attr('id'));
        if(connected_id != id && connected_id != null){
            socket.disconnect();
            connected_id = null;
            connected_status = false;
        }
        for(i=0; i<checkElement.length;i++){
            document.getElementById(checkElement[i].id).style.backgroundColor="#1E1E1E";
            document.getElementById(id).style.backgroundColor="black";
            detailsShowingOwnerRenter(id);
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
        console.log(username_to_display);
    }else{
        username_to_display = actual_data[id]["renter_name"];;
    }
    document.getElementById("user-face-showing").style.display="block";
    document.getElementById("username-chatting").innerHTML=username_to_display;
}
function displayAllAvailableConnectedUsers(){
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
                    side_display += actual_data[i]["message"];
                }
                side_display += `</div></div>`;
            }
            side_display += `</div></div>`;
        }
        document.getElementById("messages-show").innerHTML=side_display;
    }else{
        document.getElementById("messages-show").innerHTML="No Messages";
    }
}

function connectIO(i){
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);    // Connecting to socket io to the domain with configured protocol
    if(actual_data[i]["owner_name"] == currentUser){
        username_to_send = currentUser;
    }else{
        username_to_send = actual_data[i]["renter_name"];
    }
    console.log(roomId[i]["room_id"]);
    document.getElementById("messages").innerHTML="";
    socket.on('connect', function (){   // When connected run this function
        socket.emit('joined_room',{ //triggers joined_room event and passes username and room
            username: username_to_send, 
            room: roomId[i]["room_id"]
        });
    });
    socket.on('join_room', function (datas){ // Frontend rejoin_room envoked
        // previous messages restored
        message = datas["Message"];
        username = datas["Username"];
        count = 0;

        for (var key of Object.keys(message)){
            console.log(username[key]+"->"+message[key]);
            const newNode = document.createElement('div');
            newNode.innerHTML = `<b>${username[key]}: &nbsp;</b> ${message[key]}`;
            document.getElementById("messages").appendChild(newNode);
        }
        updateScroll();
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
        console.log("message-side-display-"+i);
        document.getElementById("message-side-display-"+i).innerHTML = data.message.substring(0,15);
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${data.username}: &nbsp;</b> ${data.message}`;
        document.getElementById("messages").appendChild(newNode);
        updateScroll();

    });
}
function connectingToRoom(i){
    if(actual_data[i]["owner_name"] == currentUser){
        username_to_send = currentUser;
    }else{
        username_to_send = actual_data[i]["renter_name"];
    }
    tempValue = { //triggers joined_room event and passes username and room
        username: username_to_send, 
        room: parseInt(roomId[i]["room_id"])
    }

    socket.on('connect', function (){   // When connected run this function
        socket.emit('joined_room',{ //triggers joined_room event and passes username and room
            username: username_to_send, 
            room: roomId[i]["room_id"]
        });
    });
    socket.on('join_room', function (datas){ // Frontend rejoin_room envoked
        // previous messages restored
        message = datas["Message"];
        username = datas["Username"];
        count = 0;

        for (var key of Object.keys(message)){
            console.log(username[key]+"->"+message[key]);
            const newNode = document.createElement('div');
            newNode.innerHTML = `<b>${username[key]}: &nbsp;</b> ${message[key]}`;
            document.getElementById("messages").appendChild(newNode);
        }
        updateScroll();
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
        console.log(data);
        if(roomId[i]["owner"] == data.username){
            displayusername = actual_data[i]["owner_name"]
        }else{
            displayusername = actual_data[i]["renter_name"]
        }
        
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${data.username}: &nbsp;</b> ${data.message}`;
        document.getElementById("messages").appendChild(newNode);
        updateScroll();

    });
}

function updateScroll(){
    // While putting scroll bar on webpages it focuses on the object on the bottom of the scrollbar i.e. new messages
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}
function detailsShowingOwnerRenter(i){
    var showDetails = document.getElementById('details-for-texting');
    showDetails.innerHTML="";
    showDetails.classList.remove("justify-content-center");
    const newNode = document.createElement('div');
    newNode.classList.add("row");
    if(i=='message-1'){
        newNode.innerHTML = `<div class="col align-items-center">
        <p>
        <b>Location</b>: `+details['Location']+`
        </p>
        <p>
        <b>Price</b>: `+details['Price']+`
        </p>
        <p>
        <b>Room Count</b>: `+details['Room Count']+`
        </p>
        <p>
        <b>Water Source</b>: `+details['Water Source']+`
        </p>
        <p>
        <b>Bathroom</b>: `+details['Bathroom']+`
        </p>
        <p>
        <b>Terrace Access</b>: `+details['Terrace Access']+`
        </p>
        <p>
        <b>Details</b>: `+details['Details']+`
        </p>
        <p>
        <b>Owner</b>: `+details['Owner']+`
        </p>
        </div>`;
    }
    else{
        newNode.innerHTML=`<div class="col">
        <button type="button" class="btn btn-primary chatDetailsSendButton" id="sendGeoLocation">Send Map Location</button>
        <button type="button" class="btn btn-primary chatDetailsSendButton" id="sendContact">Send Contact Info</button>
        </div>`;
    }
    showDetails.appendChild(newNode);
}

