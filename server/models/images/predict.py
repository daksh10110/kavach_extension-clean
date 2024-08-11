import tensorflow as tf
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import base64
import pytesseract

def predict_url(url):
    print("predict: ", url)
    img_height = 180
    img_width = 180
    class_names = ['adult', 'gore', 'sfw']

    model = tf.keras.models.load_model('model5')
    print("model loaded")
    
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    image = image.convert('RGB')

    img = image.resize((img_height, img_width))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])

    predicted_class = class_names[np.argmax(score)]
    confidence = np.max(score) * 100

    if predicted_class in ['gore', 'adult']:
        print(confidence, predicted_class)
        return True
    else:
        return extract_text_from_image(image)

def base64_to_image(base64_str):
# Remove the data URL prefix if present
    if base64_str.startswith("data:"):
        base64_str = base64_str.split(",")[1]
    image_data = base64.b64decode(base64_str)
    return Image.open(BytesIO(image_data))

def predict_base64_image(base64_str):
    print("predict: base64 image")
    img_height = 180
    img_width = 180
    class_names = ['adult', 'gore', 'sfw']

    model = tf.keras.models.load_model('model5')

    image = base64_to_image(base64_str)
    img = image.resize((img_height, img_width))
    img = img.convert("RGB")
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add an extra dimension for batch

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])

    predicted_class = class_names[np.argmax(score)]
    confidence = np.max(score) * 100

    if predicted_class in ['gore', 'adult']:
        return True
    else:
        return extract_text_from_image(image)
    
def extract_text_from_image(image):
    try:
        extracted_text = pytesseract.image_to_string(image)
        return has_obscene_words(extracted_text)
    except Exception as e:
        print("Error:", e)
        return None

obscene_words = ["fuck"]
def has_obscene_words(text):
    print(text)
    for word in obscene_words:
        if word in text:
            return True
    return False