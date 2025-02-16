import React from 'react';
import { Empty } from 'antd';

const EmptyState = ({
  description = 'No data found',
  image = Empty.PRESENTED_IMAGE_SIMPLE,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '40px 0',
    }}
  >
    <Empty description={description} image={image} />
  </div>
);

export default EmptyState;
