details = {'Location': 'Kathmandu', 'Price': "Rs. 2000 per month","Room Count": 2,"Water Source": "Well", 
        "Bathroom": "Connected", "Terrace Access": "Allowed", "Details":"Pariatur consectetur adipisicing mollit duis nostrud veniam in velit ipsum.",
         "Owner":"Raj Maharjan"}



var ioConnectStatus = 0;
var checkElement = document.getElementsByClassName("messages");
$(document).ready(function(){
    document.getElementById("showing-chatting-area").innerHTML="";
    ioConnectStatus = 0;
    if(displayChat){
        connectIO();
        displayAllAvailableConnectedUsers();
        ioConnectStatus++;
    }
    $(".messages").on('click', function () {
        id=String($(this).attr('id'));
        for(i=0; i<checkElement.length;i++){
            document.getElementById(checkElement[i].id).style.backgroundColor="#1E1E1E";
            document.getElementById(id).style.backgroundColor="black";
            detailsShowingOwnerRenter(id);
        };
        connectingToRoom(id);
        
        document.getElementById("showing-chatting-area").innerHTML="";
    });
});

function displayAllAvailableConnectedUsers(){
    if(displayChat){
        var side_display="";
        for(i=0; i<actual_data.length;i++){
            side_display += `<div class="row messages" id="`+ i +`">
            <i class="fas fa-user user-face"></i>
            <div class="col">`;
            for(j=0;j<2;j++){
                side_display +=`
                <div class="row">
                    <div class="col" id="Username-side-display">`;
                if(j==0){
                    if(actual_data[i]["owner_name"]!=currentUser)
                        side_display += actual_data[i]["owner_name"];
                    else
                        side_display += actual_data[i]["renter_name"];
                }else{
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

function connectIO(){
    const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);    // Connecting to socket io to the domain with configured protocol
}
function connectingToRoom(i){
    tempValue = { //triggers joined_room event and passes username and room
        username: actual_data['username'], 
        room: parseInt(actual_data['room_no'])
    }

    socket.on('connect', function (){   // When connected run this function
        socket.emit('joined_room',{ //triggers joined_room event and passes username and room
            username: actual_data["username"], 
            room: actual_data["room_no"]
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