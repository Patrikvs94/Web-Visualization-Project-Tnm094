function changefilter(value) {
    document.getElementById("blurmap").setAttribute("style", "-webkit-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-moz-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-o-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-ms-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "filter: blur(" + value + "px)");


    if(value === 0)
    {
        //document.getElementById("bubble-container").setAttribute("style", "height:" + 7 + "vh");
        //document.getElementById("bubble-container").setAttribute("style", "width:" + 100 + "%");
        //document.getElementById("bubble-container").setAttribute("style", "top:" + 0 + "vh");
        //document.getElementById("bubble-container").setAttribute("style", "left:" + 0 + "vw");
    }
    else if(value === 5)
    {
        //document.getElementById("bubble-container").setAttribute("style", "height:" + 30 + "vh");
        //document.getElementById("bubble-container").setAttribute("style", "width:" + 50 + "%");
        //document.getElementById("bubble-container").setAttribute("style", "top:" + 35 + "vh");
        document.getElementById("bubble-container").setAttribute("style", "left:" + 25 + "vw");
    }
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