import React from 'react';
import { Layout, Typography, Input, Space } from 'antd';
import MediaUpload from '../../features/upload/MediaUpload';

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Header = ({
  onSearch,
  onUploadSuccess,
  loading,
  currentSection,
  searchRef,
}) => {
  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Space style={{ flex: 1 }}>
        <Title level={4} style={{ margin: 0, minWidth: 'fit-content' }}>
          Media Gallery
        </Title>
        <Search
          ref={searchRef}
          placeholder={`Search ${
            currentSection === 'videos'
              ? 'videos'
              : currentSection === 'photos'
              ? 'photos'
              : 'media'
          } by description...`}
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </Space>
      <MediaUpload onUploadSuccess={onUploadSuccess} loading={loading} />
    </AntHeader>
  );
};

export default Header;
