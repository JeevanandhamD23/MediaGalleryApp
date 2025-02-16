import React, { useRef, useEffect } from 'react';
import { Card, Button, Space, Tooltip } from 'antd';
import {
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  UndoOutlined,
  DeleteFilled,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/mediaHelpers';

const VideoCard = ({
  video,
  onVideoClick,
  onStarClick,
  onTrashClick,
  onRestoreClick,
  onDeleteClick,
  loading,
  isTrash,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Load the video to generate thumbnail
    if (videoRef.current) {
      videoRef.current.currentTime = 1; // Set to 1 second to get a non-black frame
      videoRef.current.load();
    }
  }, [video.url]);

  return (
    <Card
      hoverable
      cover={
        <div
          style={{
            height: 200,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => onVideoClick(video)}
        >
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
            src={`http://localhost:5000${video.url}`}
            preload="metadata"
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayCircleOutlined style={{ fontSize: 48, color: '#fff' }} />
          </div>
        </div>
      }
      actions={
        isTrash
          ? [
              <Tooltip title="Restore">
                <Button
                  icon={<UndoOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestoreClick && onRestoreClick(video);
                  }}
                  loading={loading?.restore}
                />
              </Tooltip>,
              <Tooltip title="Delete Permanently">
                <Button
                  danger
                  icon={<DeleteFilled />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick && onDeleteClick(video);
                  }}
                  loading={loading?.delete}
                />
              </Tooltip>,
            ]
          : [
              <Tooltip
                title={
                  video.isStarred ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Button
                  icon={video.isStarred ? <StarFilled /> : <StarOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarClick && onStarClick(video);
                  }}
                  loading={loading?.star}
                />
              </Tooltip>,
              <Tooltip title="Move to trash">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrashClick && onTrashClick(video);
                  }}
                  loading={loading?.delete}
                />
              </Tooltip>,
            ]
      }
    >
      <Card.Meta
        title={video.title}
        description={
          <Space direction="vertical" size="small">
            <div>{video.description || 'No description'}</div>
            <div>{formatFileSize(video.size)}</div>
          </Space>
        }
      />
    </Card>
  );
};

export default VideoCard;
