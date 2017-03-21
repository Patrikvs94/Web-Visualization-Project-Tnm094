from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods = ['POST'])
def process():
    print "HEY"
    return jsonify({'message' : 'this is a message'})

if __name__ == '__main__':
    app.run(debug=True)
