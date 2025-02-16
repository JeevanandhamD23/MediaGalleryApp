import React from 'react';
import { Modal } from 'antd';

const VideoPlayer = ({ video, visible, onClose }) => {
  if (!video) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width="80%"
      footer={null}
      title={video.title}
      centered
    >
      <video
        controls
        autoPlay
        style={{ width: '100%', maxHeight: '70vh' }}
        src={`http://localhost:5000${video.url}`}
      >
        Your browser does not support the video tag.
      </video>
    </Modal>
  );
};

export default VideoPlayer;
