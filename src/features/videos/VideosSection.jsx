import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import VideoGallery from './components/VideoGallery';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { videoApi } from '../../services/api/videoApi';
import { showError } from '../../utils/notifications';

const { Title } = Typography;

const VideosSection = React.forwardRef(({ query = '' }, ref) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videoApi.getAll(query);
      setVideos(response.videos || []);
    } catch (err) {
      showError('Failed to fetch videos', err);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchVideos to parent
  React.useImperativeHandle(ref, () => ({
    fetchVideos,
  }));

  useEffect(() => {
    fetchVideos();
  }, [query]);

  if (loading) return <Loading tip="Loading videos..." />;

  if (!videos.length) {
    return <EmptyState description="No videos found" />;
  }

  return (
    <div>
      <Title level={4}>Videos</Title>
      <VideoGallery videos={videos} onRefresh={fetchVideos} isTrash={false} />
    </div>
  );
});

export default VideosSection;
