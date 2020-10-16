
    console.log("hi");
$(".advertisement-image").on('click', function () {
    document.getElementById("someRandomText").innerHTML=String($(this).attr('id'));
    document.getElementById("someRandomText").style.color="black";
});