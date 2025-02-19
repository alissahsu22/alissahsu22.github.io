from collections import defaultdict
import cv2
from deepface import DeepFace

cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascade_path)

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        # self.video.set(cv2.CAP_PROP_FRAME_WIDTH, 320)  
        # self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
        # self.video.set(cv2.CAP_PROP_FPS, 15)
        self.emotionDict = defaultdict(int)
        self.total = 0
        self.stopped = False

        
    def __del__(self):
        self.video.release()
    
    def get_frame(self):
        if self.stopped:
            # change image 
            img = cv2.imread('tmp.jpg')
            if img is None:
                raise IOError("Cannot load image 'tmp.jpg'")
            ret, jpeg = cv2.imencode('.jpg', img)
            return jpeg.tobytes()
        
        ret, frame = self.video.read()

        try:
            result = DeepFace.analyze(frame, actions=['emotion'])
            dominant_emotion = result[0]['dominant_emotion']

        except:
            dominant_emotion = "Error"

        if dominant_emotion != 'Error':
            self.emotionDict[dominant_emotion] += 1
            self.total += 1 
        
        # print(self.total)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, 1.1, 4)
        
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, 
                    dominant_emotion,
                    (0, 50),
                    font, 1,
                    (0, 0, 255),
                    2,
                    cv2.LINE_4)

    
        ret, jpeg = cv2.imencode('.jpg', frame)

        if self.total == 10:
            print(self.emotionDict)
            self.stopped = True  
            self.video.release()

        return jpeg.tobytes()
    

