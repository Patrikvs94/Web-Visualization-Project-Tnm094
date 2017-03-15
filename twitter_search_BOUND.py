import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import time
import os
from geopy.geocoders import Nominatim
from geojson import Feature, Point, FeatureCollection


#Initializing our keys and secrets for authentication
 
consumer_key = '7PIDujS6A8ZsxgGbYIowfOL1s'
consumer_secret = 'QlKKNvIAR9mFqJRHM8JXaJbJ2VvISOcAZQeb5Zjd4scirmiXBh'
access_token = '828544457918267393-6uopKW9Ztef0jZ2i6FDMQkwg0mNq178'
access_secret = 'rqp7ozjS3xknZlIrZMSqKpJH97lkmfuJm86prcPTfNYi0'


#Setting up the authorization
authorization = OAuthHandler(consumer_key, consumer_secret)
authorization.set_access_token(access_token, access_secret)

#Creating the api which we can use to call methods

api = tweepy.API(authorization)


#Creating our feature list
FeatureCollection = {}
FeatureCollection['type'] = "FeatureCollection"
FeatureCollection['features'] = []

#Create a class for the stream which is supposed to use a given json file as a path. Furthermore
#we fetch data from an open stream which gives us information that we want to trim a bit using the split function.
#We then write to the json file and if we reach an error we sleep the system and print a status message
class Listener(StreamListener):
    def __init__(self, path='tweets_collected.json'):
        self.path = path
 
    def on_data(self, data):

        #If you're using python 3.x.x make sure you're using exceptions or your program won't work
        #the try-except block can be skipped
        try:

            j = json.loads(data)
            tweet = j['user']['location']
            if tweet is not None:
                encoded = tweet.encode("utf-8", errors='ignore')

                #Does something with geopy
                geolocator = Nominatim()

                location = geolocator.geocode(encoded.decode("utf-8"))
                if location is not None:
                    data_geo = {}
                    data_geo["type"] = "Feature"
                    data_geo['properties'] = {}
                    data_geo['properties']['opinion'] = "positive"
                    data_geo['properties']['description'] = j['text'].encode("utf-8", errors='ignore')
                    data_geo['properties']['description'].decode('utf-8')
                    data_geo['geometry'] = {}
                    data_geo['geometry']['type'] = "Point"
                    data_geo['geometry']['coordinates'] = []
                    data_geo['geometry']['coordinates'].append(location.latitude)
                    data_geo['geometry']['coordinates'].append(location.longitude)
                    FeatureCollection['features'].append(data_geo)
            
                    savefile = open(self.path, 'w')
                    savefile.write(str(FeatureCollection))
                    savefile.write('\n')
                    savefile.close()
                    
                print(encoded.decode("utf-8"))
                
                # Open, Write then Close the file
                #savefile = open(self.path, 'a')
                #savefile.write(str(encoded))
                #savefile.write('\n')
                #savefile.close()
                
        except BaseException(e):
            print('failed ondata,', str(e))
            time.sleep(5)
        #on_error can also be skipped if not using python 3.x.x
    def on_error(self, status):
        print('Error:' + status)


#Initializing the filename of the json file
filename = "tweets_collected"

 #Setting up the pathing
script_dir = os.path.dirname(__file__)
rel_path = filename + ".json"
file_path = os.path.join(script_dir, rel_path)

#creating our stream
twitterStream = Stream(
    authorization, 
    Listener(
        path = file_path
    ))


#Filtering the information given
twitterStream.filter(track=['realDonaldTrump'])
