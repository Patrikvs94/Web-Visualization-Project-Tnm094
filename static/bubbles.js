//Blur map when loading
function changefilter(value) {
    document.getElementById("map").setAttribute("style", "-webkit-filter: blur(" + value + "px)");
    document.getElementById("map").setAttribute("style", "-moz-filter: blur(" + value + "px)");
    document.getElementById("map").setAttribute("style", "-o-filter: blur(" + value + "px)");
    document.getElementById("map").setAttribute("style", "-ms-filter: blur(" + value + "px)");
    document.getElementById("map").setAttribute("style", "filter: blur(" + value + "px)");
}

//Blur map when showing info box
function changefilterInfo(value) {
    document.getElementById("blurmap").setAttribute("style", "-webkit-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-moz-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-o-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-ms-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "filter: blur(" + value + "px)");
}
