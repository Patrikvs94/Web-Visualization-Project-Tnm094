

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
    document.getElementById('active-minute').innerText = hour + ":" + minute;
  }
  else {
    document.getElementById('active-minute').innerText = "Live";
  }
  countOpinions(allTheTweets[selectedData()]);
});
