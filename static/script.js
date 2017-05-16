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
  allTheTweets = {};

    namespace = '/tweets'; // change to an empty string to use the global namespace

    // the socket.io documentation recommends sending an explicit package upon connection
    // this is specially important when using the global namespace
    var socket = io.connect('//' + document.domain + ':' + location.port + namespace);
  //  var socketProcess = io.connect('//' + document.domain + ':' + location.port + '/process');

    // event handler for server sent data
    // the data is displayed in the "Received" section of the page
    socket.on('tweet', function(msg) {

        var time = (new Date(msg.properties.time)).getMinutes();
        if(!isNaN(time))
        {
          console.log(time + "inserted");
          if (!(allTheTweets[time]))
          {
            allTheTweets[time] = [];
          }
          allTheTweets[time].push(msg);
            //var temp = new Date(msg.properties.time);
            //console.log(temp.getMinutes());
        }
        else
        {
          if (!(allTheTweets[msg.properties.time]))
          {
            allTheTweets[msg.properties.time] = [];
          }
          allTheTweets[msg.properties.time].push(msg);
        }
        });

      //Get trending tweets
    socket.on('trends', function(msg){
        for(var i = 0; i<10; i++) {
          trenddata = msg;
          console.log(trenddata[i].name);
        }
        for (i = 0; i < 10; i++){
          var temp = document.createElement("li");

          temp.id = "bubble" + i;
          temp.className = "bubbles";
          temp.innerHTML = trenddata[i].name;
          temp.onclick = changefilter(0);
          //temp.style.left = '45vw';
          //temp.style.top = '50vh';
          document.getElementById("menu-list").appendChild(temp);
        }

        //On start make map blurry
        //changefilter(5);

        $(function(){
            var expanded = false;
            //When bubbles are clicked
            $('.bubbles').click(function()
            {
              console.log(collection.features);

                //Mark clicked bubble and move bubbles to top
                /*if (!expanded){
                    $("#bubble-container").animate({'top' : '0%', 'width' : '80%', 'left' : '10%' }, {duration : 500});
                    $("nobr.testClass > h1").remove();
                    $("nobr.testClass > h3").remove();
                    expanded = true;
                    changefilter(0);
                }*/
                $(".bubbles").css('box-shadow', 'none');
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

    /** INFORUTA **/
    $('#dialog-box').hide();
    $('#dialog-trigger').click(function() {
        $('.wrapper').addClass('blur');
        $('#dialog-box').show();
    });

    $('#close').click(function() {
        $('#dialog-box').hide();
        $('.wrapper').removeClass('blur');
    }); /**inforuta slut**/
});
