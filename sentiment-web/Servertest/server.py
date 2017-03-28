from flask import Flask, render_template, request, jsonify
from twitters import twitterStream
from multiprocessing import Process
import sys

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods = ['POST'])
def process():
    print "HEY"
    print twitterStream.listener.features
    return jsonify({'features': twitterStream.listener.features})

def func1():
    print "Twitter started"
    twitterStream.filter(track=['InternationalDayOfHappiness'])

def func2():
    print "Flask started"
    app.run()

#Filtering the information given
if __name__=='__main__':
    p2 = Process(target = func2)
    p2.start()
    p1 = Process(target = func1())
    p1.start
