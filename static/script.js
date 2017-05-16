var angle = 0;


//sparar trend.json till en variabel trenddata
var trenddata = {};
var subject = "";
var opinions = [0, 0, 0]; //Positive, Neutral, Negative
var tweetSize = 0;

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
        if (collection.features.length > 200)
          collection.features.shift();
          collection.features.push(msg);
          tweetSize = opinions[0] + opinions[1] + opinions[2];
          $("#nrOfTweets").html(tweetSize);
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
          temp.className = "bubbles";
          temp.innerHTML = trenddata[i].name;
          //temp.onclick = changefilter(0);
          document.getElementById("menu-list").appendChild(temp);
          temp.style.fontSize = 25 - i + 'px';
        }

        $(function(){
            var expanded = false;
            //When bubbles are clicked
            $('.bubbles').click(function()
            {
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
                document.getElementById("currentTime").innerHTML = 'Number of tweets since ' + zeros.slice(hourSize) + hours + ':' + zeros.slice(minSize) + minutes + ':';
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

      //Number of Positive, Negative and Neutral tweets
    switch(collection.features) {
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

      console.log(opinions);
});
