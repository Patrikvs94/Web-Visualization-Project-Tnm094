google.charts.load('current', {'packages':['corechart']});


google.charts.setOnLoadCallback(drawChart);


function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Attityd', 'Antal'],
    ['Positiv',     11],
    ['Negative', 2],
    ['Neutral',    7]
  ]);

  var options = {
    //title: 'My Daily Activities'
    backgroundColor: { fill:'transparent' },
    legend: 'none',
    pieSliceText: 'label',
    chartArea: {width: '100%', height: '80%'},
    width: 'inherit',
    height: 'auto',
    slices: {
            0: { color: '#79d279' },
            1: { color: '#ff6666' },
            3: { color: '#ffd9b3'}
          }
    //legend: {position: 'bottom'}
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}