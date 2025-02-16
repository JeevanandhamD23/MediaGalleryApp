import React, { useState, useRef } from 'react';
import axios from 'axios';
import { message, Upload, Button } from 'antd';

const MediaUpload = ({ onUploadSuccess, children }) => {
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

    // Determine if it's a video or image
    const isVideo = selectedFile.type.startsWith('video/');

    // Use the appropriate field name and endpoint
    const fieldName = isVideo ? 'video' : 'photo';
    const endpoint = isVideo ? '/api/videos' : '/api/images';

    formData.append(fieldName, selectedFile);

    try {
      await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      message.success(`${isVideo ? 'Video' : 'Photo'} uploaded successfully`);
      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(), 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      message.error(`Failed to upload ${isVideo ? 'video' : 'photo'}`);
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
      <Button loading={loading}>
        {loading ? 'Uploading...' : 'Upload Media'}
      </Button>
      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </Upload>
  );
};

export default MediaUpload;
