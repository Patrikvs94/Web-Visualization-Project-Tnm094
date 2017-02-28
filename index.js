/**
 * Created by elinlager on 2017-02-28.
 */

//skapar en server
var http = require("http");

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};

var text1;

var success = function (data) {
	text1 = JSON.parse(data);
    console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

//Get this data from your twitter apps dashboard
var config = {
    "consumerKey": "7PIDujS6A8ZsxgGbYIowfOL1s",
    "consumerSecret": "QlKKNvIAR9mFqJRHM8JXaJbJ2VvISOcAZQeb5Zjd4scirmiXBh",
    "accessToken": "828544457918267393-6uopKW9Ztef0jZ2i6FDMQkwg0mNq178",
    "accessTokenSecret": "rqp7ozjS3xknZlIrZMSqKpJH97lkmfuJm86prcPTfNYi0"
  //  "callBackUrl": "http://localhost:63342/Kandidat/index.html?_ijt=8itc06vq7dnescaqshbevp1sg7s"
};

// make a directory in the root folder of your project called data
// copy the node_modules/twitter-node-client/twitter_config file over into data/twitter_config`
// Open `data/twitter_config` and supply your applications `consumerKey`, 'consumerSecret', 'accessToken', 'accessTokenSecret', 'callBackUrl' to the appropriate fields in your data/twitter_config file

var twitter = new Twitter(config);

//Example calls

twitter.getUserTimeline({ screen_name: 'kandidatens', count: '10'}, error, success);

//twitter.getMentionsTimeline({ count: '10'}, error, success);

//twitter.getHomeTimeline({ count: '10'}, error, success);

//twitter.getReTweetsOfMe({ count: '10'}, error, success);

//twitter.getTweet({ id: '1111111111'}, error, success);


//
// Get 10 tweets containing the hashtag haiku
//

//twitter.getSearch({'q':'#haiku','count': 10}, error, success);

//
// Get 10 popular tweets with a positive attitude about a movie that is not scary
//

//twitter.getSearch({'q':' movie -scary :) since:2013-12-27', 'count': 10, 'result\_type':'popular'}, error, success);


http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   

   response.write(text1[0].text);
   // Send the response body as "Hello World"
   response.end();
}).listen(8081);

// Console will print the message
console.log('Surfa in på http://127.0.0.1:8081/');
