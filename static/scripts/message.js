details = {'Location': 'Kathmandu', 'Price': "Rs. 2000 per month","Room Count": 2,"Water Source": "Well", 
        "Bathroom": "Connected", "Terrace Access": "Allowed", "Details":"Pariatur consectetur adipisicing mollit duis nostrud veniam in velit ipsum.",
         "Owner":"Raj Maharjan"}


var checkElement = document.getElementsByClassName("messages");
$(".messages").on('click', function () {
    id=String($(this).attr('id'));
    for(i=0; i<checkElement.length;i++){
        document.getElementById(checkElement[i].id).style.backgroundColor="#1E1E1E";
        document.getElementById(id).style.backgroundColor="black";
        detailsShowingOwnerRenter(id);
    };
});

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