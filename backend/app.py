from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from model.blip_model import BlipModel

app = Flask(__name__)
CORS(app)

# Initialize model
blip_model = BlipModel()

@app.route('/api/process-image', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Generate caption
        caption = blip_model.generate_caption(image)
        
        return jsonify({
            'success': True,
            'caption': caption
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)