/* GLOBAL VARIABLES */
var trenddata = {}; //save trend.json to a variable trenddata
var subject = ""; //the current subject displayed
var opinions = [0, 0, 0, 1]; //opinions in the order: Positive, Neutral, Negative
var tweetSize = 0; //the tweet volume of the subject

$(document).ready(function() {

  //retrieve twitter data from python
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
      //console.log(time + "inserted");
      if (!(allTheTweets[time]))
      {
        allTheTweets[time] = [];
      }
      allTheTweets[time].push(msg);
    }
    else
    {
      if (!(allTheTweets[msg.properties.time]))
      {
        allTheTweets[msg.properties.time] = [];
      }
      allTheTweets[msg.properties.time].push(msg);
    }

      //Add tweets to array opinions
      if(selectedData() == new Date(msg.properties.time).getMinutes() || selectedData() == msg.properties.time) {
        switch(msg.properties.opinion) {
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
      tweetSize = opinions[0] + opinions[1] + opinions[2]; //total number of tweets
      $("#nrOfTweets").html(tweetSize); //set nrOfTweets to the number of tweets for the selected subject

      //Draw the pie chart when new tweets are retrieved
      drawChart();

      //hide loader and unblur map when tweets are showing
      $('#loader').hide();
      changefilter(0);
      map.setInteractive = false;
    });

    //Get top 10 trending tweets
    socket.on('trends', function(msg){
        var tweetVolume = 0; //tweetvolume of all subjects

        for(var i = 0; i<10; i++) {
          trenddata = msg;
          console.log(trenddata[i].name);

          //calculate total tweet volume of all trends
          if(trenddata[i].tweet_volume != null) {
            tweetVolume += trenddata[i].tweet_volume;
          }
        }
        for (i = 0; i < 10; i++){
          var temp = document.createElement("div"); //create div element for every subject

          temp.id = "bubble" + i;
          temp.className = "bubbles";
          temp.innerHTML = trenddata[i].name;
          document.getElementById("menu-list").appendChild(temp); //add subject-elements to "menu-list"
          //calculate the font size of the subjects depending on tweet volume
          temp.style.fontSize = calculateFontSize(trenddata[i].tweet_volume/tweetVolume) + 'px';
        }

        $(function(){

            //When bubbles are clicked
            $('.bubbles').click(function()
            {
                //show loader and blur map
                console.log("Går in i funktion");
                $('#loader').show();
                changefilter(5);
                $('map').css('-webkit-filter', 'blur(3px)');

                console.log(collection.features);

                var selSub = $( this ).text(); //get the selected subject
                var subjectField = $("#subText");
                $("#subText").text(selSub); //set subText to the selected subject (the speech bubble)
                $(".bubbles").css('display', 'inline-block'); //show all trending tweets (the one hidden are displayed)
                $(this).css('display', 'none'); //hide the chosen subject
                $("#nrOfTweets").html(0); //set number of tweets to 0 when new subject is sellected


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
                //set currentTime to the time the subject was clicked
                document.getElementById("currentTime").innerHTML = 'Tweets sedan ' + zeros.slice(hourSize) + hours + ':' + zeros.slice(minSize) + minutes + ': ';
                opinions = [0, 0, 0, 0]; //empty opinon-list when a new subject is sellected

                console.log('//' + document.domain + ':' + location.port + namespace);
                allTheTweets = {};


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

//Functions and variables for the info button
      var infoBox = document.getElementById('dialog-box');
      var infoBtn = document.getElementById('infoButton');
      var span = document.getElementsByClassName("close")[0];

      //when the user clicks the button, open the info box
      infoBtn.onclick = function() {
        infoBox.style.display = "block";
        changefilterInfo(5);
      }

      //when the user clicks on <span> (x), close the info box
      span.onclick = function() {
          infoBox.style.display = "none";
          changefilterInfo(0);
      }

      //when the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if(event.target == infoBox) {
            infoBox.style.display = "none";
            changefilterInfo(0);
          }
      }
});

//Calculate number of Positive, Neutral and Negative tweets
function countOpinions(allTweets) {
    opinions = [0, 0, 0, 0]; //set all opinons to 0

    for(var i = 0; i < allTweets.length; i++){
      switch(allTweets[i].properties.opinion) {
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
}

//Calculate the font size of the trending subject, depending on its tweet volume
//min size is 10px and max size is 25px
function calculateFontSize(pro) {
    var fontSize = pro * 100 + 5;
    if(fontSize < 10)
      fontSize = 10;
    if(fontSize > 25)
      fontSize = 25;
    return fontSize;
}

//Make element fade out
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

//Make element fade in
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}
