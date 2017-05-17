var angle = 0;


//sparar trend.json till en variabel trenddata
var trenddata = {};
var subject = "";
var opinions = [0, 0, 0]; //Positive, Neutral, Negative
var tweetSize = 0;

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
          tweetSize = opinions[0] + opinions[1] + opinions[2];
          $("#nrOfTweets").html(tweetSize);


        //if(tweetSize > 20)
        //{
        $('#loader').hide();
        changefilter(0);
        map.setInteractive = false;
        //}


          countOpinions();
        });




      //Get trending tweets
    socket.on('trends', function(msg){
        var tweetVolume = 0;

        for(var i = 0; i<10; i++) {
          trenddata = msg;
          console.log(trenddata[i].name);

          //calculate total tweet volume of all trends
          if(trenddata[i].tweet_volume != null) {
            tweetVolume += trenddata[i].tweet_volume;
          }
        }
        for (i = 0; i < 10; i++){
          var temp = document.createElement("div");

          temp.id = "bubble" + i;
          temp.className = "bubbles";
          temp.innerHTML = trenddata[i].name;
          document.getElementById("menu-list").appendChild(temp);
          temp.style.fontSize = calculateFontSize(trenddata[i].tweet_volume/tweetVolume) + 'px';
        }

        $(function(){
            var expanded = false;
            //When bubbles are clicked
            $('.bubbles').click(function()
            {
                console.log("Går in i funktion");
                $('#loader').show();
                changefilter(5);
                $('map').css('-webkit-filter', 'blur(3px)');
              console.log(collection.features);


                //$(".bubbles").css('box-shadow', 'none');
                //$(this).css('box-shadow', '0 3px 5px 0 rgba(0,0,0,.4), inset 0px -3px 1px 1px rgba(204,198,197,.5)');
                //$(".bubbles").appendTo("#menu-list"); //Move old subject to menu list
                //$(this).appendTo("#selectedSubject"); //Move sellected subject up
                var selSub = $( this ).text();
                $("#subText").text(selSub);
                $(".bubbles").css('display', 'block');
                $(this).css('display', 'none');
                $(this).css('bottom', '50%');
                $(this).css('right', '50%');
                $("#nrOfTweets").html(0); //Set number of tweets to 0 when new subject is sellected


                //Display current time, and allways with two digits
                var currentDate = new Date();
                var zeros = '00';
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var hourSize = Math.log10(hours)+1;
                var minSize = Math.log10(minutes)+1;
                if(hours == 0)
                  hourSize = 1;
                if(minutes == 0)
                  minSize = 1;
                document.getElementById("currentTime").innerHTML = 'Antal tweets sedan ' + zeros.slice(hourSize) + hours + ':' + zeros.slice(minSize) + minutes + ': ';
                opinions = [0, 0, 0]; //Empty opinon-list when a new subject is sellected

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

      var infoBox = document.getElementById('dialog-box');
      var infoBtn = document.getElementById('infoButton');
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks the button, open the info box
      infoBtn.onclick = function() {
        infoBox.style.display = "block";
        changefilter(5);
      }

      // When the user clicks on <span> (x), close the info box
      span.onclick = function() {
          infoBox.style.display = "none";
          changefilter(0);
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if(event.target == infoBox) {
            infoBox.style.display = "none";
            changefilter(0);
          }
      }
});


function countOpinions() {
    //Number of Positive, Negative and Neutral tweets
    for(var i = 0; i < collection.features.length; i++)
    switch(collection.features[i].properties.opinion) {
      case 'Positive':
          opinions[0]++;
          break;
      case 'Neutral':
          opinions[1]++;
          break;
      case 'Negative':
          opinions[2]++;
          break;
    }
}

//Calculate the font size of the trending subject, depending on its tweet volume
function calculateFontSize(pro) {
    var fontSize = pro * 100 + 5;
    if(fontSize < 10)
      fontSize = 10;
    if(fontSize > 25)
      fontSize = 25;
    return fontSize;
}
