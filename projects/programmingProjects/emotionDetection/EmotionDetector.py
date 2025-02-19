from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
from camera import VideoCamera

app = Flask(__name__)
socket_io = SocketIO(app)

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

@socket_io.on('connect')
def test_connect():
    print("Client connected")
    socket_io.emit('test_event', {'data': 'Test successful!'})

if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=1000, debug=True)
