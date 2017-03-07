import tweepy
from tweepy import OAuthHandler

CONSUMER_KEY = "7PIDujS6A8ZsxgGbYIowfOL1s"
CONSUMER_SECRET = "QlKKNvIAR9mFqJRHM8JXaJbJ2VvISOcAZQeb5Zjd4scirmiXBh"
ACCESS_TOKEN = "828544457918267393-6uopKW9Ztef0jZ2i6FDMQkwg0mNq178"
ACCESS_TOKEN_SECRET = "rqp7ozjS3xknZlIrZMSqKpJH97lkmfuJm86prcPTfNYi0"

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

stanford_tweets = api.user_timeline('stanford')
for tweet in stanford_tweets:
    print( tweet.created_at, tweet.text)
