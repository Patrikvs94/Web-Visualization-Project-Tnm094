var angle = 0;


//sparar trend.json till en variabel trenddata
var trenddata = {};
var subject = "";
/*$.ajax({
    url: "static/trends.json",
    async: false,
    dataType: 'json',
    success: function(data) {
        trenddata = data;
    }
});*/

// testa printa ut trenddata
//console.log(trenddata.trends[3].name);



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

//retrieve twitter data from python
$(document).ready(function() {

  collection = {type :"FeatureCollection", features: [] };

    namespace = '/tweets'; // change to an empty string to use the global namespace

    // the socket.io documentation recommends sending an explicit package upon connection
    // this is specially important when using the global namespace
    var socket = io.connect('//' + document.domain + ':' + location.port + namespace);
  //  var socketProcess = io.connect('//' + document.domain + ':' + location.port + '/process');

    // event handler for server sent data
    // the data is displayed in the "Received" section of the page
    socket.on('tweet', function(msg) {
        console.log('bajsbajsbajs');
        if (collection.features.length > 200)
          collection.features.shift();
          collection.features.push(msg);
        });

      //Get trending tweets
    socket.on('trends', function(msg){
        for(var i = 0; i<10; i++) {
          trenddata = msg;
          console.log(trenddata[i].name);
        }
        for (i = 0; i < 10; i++){
          var temp = document.createElement("div");

          temp.id = "bubble" + i;
          temp.className = "draggable";
          temp.innerHTML = trenddata[i].name;
          temp.onclick = changefilter(0);
          //temp.style.left = '45vw';
          //temp.style.top = '50vh';
          document.getElementById("bubble-container").appendChild(temp);
        }

        //On start make map blurry
        changefilter(5);

        $(function(){
            var expanded = false;
            //When bubbles are clicked
            $('.draggable').click(function()
            {
              console.log(collection.features);
              collection.features = [];

                //Mark clicked bubble and move bubbles to top
                if (!expanded){
                    $("#bubble-container").animate({'top' : '0%', 'width' : '80%', 'left' : '10%' }, {duration : 500});
                    $("nobr.testClass > h1").remove();
                    $("nobr.testClass > h3").remove();
                    expanded = true;
                    changefilter(0);
                }
                $(".draggable").css('box-shadow', 'inset 0px 1px 0px #00a2e4, 0px 3px 0px 0px #07526e, 0px 5px 3px #999');
                $(this).css('box-shadow', '0 3px 5px 0 rgba(0,0,0,.4), inset 0px -3px 1px 1px rgba(204,198,197,.5)');

                console.log('//' + document.domain + ':' + location.port + namespace);


                //Retrieve data from python and send data to python
                $.ajax({
                    async: true,
                    data : {
                      message : $(this).text()
                    },
                    type : 'POST',
                    url : '/process'
                  })
                  .done(function(data){
                    subject = data.message;
                    console.log(subject + ' has been clicked /ajax');
                  });


                event.preventDefault();

                });
            });
      });
});
