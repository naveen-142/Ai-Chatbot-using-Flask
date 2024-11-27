import logging
from flask import Flask, render_template, request, jsonify, url_for
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for the app

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the Generative AI
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')
chat = model.start_chat(history=[])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_response():
    user_input = request.json.get('message')
    app.logger.debug(f"Received message: {user_input}")

    if not user_input:
        app.logger.error("No message provided")
        return jsonify({"error": "No message provided"}), 400

    try:
        response_raw = chat.send_message(user_input)
        app.logger.debug(f"Bot response: {response_raw}")
        response = response_raw.text
        return jsonify({"response": response})
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
