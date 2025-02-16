import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Space,
  Typography,
  Input,
  Descriptions,
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
  PlayCircleOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/mediaHelpers';
import { useVideoActions } from '../hooks/useVideoActions';
import { format } from 'date-fns';

const { Title } = Typography;
const { TextArea } = Input;

const VideoDetails = ({
  video,
  visible,
  onClose,
  onRefresh,
  isTrash = false,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    loading,
    handleStarVideo,
    handleTrashVideo,
    handleRestoreVideo,
    handlePermanentDelete,
    handleUpdateDescription,
  } = useVideoActions(onRefresh);

  useEffect(() => {
    if (video) {
      setDescription(video.description || '');
      setIsPlaying(false); // Reset playing state when video changes
    }
  }, [video]);

  if (!video) return null;

  const handleDescriptionSave = async () => {
    try {
      await handleUpdateDescription(video, description);
      setIsEditingDescription(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      message.error('Failed to update description');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      title={video.title}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          {isPlaying ? (
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
              src={`http://localhost:5000${video.url}`}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              style={{
                height: 300,
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setIsPlaying(true)}
            >
              <PlayCircleOutlined style={{ fontSize: 64, color: '#fff' }} />
            </div>
          )}
        </div>

        <Space>
          {isTrash ? (
            <>
              <Button
                icon={<UndoOutlined />}
                onClick={() => handleRestoreVideo(video)}
                loading={loading.restore}
              >
                Restore
              </Button>
              <Button
                danger
                icon={<DeleteFilled />}
                onClick={() => handlePermanentDelete(video)}
                loading={loading.delete}
              >
                Delete Permanently
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={video.isStarred ? <StarFilled /> : <StarOutlined />}
                onClick={() => handleStarVideo(video)}
                loading={loading.star}
              >
                {video.isStarred ? 'Unstar' : 'Star'}
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleTrashVideo(video)}
                loading={loading.delete}
              >
                Move to Trash
              </Button>
            </>
          )}
        </Space>

        <Descriptions column={2}>
          <Descriptions.Item label="Size">
            {formatFileSize(video.size)}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {format(new Date(video.createdAt), 'PPpp')}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{video.mimetype}</Descriptions.Item>
          {video.deletedAt && (
            <Descriptions.Item label="Deleted">
              {format(new Date(video.deletedAt), 'PPpp')}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div>
          <Space
            style={{
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Description
            </Title>
            {!isTrash && (
              <Button
                icon={
                  isEditingDescription ? <SaveOutlined /> : <EditOutlined />
                }
                onClick={
                  isEditingDescription
                    ? handleDescriptionSave
                    : () => setIsEditingDescription(true)
                }
                loading={loading.update}
              >
                {isEditingDescription ? 'Save' : 'Edit'}
              </Button>
            )}
          </Space>
          {isEditingDescription ? (
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          ) : (
            <div>{description || 'No description'}</div>
          )}
        </div>
      </Space>
    </Modal>
  );
};

export default VideoDetails;
