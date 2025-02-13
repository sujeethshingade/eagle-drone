"use client";

import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/process-image';

export default function Home() {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError(null);

    try {
      console.log('Starting API request to:', API_URL);

      const config = {
        method: 'post',
        url: API_URL,
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
        timeout: 30000,
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
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(`Server error: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server. Please check if the server is running.');
      } else {
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
      setCaption('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Image to Text Converter
      </h1>

      {/* Image Upload Section */}
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

      {/* Result Section */}
      {loading ? (
        <div className="text-center">Processing image...</div>
      ) : caption ? (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Generated Caption:</h2>
          <p className="text-lg">{caption}</p>
        </div>
      ) : null}
    </div>
  );
}