"use client";

import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import Result from '../components/Result';

export default function Home() {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Image to Text Converter
      </h1>
      <ImageUpload setCaption={setCaption} setLoading={setLoading} />
      <Result caption={caption} loading={loading} />
    </div>
  );
}