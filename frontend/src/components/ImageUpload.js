// frontend/components/ImageUpload.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/process-image';

export default function ImageUpload({ setCaption, setLoading }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError(null);

    try {
      console.log('Starting API request to:', API_URL);
      
      // Try the request with explicit configuration
      const config = {
        method: 'post',
        url: API_URL,
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
        timeout: 30000, // 30 second timeout
      };

      console.log('Request config:', config);

      const response = await axios(config);
      console.log('Response received:', response.data);

      if (response.data.success) {
        setCaption(response.data.caption);
      } else {
        throw new Error(response.data.error || 'Failed to process image');
      }
    } catch (error) {
      console.error('Full error object:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(`Server error: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response received from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
      setCaption('');
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
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