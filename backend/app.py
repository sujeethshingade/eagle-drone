# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
CORS(app)

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
if not HUGGINGFACE_API_KEY:
    raise ValueError("HUGGINGFACE_API_KEY not found in environment variables!")

# Using the smaller BLIP model
API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
}

@app.route('/api/process-image', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Log the request
        logger.debug(f"Making request to Hugging Face API with image size: {len(image_bytes)} bytes")
        
        # Make request to Hugging Face API
        response = requests.post(
            API_URL,
            headers=headers,
            data=image_bytes,
            timeout=30
        )
        
        # Log the response
        logger.debug(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            # The base model returns a simple string
            caption = result[0]['generated_text'] if isinstance(result, list) else result
            
            return jsonify({
                'success': True,
                'caption': caption
            })
        
        elif response.status_code == 503:
            logger.info("Model is loading, please wait...")
            return jsonify({'error': 'Model is currently loading, please try again in a few moments'}), 503
        
        else:
            logger.error(f"Error from API: {response.text}")
            return jsonify({'error': f'Error processing image: {response.text}'}), response.status_code
            
    except Exception as e:
        logger.exception("Unexpected error occurred")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)