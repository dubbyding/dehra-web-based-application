
$(document).ready(function(){
    $(".advertisement-image-putting").on('click', function () {
        document.getElementById("someRandomText").innerHTML=String($(this).attr('id'));
        document.getElementById("someRandomText").style.color="black";
        console.log("HI");
    });
});
