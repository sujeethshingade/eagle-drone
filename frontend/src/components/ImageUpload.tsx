"use client";

import { useState, ChangeEvent } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL: string = 'http://localhost:5000/api/process-image';

interface ApiResponse {
  success: boolean;
  caption?: string;
  error?: string;
}

export default function Home() {
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const formData: FormData = new FormData();
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

      const response: AxiosResponse<ApiResponse> = await axios(config);
      console.log('Response received:', response.data);

      if (response.data.success) {
        setCaption(response.data.caption || '');
      } else {
        throw new Error(response.data.error || 'Failed to process image');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error('Full error object:', axiosError);

      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response headers:', axiosError.response.headers);
        setError(`Server error: ${axiosError.response.data?.error || axiosError.response.statusText}`);
      } else if (axiosError.request) {
        console.error('Error request:', axiosError.request);
        setError('No response received from server. Please check if the server is running.');
      } else {
        console.error('Error message:', axiosError.message);
        setError(`Error: ${axiosError.message}`);
      }
      setCaption('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Toyota Hackathon
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