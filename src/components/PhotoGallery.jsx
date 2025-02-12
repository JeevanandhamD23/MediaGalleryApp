import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image, Card, Typography, Button } from 'antd';
import {
  EyeOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  UndoOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { groupPhotosByHour } from '../utils/photoUtils';
import PhotoDetails from './PhotoDetails';

const { Title } = Typography;

const PhotoGallery = ({ photos, onRefresh, isTrash = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleStarClick = async (photo, event) => {
    event.stopPropagation();
    try {
      await axios.patch(`http://localhost:5000/api/photos/${photo._id}/star`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  const handleTrashClick = async (photo, event) => {
    event.stopPropagation();
    try {
      await axios.patch(`http://localhost:5000/api/photos/${photo._id}/trash`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error moving to trash:', err);
    }
  };

  const handleRestoreClick = async (photo, event) => {
    event.stopPropagation();
    try {
      await axios.patch(
        `http://localhost:5000/api/photos/${photo._id}/restore`
      );
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error restoring from trash:', err);
    }
  };

  const handlePermanentDelete = async (photo, event) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `http://localhost:5000/api/photos/${photo._id}/permanent`
      );
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error permanently deleting photo:', err);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  if (!photos || photos.length === 0) {
    return <div>No photos to display</div>;
  }

  const groupedPhotos = groupPhotosByHour(photos);

  return (
    <div>
      {groupedPhotos.map(([timeRange, hourPhotos]) => (
        <div key={timeRange} style={{ marginBottom: '2rem' }}>
          <Title level={4} style={{ marginBottom: '1rem' }}>
            {timeRange} ({hourPhotos.length} photos)
          </Title>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {hourPhotos.map((photo) => (
              <Card
                key={photo._id}
                hoverable
                onClick={() => handlePhotoClick(photo)}
                cover={
                  <Image
                    alt={photo.title}
                    src={`http://localhost:5000${photo.url}`}
                    style={{ objectFit: 'cover', height: '200px' }}
                    preview={false}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    icon={photo.isStarred ? <StarFilled /> : <StarOutlined />}
                    onClick={(e) => handleStarClick(photo, e)}
                  />,
                  isTrash ? (
                    <>
                      <Button
                        type="text"
                        icon={<UndoOutlined />}
                        onClick={(e) => handleRestoreClick(photo, e)}
                      />
                      ,
                      <Button
                        type="text"
                        icon={<DeleteFilled />}
                        onClick={(e) => handlePermanentDelete(photo, e)}
                        danger
                      />
                    </>
                  ) : (
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleTrashClick(photo, e)}
                    />
                  ),
                ]}
                bodyStyle={{ padding: '8px' }}
              >
                <Card.Meta
                  title={photo.title}
                  description={
                    <>
                      <div>
                        {new Date(photo.createdAt).toLocaleTimeString()}
                      </div>
                      {photo.deletedAt && (
                        <div style={{ color: 'red' }}>
                          Deleted:{' '}
                          {new Date(photo.deletedAt).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  }
                  style={{ margin: 0 }}
                />
              </Card>
            ))}
          </div>
        </div>
      ))}
      {selectedPhoto && (
        <PhotoDetails
          photo={selectedPhoto}
          visible={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onRefresh={onRefresh}
          isTrash={isTrash}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
