# -*- coding: utf8 -*-
from gevent import monkey;
monkey.patch_all()

import gevent
import os
from flask import Flask, render_template, request
from flask.ext.socketio import SocketIO, emit
from twython import TwythonStreamer
from geopy.geocoders import Nominatim
from geojson import Feature, Point, FeatureCollection

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
port = int(os.getenv('VCAP_APP_PORT', 5000))

from config import CONF

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
            self.__init__()


dog = TwitterWatchDog("cat")


@app.route('/')
def index():
    dog.check_alive()
    return render_template('index.html')


@socketio.on('connect', namespace='/tweets')
def tweets_connect():
    dog.check_alive()
    uid = request.namespace.socket.sessid
    print('Client %s connected' % uid)
    while True:
        try:
            tweet = dog.streamer.queue.get(timeout=5)
        except gevent.queue.Empty:
            dog.check_alive()
        else:
            place = tweet['user']['location']
            if place is not None:
                encodedPlace = place.encode("utf-8", errors='ignore')
                geolocator = Nominatim()
                location = geolocator.geocode(encodedPlace.decode("utf-8"))
                if location is not None:
                    coordinates = []
                    coordinates.append(location.longitude)
                    coordinates.append(location.latitude)
                    temp = {'type': "Feature" , 'properties': {'opinion': 'positive', 'id': str(tweet['id']) }, 'geometry':{'type': "Point", 'coordinates': coordinates } }
                    print tweet['text']
                    emit('tweet', temp, broadcast=True)


@socketio.on('disconnect', namespace='/tweets')
def tweets_disconnect():
    dog.check_alive()
    uid = request.namespace.socket.sessid
    print('Client %s disconnected' % uid)


if __name__ == '__main__':
    try:
        socketio.run(app, port=port, host="0.0.0.0")
    except KeyboardInterrupt:
        pass
