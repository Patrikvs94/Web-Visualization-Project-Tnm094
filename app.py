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
import urllib
import requests

sentiment_url = 'http://sentiment.vivekn.com/api/text/'

twitter = Twython(CONF['APP_KEY'], CONF['APP_SECRET'],CONF['OAUTH_TOKEN'], CONF['OAUTH_TOKEN_SECRET'])


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

@app.route('/process', methods = ['POST'])
def process():
    global subject
    subject = request.form['message']
    print subject + 'has been clicked /Python'
    collect_tweets_data_stream(subject)
    #collect_tweets_data_rest(subject)
    print 'collect_tweets_data() funkar'
    return jsonify({'message': subject})


def collect_tweets_data_stream(sub):
    dog = TwitterWatchDog(sub)
    dog.check_alive()
    print 'subject = ' + subject
    print 'sub = ' + sub
    while sub == subject:
        try:
            print('try')
            tweet = dog.streamer.queue.get(timeout=5)
        except gevent.queue.Empty:
            print('except')
            dog.check_alive()
        else:
            print('else')
            tweet_location = tweet_has_location(tweet)
            if tweet_location['exist']:
                coordinates = []
                coordinates.append(tweet_location['longitude'])
                coordinates.append(tweet_location['latitude'])
                # ordanalys
                payload = {'txt': tweet['text']}
                r = requests.post(sentiment_url, data=payload)
                print r.json()['result']['confidence']
                print r.json()['result']['sentiment']
                if r.json()['result']['confidence'] < 95:
                    r.json()['result']['sentiment'] = "Neutral"
                # print r.json()['result']['sentiment']
                temp = {'type': "Feature" , 'properties': {'opinion': r.json()['result']['sentiment'] , 'id': str(tweet['id']) }, 'geometry':{'type': "Point", 'coordinates': coordinates } }
                print tweet['text'].encode('cp850', errors='replace')
                socketio.emit('tweet', temp, namespace='/tweets')
    print sub + ' is no longer the subject'

def collect_tweets_data_rest(sub):
    query = sub + ' filter:safe'
    results = twitter.cursor(twitter.search, q=query, result_type='recent', count='100')
    counter =0
    while counter < 2000:
        for tweet in results:
            tweet_location = tweet_has_location(tweet)
            if tweet_location['exist']:
                #print tweet['created_at']
                #print tweet['text']
                #print counter
                coordinates = []
                coordinates.append(tweet_location['longitude'])
                coordinates.append(tweet_location['latitude'])
                # ordanalys
                payload = {'txt': tweet['text']}
                r = requests.post(sentiment_url, data=payload)
                # print r.json()['result']['sentiment']
                temp = {'type': "Feature" , 'properties': {'opinion': r.json()['result']['sentiment'] , 'id': str(tweet['id']) }, 'geometry':{'type': "Point", 'coordinates': coordinates } }
                #print tweet['text'].encode('cp850', errors='replace')
                socketio.emit('tweet', temp, namespace='/tweets')
            counter =counter+1;
            if counter%100==0:
                break
        results = twitter.cursor(twitter.search, q=query, result_type='recent', count='100', max_id=tweet['id'])


def tweet_has_location(tweet):
    place = tweet['user']['location']
    if place is not None:
        encodedPlace = place.encode("utf-8", errors='ignore')
        geolocator = Nominatim()
        try:
            location = geolocator.geocode(encodedPlace.decode("utf-8"), timeout=10)
        except GeocoderTimedOut as e:
            print("Error: geocode failed")
        if location is not None:
            return {'exist': True, 'longitude': location.longitude, 'latitude': location.latitude}
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

if __name__ == '__main__':
    try:
        socketio.run(app, port=port, host="0.0.0.0")
    except KeyboardInterrupt:
        pass
