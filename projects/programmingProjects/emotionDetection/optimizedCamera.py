import cv2
from deepface import DeepFace
from threading import Thread, Lock

cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascade_path)

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        if not self.video.isOpened():
            raise Exception("Could not open video device")
        
        # Attempt to set camera properties
        self.set_camera_properties()

        self.emotion = "Loading..."
        self.lock = Lock()
        self.thread = Thread(target=self.update_emotion)
        self.thread.daemon = True
        self.thread.start()

    def __del__(self):
        self.video.release()

    def set_camera_properties(self):
        width = 320
        height = 240
        fps = 15

        self.video.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        self.video.set(cv2.CAP_PROP_FPS, fps)

        # Verify settings
        actual_width = self.video.get(cv2.CAP_PROP_FRAME_WIDTH)
        actual_height = self.video.get(cv2.CAP_PROP_FRAME_HEIGHT)
        actual_fps = self.video.get(cv2.CAP_PROP_FPS)

        if actual_width != width or actual_height != height or actual_fps != fps:
            print(f"Warning: Could not set camera properties to {width}x{height} at {fps} FPS. Using defaults.")
            print(f"Actual settings: {actual_width}x{actual_height} at {actual_fps} FPS.")

    def update_emotion(self):
        while True:
            ret, frame = self.video.read()
            if not ret or frame is None:
                continue
            try:
                result = DeepFace.analyze(frame, actions=['emotion'])
                dominant_emotion = result[0]['dominant_emotion']
            except:
                dominant_emotion = "Error"

            with self.lock:
                self.emotion = dominant_emotion

    def get_frame(self):
        ret, frame = self.video.read()
        if not ret or frame is None:
            return None

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

        with self.lock:
            dominant_emotion = self.emotion

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, dominant_emotion, (x, y - 10), font, 0.9, (0, 0, 255), 2, cv2.LINE_AA)

        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
