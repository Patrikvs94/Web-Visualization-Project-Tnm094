//Provar att lägga till en kommentar
//Load map
mapboxgl.accessToken = 'pk.eyJ1IjoiamFza2E3MjQiLCJhIjoiY2l6Z3JucDF2MDAxZTMzdGY5ZDY1dTdpcSJ9.ke-er3jChidKw_FqDcFK7Q';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jaska724/cizxw3qje008l2ro4hjz42as6', //stylesheet location
    center: [0, 50], // starting position
    zoom: 1 // starting zoom
});


var colors = [["positive", "green"],["negative", "red"], ["neutral", "yellow"]];


/* BEHÖVS INTE OM VI LÄSER DIREKT FRÅN JSON-FIL
//Array with the information about the tweet to place a marker
var tweetsData = [
    { //first marker
        "type": "Feature",
        "properties": {
            "opinion": "positive",
            "description": "<p>Här är ett positivt tweet</p>"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [16.192421, 58.587745]
        }
    }
];

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
addTweet("neutral", "Här är en neutral tweet", [76, 54]);*/


//Load map with source and layers
map.on("load", function() {
    //Add a source with tweets
    map.addSource("tweets", {
        "type": "geojson",
        "data": "tweetData.geojson"/*{
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
    var features = map.queryRenderedFeatures(e.point, { layers: ["opinionispositive", "opinionisnegative", "opinionisneutral"] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    var info = "<blockquote class='twitter-tweet'><p>" + feature.properties.description + "</p>&mdash; kandidaten (@kandidatens) <a href='https://twitter.com/kandidatens/status/841955881910689800'>15 mars 2017</a></blockquote>";



    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML("<div id='container'></div>")
        .addTo(map);


    twttr.widgets.createTweet(
        feature.properties.description,
        document.getElementById('container')
    );
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ["opinionispositive", "opinionisnegative", "opinionisneutral"] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});