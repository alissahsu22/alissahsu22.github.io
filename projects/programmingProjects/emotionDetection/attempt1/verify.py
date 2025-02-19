import cv2
import os
import pickle
from prepareData import get_face_landmarks  # Assuming this function is defined in prepareData.py
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Load the trained model
with open('./model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define emotions for evaluation
emotions = ['HAPPY', 'SAD', 'SURPRISED']

# Directory containing test data
test_data_dir = './data/test'

# Initialize lists to store true and predicted labels
true_labels = []
predicted_labels = []

# Iterate through each emotion folder in the test data directory
for emotion_index, emotion_folder in enumerate(emotions):
    emotion_path = os.path.join(test_data_dir, emotion_folder)
    
    if not os.path.isdir(emotion_path):
        continue
    
    # Iterate through images in the current emotion folder
    for filename in os.listdir(emotion_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(emotion_path, filename)
            image = cv2.imread(image_path)
            
            if image is None:
                print(f"Error loading image: {image_path}")
                continue
            
            # Process image to detect faces and extract landmarks
            face_landmarks = get_face_landmarks(image)
            
            if face_landmarks:
                for landmarks in face_landmarks:
                    try:
                        # Predict emotion from landmarks
                        emotion_idx = model.predict([landmarks])[0]  # Exclude the emotion label
                        predicted_emotion = emotions[int(emotion_idx)]
                        
                        # Append true and predicted labels for later evaluation
                        actual_emotion = emotion_folder.upper()  # Extracted from folder name
                        true_labels.append(actual_emotion)
                        predicted_labels.append(predicted_emotion)
                        
                        # Print actual and predicted emotions
                        print(f"Image: {filename}, Actual Emotion: {actual_emotion}, Predicted Emotion: {predicted_emotion}")
                        
                        # Optionally, you can save these results for further analysis
                        # For example, store them in a list or write to a file
                        
                    except ValueError as e:
                        print(f"Error predicting emotion: {str(e)}")
                        continue

# Calculate accuracy, confusion matrix, and classification report
accuracy = accuracy_score(true_labels, predicted_labels)
conf_matrix = confusion_matrix(true_labels, predicted_labels, labels=emotions)
class_report = classification_report(true_labels, predicted_labels, target_names=emotions)

# Print or use these metrics as needed
print(f"Accuracy: {accuracy}")
print("Confusion Matrix:")
print(conf_matrix)
print("Classification Report:")
print(class_report)
