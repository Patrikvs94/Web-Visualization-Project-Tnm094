/* GLOBAL VARIABLES */
var currentdate = new Date();
var timeShift = 59- currentdate.getMinutes();

console.log(currentdate.getHours() + ":" + currentdate.getMinutes());


function selectedData()
{
  if(parseInt(document.getElementById('slider').value) < 60)
  {
    var minute = parseInt(document.getElementById('slider').value)- timeShift;
    var hour = currentdate.getHours();
    if(minute < 0 )
    {
      hour--;
      minute+=60;
    }
    return minute;
  }
  else
  {
    return "live";
  }
}

/* SLIDER */
document.getElementById('slider').addEventListener('input', function(e) {
  if(parseInt(e.target.value) < 60)
  {
    var minute = parseInt(e.target.value)- timeShift;
    var hour = currentdate.getHours();
    if(minute < 0)
    {
      hour--;
      minute+=60;
    }
    //document.getElementById('active-minute').innerText = hour + ":" + minute;
  }
  else {
    //document.getElementById('active-minute').innerText = "Live";
  }
  countOpinions(allTheTweets[selectedData()]);

  //draw piechart
  drawChart();



});

var rangeSlider = function(){
  var slider = $('.session'),
      range = $('#slider'),
      value = $('.range-slider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html("Live");
    });

    range.on('input', function(){
      if(parseInt(document.getElementById('slider').value) < 60)
      {
        var minute = parseInt(document.getElementById('slider').value)- timeShift;
        var hour = currentdate.getHours();
        if(minute < 0 )
        {
          hour--;
          minute+=60;
        }
        $(this).next(value).css("color", "black");
        $(this).next(value).html(hour + ":" + minute);
      }
      else
      {
        $(this).next(value).css("color", "#e74c3c");
        $(this).next(value).html("Live");
      }
    });
  });
};

rangeSlider();
