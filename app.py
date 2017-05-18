# -*- coding: utf8 -*-
from gevent import monkey;
monkey.patch_all()

import gevent
import os
from flask import Flask, render_template, request, jsonify
from flask.ext.socketio import SocketIO, emit
from twython import TwythonStreamer, Twython
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geojson import Feature, Point, FeatureCollection
from config import CONF
import random
import urllib
import requests
import urllib2
import sys
import base64
import json

#to randomize a sentiment value
import random

sentID=1

twitter = Twython(CONF['APP_KEY'], CONF['APP_SECRET'],CONF['OAUTH_TOKEN'], CONF['OAUTH_TOKEN_SECRET'])

# Azure portal URL.
base_url = 'https://westus.api.cognitive.microsoft.com/'
# Your account key goes here.
account_key = 'b561db1cd733414aa18a68450f338b50'

headers = {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key':account_key}


app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
port = int(os.getenv('VCAP_APP_PORT', 5000))


class TwitterStreamer(TwythonStreamer):
    def __init__(self, *args, **kwargs):
        TwythonStreamer.__init__(self, *args, **kwargs)
        print("Initialized TwitterStreamer.")
        self.queue = gevent.queue.Queue()

    def on_success(self, data):
        self.queue.put_nowait(data)
        if self.queue.qsize() > 10000:
            self.queue.get()

    def on_error(self, status_code, data):
        print status_code, data, "TwitterStreamer stopped because of an error!"
        self.disconnect()


class TwitterWatchDog:
    def __init__(self, keyword):
        self.streamer = TwitterStreamer(CONF['APP_KEY'], CONF['APP_SECRET'], CONF['OAUTH_TOKEN'], CONF['OAUTH_TOKEN_SECRET'])
        self.green = gevent.spawn(self.streamer.statuses.filter, track=keyword)

    def check_alive(self):
        if self.green.dead:
            # stop everything
            self.streamer.disconnect()
            self.green.kill()
            # then reload
            print "-------> entering dog !!!!!!!!!"
            self.__init__(subject)


trends = twitter.get_place_trends(id=1)[0]['trends']
#for trend in trends:
    #print urllib.unquote(urllib.unquote(trend['query']))
subject = ''

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/switch', methods = ['POST'])
def switch():
    return render_template('index.html')

@app.route('/process', methods = ['POST'])
def process():
    global subject
    subject = request.form['message']
    print subject + 'has been clicked /Python'
    gevent.spawn(collect_tweets_data_stream, sub=subject)
   # collect_tweets_data_rest(subject)
    print 'collect_tweets_data() funkar'
    return jsonify({'message': subject})


def collect_tweets_data_stream(sub):
    print(random.randint(1, 10))
    dog = TwitterWatchDog(sub)
    dog.check_alive()
    print 'subject = ' + subject
    print 'sub = ' + sub
    while sub == subject:
        try:
            tweet = dog.streamer.queue.get(timeout=5)
        except gevent.queue.Empty:
            dog.check_alive()
        else:
            tweet_location = tweet_has_location(tweet)
            if tweet_location['exist']:
                coordinates = []
                coordinates.append(tweet_location['longitude']+0.0001*random.randint(1, 10))
                coordinates.append(tweet_location['latitude']+0.0001*random.randint(1, 10))
                # ordanalys

                #to randomize a senitment value
                rand_sent = ['Positive', 'Negative', 'Neutral']

                print tweet['text'].encode('cp850', errors='replace')
                temp = {'type': "Feature" , 'properties': {'opinion': sentiment(tweet['text'].encode('cp850', errors='replace')), 'id': str(tweet['id']), 'time': "live" }, 'geometry':{'type': "Point", 'coordinates': coordinates } }
                socketio.emit('tweet', temp, namespace='/tweets')

    print sub + ' is no longer the subject'

def collect_tweets_data_rest(sub):
    query = sub + ' filter:safe'
    results = twitter.cursor(twitter.search, q=query, result_type='recent', count='100')
    counter =0
    print 'subject = ' + subject
    print 'sub = ' + sub
    while counter < 2000 or sub == subject:
        for tweet in results:
            tweet_location = tweet_has_location(tweet)
            if tweet_location['exist']:
                #print tweet['created_at']
                #print tweet['text']
                #print counter
                coordinates = []
                coordinates.append(tweet_location['longitude']+0.001*random.randint(1, 10))
                coordinates.append(tweet_location['latitude']+0.001*random.randint(1, 10))
                # ordanalys

                #to randomize a senitment value
                rand_sent = ['Positive', 'Negative', 'Neutral']
                print tweet['text'].encode('cp850', errors='replace')
                temp = {'type': "Feature" , 'properties': {'opinion': sentiment(tweet['text'].encode('cp850', errors='replace')) , 'id': str(tweet['id']), 'time': tweet['created_at'] }, 'geometry':{'type': "Point", 'coordinates': coordinates } }
                socketio.emit('tweet', temp, namespace='/tweets')
            counter =counter+1;
            if counter%100==0 or sub != subject:
                break
        results = twitter.cursor(twitter.search, q=query, result_type='recent', count='100', max_id=tweet['id'])


def tweet_has_location(tweet):
    place = tweet['user']['location']
    if place is not None:
        encodedPlace = place.encode("utf-8", errors='ignore')
        geolocator = Nominatim()
        try:
            location = geolocator.geocode(encodedPlace.decode("utf-8"), timeout=10)
            if location is not None:
                return {'exist': True, 'longitude': location.longitude, 'latitude': location.latitude}
        except GeocoderTimedOut as e:
            print("Error: geocode failed")
    return {'exist': False}


@socketio.on('connect', namespace='/tweets')
def tweets_connect():
    #dog.check_alive()
    #uid = request.namespace.socket.sessid
    print('Client connected')
    emit('trends', trends, broadcast=True)

@socketio.on('disconnect', namespace='/tweets')
def tweets_disconnect():
    #dog.check_alive()
    #uid = request.namespace.socket.sessid
    print('Client disconnected')


def sentiment(phrase):
    # Detect sentiment.
    global sentID
    sentID=sentID+1
    sent = '{"documents":[{"id":"'+ str(sentID)+'","text": ' + '"' + phrase + '"' + ', }]}'
    input_texts = sent
    #input_texts = '{"documents":[{"id":"1","text":"Je mappelle baguette"}]}'
    batch_sentiment_url = base_url + 'text/analytics/v2.0/sentiment'
    try:
        req = urllib2.Request(batch_sentiment_url, input_texts, headers)
        response = urllib2.urlopen(req)
        result = response.read()
        obj = json.loads(result)
        score = obj['documents'][0]['score']
        if score > 0.75:
            return "Positive"
        elif score < 0.25:
            return "Negative"
        else:
            return "Neutral"
    except urllib2.HTTPError:
        print "400 Error"


if __name__ == '__main__':
    try:
        socketio.run(app, port=port, host="0.0.0.0")
    except KeyboardInterrupt:
        pass
