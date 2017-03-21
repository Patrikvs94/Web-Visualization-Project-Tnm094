import tweepy
from tweepy import OAuthHandler
import json
import time
import os

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


trends1 = api.trends_place(1)


with open('trends.json', 'w') as outfile:
    json.dump(trends1, outfile)

print trends1
