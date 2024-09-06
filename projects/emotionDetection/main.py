from flask import Flask, render_template, Response, jsonify
from flask_socketio import SocketIO, emit
from spotify import get_token, search_playlist, get_tracks_from_playlist
from camera import VideoCamera
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
socket_io = SocketIO(app)

# Flask route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for the video feed
@app.route('/video_feed')
def video_feed():
    camera = VideoCamera()  # Create a new instance of VideoCamera on each request
    return Response(gen(camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Route to search for a playlist based on emotion and return a track
@app.route('/search_playlist/<query>', methods=['GET'])
def search_playlist_route(query):
    token = get_token()
    if token:
        playlist_id = search_playlist(token, query)
        if playlist_id:
            track_info = get_tracks_from_playlist(token, playlist_id)
            if track_info:
                return jsonify(track_info)
            else:
                return jsonify({"error": "No tracks found."}), 404
        else:
            return jsonify({"error": "Playlist not found."}), 404
    else:
        return jsonify({"error": "Failed to retrieve access token."}), 500

# Function to generate the video feed and emit emotion updates
def gen(camera):
    last_emotion_dict = {}

    while True:
        frame = camera.get_frame()
        if frame is None:
            break
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame +
               b'\r\n\r\n')

        # Emit emotion data to the client only if it has changed
        if camera.total > 0:
            for emotion, count in camera.emotionDict.items():
                if last_emotion_dict.get(emotion) != count:
                    print(f"Emitting: {emotion} with count: {count}")
                    socket_io.emit('emotion_update', {'emotion': emotion, 'count': count})
                    last_emotion_dict[emotion] = count

@socket_io.on('connect')
def test_connect():
    print("Client connected")
    socket_io.emit('test_event', {'data': 'Test successful!'})

if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=1000, debug=True)
