import base64
import cv2
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from deepface import DeepFace
import numpy as np
import logging

app = Flask(__name__)
socketio = SocketIO(app)

logging.basicConfig(level=logging.DEBUG)

# Ensure the cascade file path is correct
cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascade_path)

if faceCascade.empty():
    logging.error(f"Failed to load cascade classifier from {cascade_path}")

# Function to analyze emotion
def analyze_emotion(frame):
    try:
        # Perform face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

        if len(faces) == 0:
            logging.debug("No faces detected")
            return "No Face Detected", frame

        # Assume only one face for simplicity
        (x, y, w, h) = faces[0]
        face = frame[y:y+h, x:x+w]

        # Perform emotion analysis with enforce_detection set to False
        result = DeepFace.analyze(face, actions=['emotion'], enforce_detection=False)
        dominant_emotion = result['dominant_emotion']

        # Draw a rectangle around the detected face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        return dominant_emotion, frame
    except Exception as e:
        logging.error(f"Error in analyze_emotion: {str(e)}")
        return "Error", frame

# Handling the frame event from the frontend
@socketio.on('frame')
def handle_frame(data):
    try:
        # Decode the base64 frame
        header, encoded = data.split(",", 1)
        img_data = base64.b64decode(encoded)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            logging.error("Error decoding frame")
            emit('emotion', {'emotion': "Error"})
            return

        # Analyze the emotion and draw the face box
        dominant_emotion, processed_frame = analyze_emotion(frame)

        # Encode the frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_frame_base64 = base64.b64encode(buffer).decode('utf-8')

        emit('emotion', {'emotion': dominant_emotion, 'frame': processed_frame_base64})
    except Exception as e:
        logging.error(f"Error in handle_frame: {str(e)}")
        emit('emotion', {'emotion': "Error"})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
