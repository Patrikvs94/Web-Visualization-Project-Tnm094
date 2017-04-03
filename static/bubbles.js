function changefilter(value) {
    document.getElementById("blurmap").setAttribute("style", "-webkit-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-moz-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-o-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-ms-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "filter: blur(" + value + "px)");


    /*if(value === 0)
    {
        document.getElementById("bubble-container").setAttribute("style", "height:" + 7 + "vh");
        document.getElementById("bubble-container").setAttribute("style", "width:" + 100 + "%");
        document.getElementById("bubble-container").setAttribute("style", "top:" + 0 + "vh");
        document.getElementById("bubble-container").setAttribute("style", "left:" + 0 + "vw");
        console.log("Går in i value = " + value);
    }
    else if(value === 5)
    {
        document.getElementById("bubble-container").setAttribute("style", "height:" + 7 + "vh");
        document.getElementById("bubble-container").setAttribute("style", "width:" + 50 + "%");
        document.getElementById("bubble-container").setAttribute("style", "top:" + 85 + "vh");
        document.getElementById("bubble-container").setAttribute("style", "left:" + 25 + "vw");
        console.log("Går in i value = " + value);
    }*/
}

for (i = 0; i < 10; i++)
{
    var temp = document.createElement("div");

    temp.id = "bubble" + i;
    temp.className = "draggable";
    temp.innerHTML = trenddata.trends[i].name;
    temp.onclick = changefilter(0);
    //temp.style.left = '45vw';
    //temp.style.top = '50vh';


    document.getElementById("bubble-container").appendChild(temp);
}

$(function()
{
    var expanded = false;
    $('.draggable').click(function()
    {
        if (!expanded)
        {

            $("#bubble-container").animate({'top' : '0%', 'width' : '80%', 'left' : '10%' }, {duration : 500});
            $("nobr.testClass > h1").remove();
            $("nobr.testClass > h3").remove();
            expanded = true;
            changefilter(0);
        }
        $(".draggable").css('box-shadow', 'inset 0px 1px 0px #00a2e4, 0px 3px 0px 0px #07526e, 0px 5px 3px #999');
        $(this).css('box-shadow', '0 3px 5px 0 rgba(0,0,0,.4), inset 0px -3px 1px 1px rgba(204,198,197,.5)');

    });
});