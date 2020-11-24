$(document).ready(function(){
    if(advertisement !== ""){
        console.log(advertisement);
        var counter1=0;
        var counter2=0;
        capable = Math.floor(actual_advertisement.length/12)+1;
        console.log(capable);
        counter1 = displayAds(counter1, capable, counterNeed = 1);
        $(".advertisement-image-putting").on('click', function () {
            document.getElementById("someRandomText").style.color="black";
            console.log(parseInt(String($(this).attr('id')).split("-")[0]));
            ads_id = parseInt(String($(this).attr('id')).split("-")[0]);
            for(var i=0;i<actual_advertisement.length;i++){
                if(actual_advertisement[i]["advertisement_id"] == ads_id){
                    list_index = i;
                    break;
                }
            }
            
            document.getElementById("someRandomText").innerHTML=actual_advertisement[list_index]["property_type"];
            image_full_display = `<img class="d-block w-100" height=300px src="./static/style/img/temp/`+actual_advertisement[list_index]["photo"]+`">`
            document.getElementById("Showing-images-full").innerHTML= image_full_display;
            document.getElementById("property-location").innerHTML = actual_advertisement[list_index]["property_address"];
            document.getElementById("property-price").innerHTML = actual_advertisement[list_index]["price"];
            document.getElementById("room-count").innerHTML = actual_advertisement[list_index]["room_count"];
            document.getElementById("water-source").innerHTML = actual_advertisement[list_index]["water_source"];
            document.getElementById("bathroom").innerHTML = actual_advertisement[list_index]["bathroom"];
            document.getElementById("details").innerHTML = actual_advertisement[list_index]["description"];
            document.getElementById("property-owner").innerHTML = actual_advertisement[list_index]["username"];
        });
}
});

function displayAds(counter, capable, counterNeed){
    var addingAds = '';
    var buttonAdding ='';
    var column = 0;
    if(counterNeed == 1 && counter<capable){
        counter++;
    }
    if(counterNeed == -1 && counter > 1){
        counter--;
    }
    

    var initial_index=0, counter_array=[];
    actual_advertisement.forEach(function (element, i){
        counter_array[i] = initial_index;
        initial_index++;
    });

    shuffle_index = shuffle(counter_array);
    
    
    
    if(actual_advertisement.length<=12){
        var display = actual_advertisement.length-(12*(counter-1));
    }else{
        var display = counter*12;
    }
    if(display>actual_advertisement.length){
        display = actual_advertisement.length;
    }
    for(var i = 12*(counter-1); i< display; i++){
        console.log(actual_advertisement.length);
        if(column > 3){
            column = 0;
            addingAds = addingAds + `</div>`
        }
        if(column == 0){
            addingAds = addingAds + `<div class="row content-inside-row">`;
        }
        addingAds = addingAds + `<div class="col-3 d-flex justify-content-center align-items-center">
        <div class = "col-2 advertisement-image-putting rent-ads-img" id="`+actual_advertisement[i]["advertisement_id"]+`-ad-img" data-toggle="modal" data-target="#myModal">
                <p class="details text-wrap justify-content-center" id="`+actual_advertisement[i]["advertisement_id"]+`-ad-details">
                    Location:- `+ actual_advertisement[i]["property_address"].split(",")[0] +`<br>
                    Price:- `+ actual_advertisement[i]["price"] +`
                </p>
            </div>
    </div>`;
        column++;
    }
    console.log(addingAds);
    
    document.getElementById("Searched-ads-displaying").innerHTML=addingAds;
    for(var i = 4*(counter-1); i< display; i++){
        images_loading_class = document.getElementsByClassName("advertisement-image-putting")[i].id;
        document.getElementById(images_loading_class).style.backgroundImage="url('./static/style/img/temp/"+actual_advertisement[i]["photo"]+"')";
    }
    buttonAdding = buttonAdding + `<div class="col-1 next-button">
    <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+counter+`,`+ capable +`,-1)"><i class="fas fa-chevron-left"></i></button>
    </div>
    <div class="col-10 d-flex justify-content-center">`;
    if(capable<=12){
        for(var i=0; i<capable; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+(i+1)+`,`+ capable +`,0);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
    }else if((counter+3)>=capable){
        buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+(1)+`,`+ capable +`,0);" id="page-`+(1).toString() +`">`+(1).toString()+`</button>
                </div>`;
        buttonAdding = buttonAdding + `<div class="button-pages">...
            </div>`;
        for(var i=capable-3; i<capable; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+(i+1)+`,`+ capable +`,0);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
    }else{
        for(var i=counter; i<3; i++){
            buttonAdding = buttonAdding + `<div class="button-pages">
                    <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+(i+1)+`,`+ capable +`,0);" id="page-`+(i+1).toString() +`">`+(i+1).toString()+`</button>
                </div>`;
        }
        buttonAdding = buttonAdding + `<div class="button-pages">...
            </div>`;
        buttonAdding = buttonAdding + `<div class="button-pages">
            <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+(capable)+`,`+ capable +`,0);" id="page-`+(capable).toString() +`">`+(capable).toString()+`</button>
        </div>`;
    }
    buttonAdding = buttonAdding + `</div>
    <div class="col-1 prev-button">
        <button type="button" class="btn btn-primary btn-sm" onclick="displayAds(`+counter+`,`+ capable +`,1)"><i class="fas fa-chevron-right"></i></button>
    </div>`;
    $(".page-choose").each(function(){
        document.getElementById(this.id).innerHTML = buttonAdding;
    });
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }