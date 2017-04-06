$(document).ready(function() {

$('.text').click(function(event)
{
  $.ajax({
    async: true,
    data : {
      message : $(this).text()
    },
    type : 'POST',
    url : '/process'
  })
  .done(function(data)
  {
    subject = data.message;
    console.log(subject);
  });

event.preventDefault();
});

});
