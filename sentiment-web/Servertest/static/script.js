$(document).ready(function() {

$('form').on('submit', function(event)
{
  $.ajax({
    data : {
      message : "HEYY"
    },
    type : 'POST',
    url : '/process'
  })
  .done(function(data)
  {
    $('#text').text(data.message);
  });

event.preventDefault();
});

});
