import { useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ setCaption, setLoading }) {
  const [preview, setPreview] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload and process image
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/process-image', formData);
      setCaption(response.data.caption);
    } catch (error) {
      console.error('Error processing image:', error);
      setCaption('Error processing image. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="max-w-md h-auto rounded-lg shadow-lg"
          />
        )}
      </div>
    </div>
  );
}