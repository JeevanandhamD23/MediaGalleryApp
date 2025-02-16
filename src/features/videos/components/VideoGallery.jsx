import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Modal,
  Button,
  Space,
  Input,
  message,
} from 'antd';
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
import { groupMediaByHour } from '../../../utils/mediaGroupUtils';
import VideoCard from './VideoCard';
import VideoDetails from './VideoDetails';
import { useVideoActions } from '../hooks/useVideoActions';

const { Title } = Typography;
const { TextArea } = Input;

const VideoGallery = ({ videos, onRefresh, isTrash = false }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const {
    loading,
    handleStarVideo,
    handleTrashVideo,
    handleRestoreVideo,
    handlePermanentDelete,
  } = useVideoActions(onRefresh);

  if (!videos || videos.length === 0) {
    return null;
  }

  const groupedVideos = groupMediaByHour(videos);

  return (
    <>
      {groupedVideos.map(([timeRange, hourVideos]) => (
        <div key={timeRange} style={{ marginBottom: '2rem' }}>
          <h3>{timeRange}</h3>
          <Row gutter={[16, 16]}>
            {hourVideos.map((video) => (
              <Col xs={24} sm={12} md={8} lg={6} key={video._id}>
                <VideoCard
                  video={video}
                  onVideoClick={setSelectedVideo}
                  onStarClick={handleStarVideo}
                  onTrashClick={handleTrashVideo}
                  onRestoreClick={handleRestoreVideo}
                  onDeleteClick={handlePermanentDelete}
                  loading={loading}
                  isTrash={isTrash}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <VideoDetails
        video={selectedVideo}
        visible={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onRefresh={onRefresh}
        isTrash={isTrash}
      />
    </>
  );
};

export default VideoGallery;
