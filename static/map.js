//Load map
var bounds = [
    [-170, -60], // Southwest coordinates
    [180, 80    ]  // Northeast coordinates
];


mapboxgl.accessToken = 'pk.eyJ1Ijoic292YW5ueSIsImEiOiJjaXpnc3YxYTAwMDI0MzNvMzI0am13cmNuIn0.nXZ_-XK8THtmYTIQosey1w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/sovanny/cizgswpga00to2sqz9xcdew48', //stylesheet location
    center: [0, 50], // starting position
    zoom: 1, // starting zoom
    maxBounds: bounds,
    interactive: true
});


var colors = [["Positive", "#53c653"],["Negative", "#ff3333"], ["Neutral", "#ffbf80"]];


//Load map with source and layers
map.on("load", function() {
    //Add a source with tweets
  window.setInterval(function()
  {
    /*
    map.getSource("tweets").setData({"type": "FeatureCollection", "features": collection.features});
    */
      minute = SelectedData();

      if(allTheTweets[minute])
        map.getSource("tweets").setData({"type": "FeatureCollection", "features": allTheTweets[minute] });
      else {
        map.getSource("tweets").setData({"type": "FeatureCollection", "features": [] });
      }
    //console.log("updated data");
  }, 100);
    map.addSource("tweets", {
        "type": "geojson",
        "data": {"type": "FeatureCollection", "features": collection.features}
    });

    //Add layers for different opinions. Red if negative, green if positive and yellow if neutral.
        colors.forEach(function(colors) {
            map.addLayer({
                "id": "opinionis" + colors[0],
                "type": "circle",
                "source":"tweets",
                "paint": {
                    "circle-radius": 10,
                    "circle-color": colors[1],
                    "circle-opacity": 0.5,
                    "circle-blur": 0.5
                },
                "filter": ["==", "opinion", colors[0]]


            })
        })

});


// When a click event occurs near a place, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {

    var features = map.queryRenderedFeatures(e.point, { layers: ["opinionisPositive", "opinionisNegative", "opinionisNeutral"] });

    if (!features.length) {
        return;
    }

    var feature = features[0];




    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        //.setHTML("hej")
        .setHTML("<div id='container'></div>")
        .addTo(map);

        //When clicked show the right twitter widget
        var twtt = twttr.widgets.createTweet(
            feature.properties.id,
            document.getElementById('container'), {
                width: "300"
            }
        );

});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ["opinionisPositive", "opinionisNegative", "opinionisNeutral"] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
