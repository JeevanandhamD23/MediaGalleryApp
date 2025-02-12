import React, { useEffect, useState } from 'react';
import {
  Modal,
  Image,
  Button,
  Space,
  Typography,
  Descriptions,
  Input,
} from 'antd';
import {
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  DownloadOutlined,
  UndoOutlined,
  DeleteFilled,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const PhotoDetails = ({
  photo,
  visible,
  onClose,
  onRefresh,
  isTrash = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(photo.description || '');

  useEffect(() => {
    setCurrentPhoto(photo);
    setDescription(photo.description || '');
  }, [photo]);

  const handleStarClick = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:5000/api/photos/${currentPhoto._id}/star`
      );
      setCurrentPhoto(response.data);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error toggling star:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrashClick = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/photos/${currentPhoto._id}/trash`
      );
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error('Error moving to trash:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/photos/${currentPhoto._id}/restore`
      );
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error('Error restoring from trash:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/photos/${currentPhoto._id}/permanent`
      );
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error('Error permanently deleting photo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${currentPhoto.url}`;
    link.download = currentPhoto.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDescriptionSave = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:5000/api/photos/${currentPhoto._id}/description`,
        { description }
      );
      setCurrentPhoto(response.data);
      setIsEditingDescription(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating description:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      centered
    >
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={3} style={{ margin: 0 }}>
            {currentPhoto.title}
          </Title>
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            {isEditingDescription ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input.TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  style={{ width: '100%' }}
                />
                <Space>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleDescriptionSave}
                    type="primary"
                    loading={loading}
                  >
                    Save Description
                  </Button>
                  <Button onClick={() => setIsEditingDescription(false)}>
                    Cancel
                  </Button>
                </Space>
              </Space>
            ) : (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div style={{ color: '#666', flex: 1 }}>
                    {currentPhoto.description || 'No description added yet'}
                  </div>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditingDescription(true)}
                    type="text"
                  >
                    {currentPhoto.description ? 'Edit' : 'Add'} Description
                  </Button>
                </div>
              </>
            )}
          </div>
          <Space>
            <Button
              icon={currentPhoto.isStarred ? <StarFilled /> : <StarOutlined />}
              onClick={handleStarClick}
              loading={loading}
            >
              {currentPhoto.isStarred ? 'Starred' : 'Star'}
            </Button>
            {isTrash ? (
              <>
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleRestoreClick}
                  loading={loading}
                >
                  Restore
                </Button>
                <Button
                  icon={<DeleteFilled />}
                  onClick={handlePermanentDelete}
                  loading={loading}
                  danger
                  type="primary"
                >
                  Delete Permanently
                </Button>
              </>
            ) : (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleTrashClick}
                loading={loading}
                danger
              >
                Move to Trash
              </Button>
            )}
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              type="primary"
            >
              Download
            </Button>
          </Space>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {currentPhoto.mimetype.startsWith('video/') ? (
            <video controls style={{ maxHeight: '60vh', maxWidth: '100%' }}>
              <source
                src={`http://localhost:5000${currentPhoto.url}`}
                type={currentPhoto.mimetype}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={`http://localhost:5000${currentPhoto.url}`}
              style={{ maxHeight: '60vh' }}
              preview={{
                scaleStep: 0.5,
              }}
            />
          )}
        </div>

        <Descriptions bordered>
          <Descriptions.Item label="File Name">
            {currentPhoto.filename}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {currentPhoto.mimetype}
          </Descriptions.Item>
          <Descriptions.Item label="Size">
            {formatBytes(currentPhoto.size)}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {new Date(currentPhoto.createdAt).toLocaleString()}
          </Descriptions.Item>
          {currentPhoto.deletedAt && (
            <Descriptions.Item label="Deleted">
              {new Date(currentPhoto.deletedAt).toLocaleString()}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Modal>
  );
};

export default PhotoDetails;
