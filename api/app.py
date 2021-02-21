import time
from flask import Flask,jsonify #import jsonify

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return str(time.time())
