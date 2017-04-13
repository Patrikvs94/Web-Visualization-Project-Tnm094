function changefilter(value) {
    document.getElementById("blurmap").setAttribute("style", "-webkit-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-moz-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-o-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "-ms-filter: blur(" + value + "px)");
    document.getElementById("blurmap").setAttribute("style", "filter: blur(" + value + "px)");
}