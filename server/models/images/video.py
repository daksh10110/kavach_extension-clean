import numpy as np
from tqdm import tqdm
import av
import tensorflow as tf
from tensorflow import keras

img_height = 180
img_width = 180
frame_skip = 24  
batch_size = 16  


def perdict_video(video_url):
    try:
        model = keras.models.load_model('model4') #@Anirudh replace with model name
        class_names = ['adult', 'gore', 'sfw']
        container = av.open(video_url, mode='r', format='mp4')


        video_stream = next(s for s in container.streams if s.type == 'video')


        frames_to_process = video_stream.frames // frame_skip
        progress_bar = tqdm(total=frames_to_process, desc="Processing Frames", unit="frame")


        explicit_content_found = False

        frame_buffer = []


        frame_idx = 0
        while frame_idx < video_stream.frames:
            # Read the next frame
            for frame in container.decode(video_stream):
                if frame_idx % frame_skip == 0:
                    img = frame.to_ndarray(format='rgb24')
                    img = tf.image.resize(img, [img_height, img_width])
                    img_array = tf.keras.utils.img_to_array(img)
                    frame_buffer.append(img_array)

                
                    if len(frame_buffer) == batch_size:
                        
                        batch_frames = np.array(frame_buffer)
                        predictions = model.predict(batch_frames)
                        for pred in predictions:
                            score = tf.nn.softmax(pred)
                            predicted_class = class_names[np.argmax(score)]
                            confidence = np.max(score) * 100
                            print("Predicted class: {} with a {:.2f}% confidence.".format(predicted_class, confidence))

                            if predicted_class in ['gore', 'adult']:
                                explicit_content_found = True
                                break

                        frame_buffer.clear()

                        progress_bar.update(1)

                        if explicit_content_found:
                            break

                frame_idx += 1

            if explicit_content_found:
                break

        progress_bar.close()

        if explicit_content_found:
            print("Explicit content found in the video.")
            return True
        else:
            print("No explicit content detected in the video.")
            return False
           
    except Exception as e:
        print("Error occurred:", e)
        return True
        
