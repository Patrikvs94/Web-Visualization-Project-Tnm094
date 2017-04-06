from flask import Flask, render_template, request, jsonify
#from multiprocessing import Process
#import sys

app = Flask(__name__)

@app.route('/')
def index():
    print 'hej'
    return render_template('index.html')

@app.route('/process', methods = ['POST'])
def process():
    subject = request.form['message'];
    print subject
    return jsonify({'message': subject})
    #print twitterStream.listener.features
    #return jsonify({'features': twitterStream.listener.features})


if __name__ == '__main__':
    app.run(debug=True)
#def func1():
#    print "Twitter started"
#    twitterStream.filter(track=['InternationalDayOfHappiness'])

#def func2():
#    print "Flask started"
#    app.run()

#Filtering the information given
#if __name__=='__main__':
#    p2 = Process(target = func2)
#    p2.start()
#    p1 = Process(target = func1())
#    p1.start
#from flask import Flask, render_template, request, jsonify
#
#app = Flask(__name__)
