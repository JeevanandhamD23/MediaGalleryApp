import React from 'react';
import { Spin } from 'antd';

const Loading = ({ tip = 'Loading...' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}
  >
    <Spin tip={tip} size="large" />
  </div>
);

export default Loading;
