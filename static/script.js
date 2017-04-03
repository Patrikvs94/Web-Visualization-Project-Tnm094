var angle = 0;


//sparar trend.json till en variabel trenddata

var trenddata = {};
$.ajax({
    url: "static/trends.json",
    async: false,
    dataType: 'json',
    success: function(data) {
        trenddata = data;
    }
});

// testa printa ut trenddata
console.log(trenddata.trends[3].name);



interact('.draggable').gesturable({
    onmove: function (event) {
        var arrow = document.getElementById('arrow');

        angle += event.da;

        arrow.style.webkitTransform =
            arrow.style.transform =
                'rotate(' + angle + 'deg)';

        document.getElementById('angle-info').textContent =
            angle.toFixed(2) + '°';
    }
});

// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            var bubble = event.target;
            bubble.style.animationPlayState="running";

        }
    });

function dragMoveListener (event) {
    var target = event.target;
    //target.style.animationPlayState="paused";
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.marginLeft= x +"px";
    target.style.marginTop= y +"px";

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
