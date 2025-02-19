import cv2
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
import pickle

# Load data from the text file
data_file = "data.txt"
data = np.loadtxt(data_file)

# Split data into features (X) and labels (y)
X = data[:, :-1]  # Features are all columns except the last one
y = data[:, -1]   # Labels are the last column

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X,
                                                    y,
                                                    test_size=0.2,
                                                    random_state=42,
                                                    shuffle=True,
                                                    stratify=y)

# Initialize the Random Forest Classifier with adjusted parameters
print("Shape of X_test:", X_test.shape)

rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the classifier on the training data
rf_classifier.fit(X_train, y_train)

# Make predictions on the test data
y_pred = rf_classifier.predict(X_test)

# Evaluate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")
print(confusion_matrix(y_test, y_pred))

# Save the trained model
with open('./model', 'wb') as f:
    pickle.dump(rf_classifier, f)

# Now, for prediction
def predict_emotion(landmarks):
    # Load the trained model
    with open('./model', 'rb') as f:
        model = pickle.load(f)
    
    # Check the number of features in landmarks
    if len(landmarks) != 136:
        raise ValueError(f"Expected 136 features, but got {len(landmarks)}")
    
    # Perform prediction
    prediction = model.predict([landmarks])[0]
    return prediction

# Example usage:
# Assuming you have a landmarks array with 136 features
# and you want to predict the emotion label
landmarks = np.random.rand(136)  # Replace with actual landmarks
emotion_prediction = predict_emotion(landmarks)
print(f"Predicted emotion: {emotion_prediction}")
