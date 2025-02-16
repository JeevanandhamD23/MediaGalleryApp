import React, { useState, useEffect } from 'react';
import {
  Modal,
  Image,
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
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/mediaHelpers';
import { useImageActions } from '../hooks/useImageActions';
import { format } from 'date-fns';

const { Title } = Typography;
const { TextArea } = Input;

const ImageDetails = ({
  image,
  visible,
  onClose,
  onRefresh,
  isTrash = false,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const {
    loading,
    handleStarImage,
    handleTrashImage,
    handleRestoreImage,
    handlePermanentDelete,
    handleUpdateDescription,
  } = useImageActions(onRefresh);

  useEffect(() => {
    if (image) {
      setDescription(image.description || '');
    }
  }, [image]);

  if (!image) return null;

  const handleDescriptionSave = async () => {
    try {
      await handleUpdateDescription(image, description);
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
      title={image.title}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Image
          src={`http://localhost:5000${image.url}`}
          alt={image.title}
          style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
        />

        <Space>
          {isTrash ? (
            <>
              <Button
                icon={<UndoOutlined />}
                onClick={() => handleRestoreImage(image)}
                loading={loading.restore}
              >
                Restore
              </Button>
              <Button
                danger
                icon={<DeleteFilled />}
                onClick={() => handlePermanentDelete(image)}
                loading={loading.delete}
              >
                Delete Permanently
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={image.isStarred ? <StarFilled /> : <StarOutlined />}
                onClick={() => handleStarImage(image)}
                loading={loading.star}
              >
                {image.isStarred ? 'Unstar' : 'Star'}
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleTrashImage(image)}
                loading={loading.delete}
              >
                Move to Trash
              </Button>
            </>
          )}
        </Space>

        <Descriptions column={2}>
          <Descriptions.Item label="Size">
            {formatFileSize(image.size)}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {format(new Date(image.createdAt), 'PPpp')}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{image.mimetype}</Descriptions.Item>
          {image.deletedAt && (
            <Descriptions.Item label="Deleted">
              {format(new Date(image.deletedAt), 'PPpp')}
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

export default ImageDetails;
