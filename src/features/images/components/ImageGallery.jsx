import React, { useState } from 'react';
import { Row, Col, Typography } from 'antd';
import ImageCard from './ImageCard';
import ImageDetails from './ImageDetails';
import { useImageActions } from '../hooks/useImageActions';
import { formatDistanceToNow } from 'date-fns';
import { groupMediaByHour } from '../../../utils/mediaGroupUtils';

const { Title } = Typography;

const ImageGallery = ({ images, onRefresh, isTrash = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    loading,
    handleStarImage,
    handleTrashImage,
    handleRestoreImage,
    handlePermanentDelete,
  } = useImageActions(onRefresh);

  if (!images || images.length === 0) {
    return <div>No images to display</div>;
  }

  const groupedImages = groupMediaByHour(images);

  return (
    <>
      {groupedImages.map(([timeRange, hourImages]) => (
        <div key={timeRange} style={{ marginBottom: '2rem' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            {timeRange}
          </Title>
          <Row gutter={[16, 16]}>
            {hourImages.map((image) => (
              <Col xs={24} sm={12} md={8} lg={6} key={image._id}>
                <ImageCard
                  image={image}
                  onImageClick={setSelectedImage}
                  onStarClick={handleStarImage}
                  onTrashClick={handleTrashImage}
                  onRestoreClick={handleRestoreImage}
                  onDeleteClick={handlePermanentDelete}
                  loading={loading}
                  isTrash={isTrash}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <ImageDetails
        image={selectedImage}
        visible={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onRefresh={onRefresh}
        isTrash={isTrash}
      />
    </>
  );
};

export default ImageGallery;
