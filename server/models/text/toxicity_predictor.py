import json
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

tokenizer_config_path = "/home/daksh/Documents/kavach_extension-main/server/models/text/tokenizer_config.json"

# Step 1: Load the tokenizer configuration from 'tokenizer_config.json'
with open(tokenizer_config_path, 'r') as json_file:
    tokenizer_config = json.load(json_file)

# Step 2: Create a custom function to recreate the tokenizer
def recreate_tokenizer(config):
    tokenizer = Tokenizer()
    tokenizer_config = config
    tokenizer.word_index = json.loads(tokenizer_config["word_index"])
    tokenizer.document_count = tokenizer_config["document_count"]
    tokenizer.index_docs = json.loads(tokenizer_config["index_docs"])
    tokenizer.index_word = json.loads(tokenizer_config["index_word"])
    tokenizer.word_docs = json.loads(tokenizer_config["word_docs"])
    return tokenizer

# Step 3: Recreate the tokenizer using the loaded configuration
tokenizer = recreate_tokenizer(tokenizer_config)

# Step 4: Load the trained model
model = tf.keras.models.load_model("/home/daksh/Documents/kavach_extension-main/server/models/text/nlpfinals.h5")

def predict_txt(user_input):
    # Step 6: Preprocess the user input using the loaded tokenizer
    sequences = tokenizer.texts_to_sequences([user_input])

    # Find the maximum sequence length in the training data (you can adjust this if needed)
    max_sequence_length = 250

    # Pad the user input sequence to the maximum length
    new_padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)

    # Step 7: Make predictions on the user input
    num_labels = 3  # Replace with the actual number of labels in your model
    labels = ['toxic', 'obscene', 'threat']  # Replace with your actual label names

    predictions = model.predict(new_padded_sequences)

    # Step 8: Convert probabilities to True or False predictions
    threshold = 0.5  # Adjust the threshold as needed
    class_predictions = [prediction >= threshold for prediction in predictions[0]]

    return class_predictions