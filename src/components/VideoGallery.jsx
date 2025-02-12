import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Modal, Button, Space, Input } from 'antd';
import {
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  UndoOutlined,
  DeleteFilled,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
import { formatDistanceToNow } from 'date-fns';
import { groupPhotosByHour } from '../utils/photoUtils';

const { Title } = Typography;
const { TextArea } = Input;

const VideoGallery = ({ videos, onRefresh, isTrash = false }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStarClick = async (video, event) => {
    event.stopPropagation();
    try {
      await axios.patch(`http://localhost:5000/api/photos/${video._id}/star`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  const handleTrashClick = async (video, event) => {
    event.stopPropagation();
    try {
      await axios.patch(`http://localhost:5000/api/photos/${video._id}/trash`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error moving to trash:', err);
    }
  };

  const handleRestoreClick = async (video, event) => {
    event.stopPropagation();
    try {
      await axios.patch(
        `http://localhost:5000/api/photos/${video._id}/restore`
      );
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error restoring from trash:', err);
    }
  };

  const handlePermanentDelete = async (video, event) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `http://localhost:5000/api/photos/${video._id}/permanent`
      );
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error permanently deleting video:', err);
    }
  };

  const handleDescriptionEdit = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/photos/${selectedVideo._id}/description`,
        { description }
      );
      setSelectedVideo({ ...selectedVideo, description });
      setIsEditingDescription(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating description:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      setDescription(selectedVideo.description || '');
    }
  }, [selectedVideo]);

  if (!videos || videos.length === 0) {
    return <div>No videos to display</div>;
  }

  const groupedVideos = groupPhotosByHour(videos);

  return (
    <div>
      {groupedVideos.map(([timeRange, hourVideos]) => (
        <div key={timeRange} style={{ marginBottom: '2rem' }}>
          <Title level={4} style={{ marginBottom: '1rem' }}>
            {timeRange} ({hourVideos.length} videos)
          </Title>
          <Row gutter={[16, 16]}>
            {hourVideos.map((video) => (
              <Col key={video._id} xs={24} sm={12} md={8} lg={6}>
                <div onClick={() => setSelectedVideo(video)}>
                  <VideoPlayer
                    src={video.url}
                    title={video.title}
                    actions={[
                      <Button
                        type="text"
                        icon={
                          video.isStarred ? <StarFilled /> : <StarOutlined />
                        }
                        onClick={(e) => handleStarClick(video, e)}
                      />,
                      isTrash ? (
                        <>
                          <Button
                            type="text"
                            icon={<UndoOutlined />}
                            onClick={(e) => handleRestoreClick(video, e)}
                          />
                          <Button
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={(e) => handlePermanentDelete(video, e)}
                            danger
                          />
                        </>
                      ) : (
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleTrashClick(video, e)}
                        />
                      ),
                    ]}
                    description={
                      <>
                        <div>
                          {new Date(video.createdAt).toLocaleTimeString()}
                        </div>
                        {video.description && (
                          <div style={{ color: '#666' }}>
                            {video.description}
                          </div>
                        )}
                        {video.deletedAt && (
                          <div style={{ color: 'red' }}>
                            Deleted:{' '}
                            {new Date(video.deletedAt).toLocaleDateString()}
                          </div>
                        )}
                      </>
                    }
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <Modal
        open={!!selectedVideo}
        onCancel={() => {
          setSelectedVideo(null);
          setIsEditingDescription(false);
        }}
        width="80%"
        footer={null}
        centered
      >
        {selectedVideo && (
          <div>
            <Title level={4}>{selectedVideo.title}</Title>
            <video controls style={{ width: '100%', maxHeight: '70vh' }}>
              <source
                src={`http://localhost:5000${selectedVideo.url}`}
                type={selectedVideo.mimetype}
              />
              Your browser does not support the video tag.
            </video>
            <div style={{ marginTop: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <p>
                  Uploaded{' '}
                  {formatDistanceToNow(new Date(selectedVideo.createdAt))} ago
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isEditingDescription ? (
                    <>
                      <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        style={{ flex: 1 }}
                      />
                      <Button
                        icon={<SaveOutlined />}
                        onClick={handleDescriptionEdit}
                        loading={loading}
                        type="primary"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        {selectedVideo.description || 'No description'}
                      </div>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => setIsEditingDescription(true)}
                      >
                        Edit Description
                      </Button>
                    </>
                  )}
                </div>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VideoGallery;
