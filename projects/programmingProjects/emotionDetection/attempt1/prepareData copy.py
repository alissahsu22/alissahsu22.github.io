import cv2
import numpy as np
import os

# Print current working directory
print("Current working directory:", os.getcwd())

# Verify file paths
proto_path = 'deploy.prototxt'
model_path = 'res10_300x300_ssd_iter_140000_fp16.caffemodel'
landmark_model = 'lbfmodel.yaml'

# Check if the files exist
if not os.path.exists(proto_path) or not os.path.exists(model_path) or not os.path.exists(landmark_model):
    raise FileNotFoundError("Model files not found. Ensure 'deploy.prototxt', 'res10_300x300_ssd_iter_140000_fp16.caffemodel', and 'lbfmodel.yaml' are in the same directory as this script.")

print("Prototxt path exists:", os.path.exists(proto_path))
print("Model path exists:", os.path.exists(model_path))
print("Landmark model path exists:", os.path.exists(landmark_model))

# Load the face detection model
face_net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

# Load the facial landmarks model
landmark_detector = cv2.face.createFacemarkLBF()
landmark_detector.loadModel(landmark_model)

def get_face_landmarks(image):
    h, w = image.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    landmarks_list = []

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.5:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            rect = [int(startX), int(startY), int(endX - startX), int(endY - startY)]
            _, landmarks = landmark_detector.fit(image, np.array([rect]))
            landmarks = landmarks[0].reshape(-1, 2)

            for (x, y) in landmarks:
                cv2.circle(image, (int(x), int(y)), 1, (0, 255, 0), -1)

            landmarks_list.append(landmarks.flatten().tolist())

    return landmarks_list

# Process your dataset as before
data_dir = './data'
output = []
image_count = 0
max_images = float('inf')
# change later 

def process_directory(directory, emotion_indx):
    global image_count
    for root, dirs, files in os.walk(directory):
        for file in files:
            if image_count >= max_images:
                return
            file_ext = os.path.splitext(file)[1].lower()
            if file_ext in ['.png', '.jpg', '.jpeg']:  # Check for image file extensions
                image_path = os.path.join(root, file)
                image = cv2.imread(image_path)
                if image is None:
                    print(f"Error: Image at {image_path} not loaded properly.")
                    continue
                face_landmarks = get_face_landmarks(image)
                if face_landmarks:
                    for landmarks in face_landmarks:
                        landmarks.append(int(emotion_indx))
                        output.append(landmarks)
                image_count += 1

# Process each emotion directory
for emotion_indx, emotion in enumerate(sorted(os.listdir(data_dir))):
    if image_count >= max_images:
        break
    emotion_dir = os.path.join(data_dir, emotion)
    if not os.path.isdir(emotion_dir):
        continue
    process_directory(emotion_dir, emotion_indx)

print(f"Total processed images: {len(output)}")
np.savetxt('data.txt', np.asarray(output))
