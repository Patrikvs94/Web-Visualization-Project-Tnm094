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
    maxBounds: bounds
});


var colors = [["Positive", "green"],["Negative", "red"], ["Neutral", "yellow"]];
var times = ["live"];


/*
//Function that adds tweets to tweetsData
function addTweet(opinion, description, coordinates){

    tweetsData.push({
        "type": "Feature",
        "properties": {
            "opinion": opinion,
            "description": description
        },
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        }
    })
}

function clearTweets(){
    tweetsData = [];
}

addTweet("positive","Tillagd efteråt", [0, 0]);
addTweet("negative", '<img src="https://g.twimg.com/about/feature-corporate/image/twitterbird_RGB.png" style="height:100px;><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sunsets ' +
    'don&#39;t get much better than this one over <a href="https://twitter.com/GrandTetonNPS">@GrandTetonNPS</a>. ' +
    '<a href="https://twitter.com/hashtag/nature?src=hash">#nature</a> <a href="https://twitter.com/hashtag/sunset?src=hash">' +
    '#sunset</a> <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a></p>&mdash; US Dept of Interior ' +
    '(@Interior) <a href="https://twitter.com/Interior/status/463440424141459456">May 5, 2014</a></blockquote>', [-45, 67] );
addTweet("neutral", "Här är en neutral tweet", [76, 54]);
*/


//Load map with source and layers
map.on("load", function() {
    //Add a source with tweets
  window.setInterval(function()
  {
    map.getSource("tweets").setData({"type": "FeatureCollection", "features": collection.features});
    //console.log("updated data");
  }, 100);
    map.addSource("tweets", {
        "type": "geojson",
        "data": {"type": "FeatureCollection", "features": collection.features}/*{
        "type": "FeatureCollection",
            "features": tweetsData
    }
*/
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
                "filter": ["==", "opinion", colors[0]],
                "timefilter": ["==", "time", time  ]


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
        twttr.widgets.createTweet(
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
