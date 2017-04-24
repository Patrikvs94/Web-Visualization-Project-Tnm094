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
          temp.className = "floatable";
          temp.innerHTML = trenddata[i].name;
          temp.onclick = changefilter(0);
          //temp.style.left = '45vw';
          //temp.style.top = '50vh';
          document.getElementById("bubble-container").appendChild(temp);
        }

        //On start make map blurry
        //changefilter(5);

        $(function(){
            var expanded = false;
            //When bubbles are clicked
            $('.floatable').click(function()
            {
              console.log(collection.features);

                //Mark clicked bubble and move bubbles to top
                if (!expanded){
                    $("#bubble-container").animate({'top' : '0%', 'width' : '80%', 'left' : '10%' }, {duration : 500});
                    $("nobr.testClass > h1").remove();
                    $("nobr.testClass > h3").remove();
                    expanded = true;
                    changefilter(0);
                }
                $(".floatable").css('box-shadow', 'inset 0px 1px 0px #00a2e4, 0px 3px 0px 0px #07526e, 0px 5px 3px #999');
                $(this).css('box-shadow', '0 3px 5px 0 rgba(0,0,0,.4), inset 0px -3px 1px 1px rgba(204,198,197,.5)');


                console.log('//' + document.domain + ':' + location.port + namespace);
                collection.features = [];

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
