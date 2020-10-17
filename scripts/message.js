
var checkElement = document.getElementsByClassName("messages");
$(".messages").on('click', function () {
    id=String($(this).attr('id'));
    for(i=0; i<checkElement.length;i++){
        if(id!=checkElement[i].id){
            document.getElementById(checkElement[i].id).style.backgroundColor="#1E1E1E";
        };
        document.getElementById(id).style.backgroundColor="black";
    };
});