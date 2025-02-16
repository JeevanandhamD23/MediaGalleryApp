import React from 'react';
import { Card, Image, Button, Space, Tooltip } from 'antd';
import {
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  UndoOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/mediaHelpers';

const ImageCard = ({
  image,
  onImageClick,
  onStarClick,
  onTrashClick,
  onRestoreClick,
  onDeleteClick,
  loading,
  isTrash,
}) => {
  return (
    <Card
      hoverable
      cover={
        <Image
          alt={image.title}
          src={`http://localhost:5000${image.url}`}
          style={{ height: 200, objectFit: 'cover' }}
          preview={false}
          onClick={() => onImageClick(image)}
        />
      }
      actions={
        isTrash
          ? [
              <Tooltip title="Restore">
                <Button
                  icon={<UndoOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestoreClick && onRestoreClick(image);
                  }}
                  loading={loading?.restore}
                />
              </Tooltip>,
              <Tooltip title="Delete Permanently">
                <Button
                  danger
                  icon={<DeleteFilled />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick && onDeleteClick(image);
                  }}
                  loading={loading?.delete}
                />
              </Tooltip>,
            ]
          : [
              <Tooltip
                title={
                  image.isStarred ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Button
                  icon={image.isStarred ? <StarFilled /> : <StarOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarClick && onStarClick(image);
                  }}
                  loading={loading?.star}
                />
              </Tooltip>,
              <Tooltip title="Move to trash">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrashClick && onTrashClick(image);
                  }}
                  loading={loading?.delete}
                />
              </Tooltip>,
            ]
      }
    >
      <Card.Meta
        title={image.title}
        description={
          <Space direction="vertical" size="small">
            <div>{image.description || 'No description'}</div>
            <div>{formatFileSize(image.size)}</div>
          </Space>
        }
      />
    </Card>
  );
};

export default ImageCard;
