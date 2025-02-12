import React from 'react';
import { Card, Space } from 'antd';

const VideoPlayer = ({ src, title, style, actions, description }) => {
  return (
    <Card hoverable bodyStyle={{ padding: 0 }} style={style} actions={actions}>
      <video
        controls
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      >
        <source src={`http://localhost:5000${src}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ padding: '8px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
        {description}
      </div>
    </Card>
  );
};

export default VideoPlayer;
