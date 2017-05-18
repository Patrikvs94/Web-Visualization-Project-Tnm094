google.charts.load('current', {'packages':['corechart']});


google.charts.setOnLoadCallback(drawChart); 


function drawChart() {

  var data = google.visualization.arrayToDataTable([
    /*['Attityd', 'Antal'],
    ['Positiv',     11],
    ['Negative',  2],
    ['Neutral',    7]*/

    
    ['Attityd', 'Antal'],
    ['Positiv',     opinions[0]],
    ['Negative', opinions[2]],
    ['Neutral',    opinions[1]],
    ['Välj en trend för att visa attityd', opinions[3]]
    
  ]);

  console.log("drawchart kallas på");

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
            2: { color: '#ffd9b3'},
            3: {color: '#4db8ff'}
          }
    //legend: {position: 'bottom'}
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
