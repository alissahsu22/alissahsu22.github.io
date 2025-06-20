import cv2
import numpy as np
import pickle
from prepareData import get_face_landmarks

# Load the trained model
with open('./model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define emotion labels (adjust according to your model's output)
# emotion_labels = {
#     0: "Angry",
#     1: "Disgust",
#     2: "Fear",
#     3: "Happy",
#     4: "Sad",
#     5: "Surprise",
#     6: "Neutral"
# }
emotion_labels = {
    0: "Happy",
    1: "Sad",
    2: "Surprise",
}

# Function to predict emotion from landmarks
def predict_emotion(landmarks):
    if len(landmarks) != 136:
        raise ValueError(f"Expected 136 features, but got {len(landmarks)} features.")
    
    emotion_idx = model.predict([landmarks])[0]
    emotion_label = emotion_labels.get(emotion_idx, "Unknown")
    
    return emotion_idx, emotion_label

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
                # Verify the number of features (landmarks) before prediction
                num_landmarks = len(landmarks)
                # print(f"Number of landmarks: {num_landmarks}")
                
                # Print the actual landmarks to verify content
                # print(f"Landmarks: {landmarks}")
                
                if num_landmarks != 136:
                    print(f"Warning: Expected 136 landmarks, but got {num_landmarks}. Skipping this entry.")
                    continue
                
                emotion_idx, emotion_label = predict_emotion(landmarks)
                print(f"Predicted emotion: {emotion_label}")
                #  emotion_idx = predict_emotion(landmarks)
                
                # emotion_idx = predict_emotion(landmarks[:-1])  # Exclude the emotion label
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
