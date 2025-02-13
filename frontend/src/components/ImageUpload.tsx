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

    // Preview the image immediately after upload
    setPreview(URL.createObjectURL(file));

    setLoading(true);
    setError(null);

    try {
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

      const response: AxiosResponse<ApiResponse> = await axios(config);

      if (response.data.success) {
        setCaption(response.data.caption || '');
      } else {
        throw new Error(response.data.error || 'Failed to process image');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      if (axiosError.response) {
        setError(`Server error: ${axiosError.response.data?.error || axiosError.response.statusText}`);
      } else if (axiosError.request) {
        setError('No response received from server. Please check if the server is running.');
      } else {
        setError(`Error: ${axiosError.message}`);
      }
      setCaption('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
        Toyota Hackathon - Eagle
      </h1>

      {/* Image Upload Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center p-16 border-4 border-dashed border-indigo-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <label 
            htmlFor="file-upload"
            className="mb-4 px-6 py-3 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Choose File
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {error && (
            <div className="text-red-500 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {preview && (
            <div className="flex justify-between items-start space-x-8 mt-4">
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-md h-auto rounded-lg shadow-2xl"
                />
              </div>
              <div className="flex-grow">
                {loading ? (
                  <div className="text-center text-indigo-600 font-semibold">Processing image...</div>
                ) : caption ? (
                  <div className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-50 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Description:</h2>
                    <p className="text-lg text-gray-800">{caption}</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}