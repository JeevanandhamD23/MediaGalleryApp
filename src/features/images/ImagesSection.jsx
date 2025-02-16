import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import ImageGallery from './components/ImageGallery';
import VideoGallery from '../videos/components/VideoGallery';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { imageApi } from '../../services/api/imageApi';
import { mediaApi } from '../../services/api/mediaApi';
import { showError } from '../../utils/notifications';

const { Title } = Typography;

const ImagesSection = React.forwardRef(
  ({ query = '', isAllMedia = false, isStarred = false }, ref) => {
    const [media, setMedia] = useState({ images: [], videos: [] });
    const [loading, setLoading] = useState(false);

    const fetchMedia = async () => {
      setLoading(true);
      try {
        if (isAllMedia) {
          const response = isStarred
            ? await mediaApi.getStarred(query ? `?search=${query}` : '')
            : await mediaApi.getAll(query ? `?search=${query}` : '');

          const allMedia = response.media || [];
          setMedia({
            images: allMedia.filter((item) => item.type === 'image'),
            videos: allMedia.filter((item) => item.type === 'video'),
          });
        } else {
          const response = isStarred
            ? await imageApi.getStarred(query ? `?search=${query}` : '')
            : await imageApi.getAll(query ? `?search=${query}` : '');

          setMedia({
            images: response.images || [],
            videos: [],
          });
        }
      } catch (err) {
        showError('Failed to fetch media', err);
      } finally {
        setLoading(false);
      }
    };

    // Expose fetchMedia to parent
    React.useImperativeHandle(ref, () => ({
      fetchMedia,
    }));

    useEffect(() => {
      fetchMedia();
    }, [query, isAllMedia, isStarred]);

    if (loading) return <Loading tip="Loading media..." />;

    if (!media.images.length && !media.videos.length) {
      return <EmptyState description="No media found" />;
    }

    return (
      <div>
        {media.images.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <Title level={4}>Photos</Title>
            <ImageGallery
              images={media.images}
              onRefresh={fetchMedia}
              isTrash={false}
            />
          </div>
        )}
        {isAllMedia && media.videos.length > 0 && (
          <div>
            <Title level={4}>Videos</Title>
            <VideoGallery
              videos={media.videos}
              onRefresh={fetchMedia}
              isTrash={false}
            />
          </div>
        )}
      </div>
    );
  }
);

export default ImagesSection;
