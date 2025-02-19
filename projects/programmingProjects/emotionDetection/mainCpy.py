from flask import Flask, render_template, Response, jsonify
from flask_socketio import SocketIO, emit
from camera import VideoCamera
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json

# Load environment variables from .env file
load_dotenv()

# Get the client ID and client secret from the environment variables
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

app = Flask(__name__)
socket_io = SocketIO(app)

# Spotify API-related functions
def get_token():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={artist_name}&type=artist&limit=1"

    query_url = url + "?" + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]

    if len(json_result) == 0:
        return None

    return json_result[0]

def get_song_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result

# Flask routes
@app.route('/')
def index():
    return render_template('index.html')

def gen(camera):
    last_emotion_dict = {}  # Store the last emitted emotion counts

    while True:
        frame = camera.get_frame()
        if frame is None:
            break
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame +
               b'\r\n\r\n')

        # Emit emotion data to the client only if it has changed
        if camera.total > 0:  # Send updates if at least one emotion detected
            for emotion, count in camera.emotionDict.items():
                # Emit only if the count for this emotion has changed
                if last_emotion_dict.get(emotion) != count:
                    print(f"Emitting: {emotion} with count: {count}")
                    socket_io.emit('emotion_update', {'emotion': emotion, 'count': count})
                    last_emotion_dict[emotion] = count  # Update the last emitted state

@app.route('/video_feed')
def video_feed():
    camera = VideoCamera()  # Create a new instance of VideoCamera on each request
    return Response(gen(camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/search_artist/<artist_name>', methods=['GET'])
def search_artist(artist_name):
    token = get_token()
    result = search_for_artist(token, artist_name)
    if not result:
        return jsonify({"error": "Artist not found"}), 404
    
    artist_id = result['id']
    songs = get_song_by_artist(token, artist_id)
    song_names = [song['name'] for song in songs]
    return jsonify(song_names)

@socket_io.on('connect')
def test_connect():
    print("Client connected")
    socket_io.emit('test_event', {'data': 'Test successful!'})

if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=1000, debug=True)
