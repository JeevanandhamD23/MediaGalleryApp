import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import VideoGallery from '../videos/components/VideoGallery';
import ImageGallery from '../images/components/ImageGallery';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { mediaApi } from '../../services/api/mediaApi';
import { showError } from '../../utils/notifications';

const { Title } = Typography;

const TrashSection = () => {
  const [media, setMedia] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(false);

  const fetchTrashItems = async () => {
    setLoading(true);
    try {
      const response = await mediaApi.getTrashItems();
      const items = response.items || [];

      // Filter based on mimetype instead of originalCollection
      setMedia({
        images: items.filter((item) => !item.mimetype.startsWith('video/')),
        videos: items.filter((item) => item.mimetype.startsWith('video/')),
      });
    } catch (err) {
      showError('Failed to fetch trash items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item) => {
    try {
      await mediaApi.restoreFromTrash(item._id);
      await fetchTrashItems();
    } catch (err) {
      showError('Failed to restore item', err);
    }
  };

  const handlePermanentDelete = async (item) => {
    try {
      await mediaApi.permanentDelete(item._id);
      await fetchTrashItems();
    } catch (err) {
      showError('Failed to delete item', err);
    }
  };

  useEffect(() => {
    fetchTrashItems();
  }, []);

  if (loading) return <Loading tip="Loading trash items..." />;

  if (!media.images.length && !media.videos.length) {
    return <EmptyState description="Trash is empty" />;
  }

  return (
    <div>
      {media.videos.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <Title level={4}>Videos in Trash</Title>
          <VideoGallery
            videos={media.videos}
            onRefresh={fetchTrashItems}
            onRestoreClick={handleRestore}
            onDeleteClick={handlePermanentDelete}
            isTrash={true}
          />
        </div>
      )}
      {media.images.length > 0 && (
        <div>
          <Title level={4}>Images in Trash</Title>
          <ImageGallery
            images={media.images}
            onRefresh={fetchTrashItems}
            onRestoreClick={handleRestore}
            onDeleteClick={handlePermanentDelete}
            isTrash={true}
          />
        </div>
      )}
    </div>
  );
};

export default TrashSection;
