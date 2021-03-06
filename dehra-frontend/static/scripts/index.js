
$(document).ready(function(){
    var counter1=0;
    var counter2=0;
    new_actual_advertisement = actual_advertisement;
    capable = new_actual_advertisement.length;
    counter1 = displayAds(new_actual_advertisement, counter1, capable, counterNeed = 1);
    counter2 = displayAdsLatest(actual_advertisement, counter2, capable, counterNeed = 1);
    $(".advertisement-image-putting").on('click', function () {
        document.getElementById("someRandomText").style.color="black";
        ads_id = parseInt(String($(this).attr('id')).split("-")[0]);
        for(var i=0;i<new_actual_advertisement.length;i++){
            if(new_actual_advertisement[i]["advertisement_id"] == ads_id){
                list_index = i;
                break;
            }
        }
        
        document.getElementById("someRandomText").innerHTML=actual_advertisement[list_index]["property_type"];
        image_full_display = `<img class="d-block w-100" height=300px src="`+images_link_list[list_index]+`">`
        document.getElementById("Showing-images-full").innerHTML= image_full_display;
        document.getElementById("property-location").innerHTML = actual_advertisement[list_index]["property_address"];
        document.getElementById("property-price").innerHTML = actual_advertisement[list_index]["price"];
        document.getElementById("room-count").innerHTML = actual_advertisement[list_index]["room_count"];
        document.getElementById("water-source").innerHTML = actual_advertisement[list_index]["water_source"];
        document.getElementById("bathroom").innerHTML = actual_advertisement[list_index]["bathroom"];
        document.getElementById("details").innerHTML = actual_advertisement[list_index]["description"];
        document.getElementById("property-owner").innerHTML = actual_advertisement[list_index]["username"];
        document.getElementById("owner").value = actual_advertisement[list_index]["username"];
        console.log(document.getElementById("property-owner").innerHTML);
    });
});
function displayAdsLatest(advertisement_putting, counter, capable, counterNeed){
    var addAds = '';
    // console.log(counterNeed);
    if(counterNeed == 1 && counter<capable){
        counter++;
        if(counter>3){
            counter = 1;
        }
    }
    if(counterNeed == -1){
        counter--;
        if(counter==0){
            counter=3;
        }
    }
    // console.log(counter);
    if(advertisement_putting.length<=4){
        var display = advertisement_putting.length-(4*(counter-1));
    }else{
        var display = counter*4;
    }
    if(display>advertisement_putting.length){
        display = advertisement_putting.length;
    }
    addAds = addAds + `<div class = "col aligning-center justify-content-center">
        <button type="button" class="btn btn-primary btn-sm adsButton" id="latestAdLeft"><i class="fas fa-chevron-left"></i></button>
        </div>`;
    for(var i = 4*(counter-1); i< display; i++){
        // console.log(advertisement_putting[i]["advertisement_id"]);
        addAds = addAds + `<div class = "col-2 advertisement-image-putting" id="`+advertisement_putting[i]["advertisement_id"]+`-ad-new-img" data-toggle="modal" data-target="#myModal">
                <p class="details text-wrap justify-content-center" id="`+advertisement_putting[i]["advertisement_id"]+`-ad-new-details">
                    Location:- `+ advertisement_putting[i]["property_address"].split(",")[0] +`<br>
                    Price:- `+ advertisement_putting[i]["price"] +`
                </p>
            </div>`
    }
    addAds = addAds + `<div class = "col aligning-center justify-content-center">
        <button type="button" class="btn btn-primary btn-sm adsButton" id="latestAdRight"><i class="fas fa-chevron-right"></i></button>
    </div>`;
    document.getElementById("new-cities-loading").innerHTML = addAds;
    counting = 0;
    for(var i = 4*(counter-1); i< display; i++){
        // console.log(document.getElementsByClassName("advertisement-image-putting"));
        // console.log(images_link_list);
        images_loading_class = document.getElementsByClassName("advertisement-image-putting")[(counting++)+4].id;
        document.getElementById(images_loading_class).style.backgroundImage="url('"+images_link_list[i]+"')";
    }
    $(".adsButton").on("click", function(){
        var id=String($(this).attr('id'));
        if(id == "latestAdRight")
            counter = displayAdsLatest(advertisement_putting,counter,capable,1);
        else if(id == "latestAdLeft"){
            counter = displayAdsLatest(advertisement_putting,counter,capable ,-1);
        }
    });
    return counter;
}
function displayAds(new_actual_advertisement, counter, capable, counterNeed){
    //console.log(counterNeed);
    document.getElementById("major-cities-loading").innerHTML = "";
    if(counterNeed == 1 && counter<capable){
        counter++;
        if(counter>3){
            counter = 1;
        }
    }
    if(counterNeed == -1 && counter > 1){
        counter--;
        if(counter==0){
            counter=3;
        }
    }
    document.getElementById("major-cities-loading").innerHTML = "";
    if(actual_advertisement.length<=4){
        var display = new_actual_advertisement.length-(4*(counter-1));
    }else{
        var display = counter*4;
    }
    if(display>new_actual_advertisement.length){
        display = new_actual_advertisement.length;
    }
    var initial_index=0, counter_array=[];
    new_actual_advertisement.forEach(function (element, i){
        counter_array[i] = initial_index;
        initial_index++;
    });
    addAds = `<div class = "col aligning-center justify-content-center">
    <button type="button" class="btn btn-primary btn-sm adsButtons" id="Adsleft"><i class="fas fa-chevron-left"></i></button>
    </div>`;
    shuffle_index = shuffle(counter_array);
    for(var i = 4*(counter-1); i< display; i++){
        index = shuffle_index[i];
        addAds = addAds + `<div class = "col-2 advertisement-image-putting" id="`+new_actual_advertisement[index]["advertisement_id"]+`-ad-img" data-toggle="modal" data-target="#myModal">
                <p class="details text-wrap justify-content-center" id="`+new_actual_advertisement[index]["advertisement_id"]+`-ad-details">
                    Location:- `+ new_actual_advertisement[index]["property_address"].split(",")[0] +`<br>
                    Price:- `+ new_actual_advertisement[index]["price"] +`
                </p>
            </div>`
    }
    addAds = addAds + `<div class = "col aligning-center justify-content-center">
    <button type="button" class="btn btn-primary btn-sm adsButtons" id="Adsright"><i class="fas fa-chevron-right"></i></button>
    </div>`;
    // console.log(addAds);
    document.getElementById("major-cities-loading").innerHTML = addAds;
    // console.log(document.getElementById("major-cities-loading").innerHTML);
    var counting = 0;
    for(var i = 4*(counter-1); i< display; i++){
        index = shuffle_index[i];
        images_loading_class = document.getElementsByClassName("advertisement-image-putting")[counting++].id;
        //console.log(document.getElementsByClassName("advertisement-image-putting")[i]);
        document.getElementById(images_loading_class).style.backgroundImage="url('"+images_link_list[index]+"')";
    }
    $(".adsButtons").on("click", function(){
        var id=String($(this).attr('id'));
        if(id == "Adsleft"){
            console.log("left");
            counter = displayAds(new_actual_advertisement,counter,capable ,-1);
        }else if(id == "Adsright"){
            console.log("right");
            counter = displayAds(new_actual_advertisement,counter,capable,1);
        }
    });

    return counter;
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

