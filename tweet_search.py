import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import time
import os

consumer_key = '7PIDujS6A8ZsxgGbYIowfOL1s'
consumer_secret = 'QlKKNvIAR9mFqJRHM8JXaJbJ2VvISOcAZQeb5Zjd4scirmiXBh'
access_token = '828544457918267393-6uopKW9Ztef0jZ2i6FDMQkwg0mNq178'
access_secret = 'rqp7ozjS3xknZlIrZMSqKpJH97lkmfuJm86prcPTfNYi0'

authorization = OAuthHandler(consumer_key, consumer_secret)
authorization.set_access_token(access_token, access_secret)

api = tweepy.API(authorization)


class Listener(StreamListener):
    def __init__(self, path='C:\Python27\Example\tweets_collected.json'):
        self.path = path
 
    def on_data(self, data):
        tweet = data.split(',"text":"')[1].split('","source":"')[0]
        print time.strftime("%Y%m%d_%H%M%S"), tweet
 
        # Open, Write then Close the file
        savefile = open(self.path, 'ab')
        savefile.write(data)
        savefile.close()

filename = "tweets_collected"
 
script_dir = os.path.dirname(__file__)
rel_path = filename + ".json"
file_path = os.path.join(script_dir, rel_path)

twitterStream = Stream(
    authorization, 
    Listener(
        path = file_path
    ))
twitterStream.filter(locations=[16.106644,58.562747,16.23436,58.631351],track=['kandidatens'])
