import cv2
import numpy as np
from tensorflow.keras.models import load_model
from prepareData import get_face_landmarks

# Load the trained model
model_path = './fer_model_best.h5'
model = load_model(model_path)

# Define emotion labels (adjust according to your model's output)
emotion_labels = {
    0: "Happy",
    1: "Sad",
    2: "Surprise",
}


# Example usage with webcam capture
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()

    if not ret:
        print("Error: Failed to capture image from webcam.")
        break

    # Process frame to detect faces and extract landmarks
    face_landmarks = get_face_landmarks(frame)

    if face_landmarks:
        for landmarks in face_landmarks:
            try:
                # Predict emotion from landmarks using the loaded model
                emotion_idx, emotion_label = predict_emotion(landmarks)
                print(f"Predicted emotion: {emotion_label}")
                print(f"Predicted emotion index: {emotion_idx}")
                
            except ValueError as e:
                print(f"Error predicting emotion: {str(e)}")
                continue

    # Display the frame
    cv2.imshow('Emotion Detection', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
