import React, { useState, useRef } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Upload } from 'antd';

const PhotoUpload = ({ onUploadSuccess, children }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // If children are provided, render them as trigger
  if (children) {
    return (
      <>
        <div onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
          {React.cloneElement(children, { loading })}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/mp4,.mp4"
          style={{ display: 'none' }}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </>
    );
  }

  // Default form render
  return (
    <Upload
      customRequest={({ file }) => handleUpload(file)}
      showUploadList={false}
      accept="image/*,video/mp4,.mp4"
      beforeUpload={(file) => {
        const isValid =
          file.type.startsWith('image/') || file.type === 'video/mp4';
        if (!isValid) {
          message.error('You can only upload image or MP4 video files!');
        }
        return isValid;
      }}
    >
      <div>
        <input
          type="file"
          accept="image/*,video/mp4,.mp4"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </Upload>
  );
};

export default PhotoUpload;
