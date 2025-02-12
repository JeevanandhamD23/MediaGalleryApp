import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Layout, Menu, Typography, Button, Input, Space } from 'antd';
import { debounce } from 'lodash';
import {
  PictureOutlined,
  BellOutlined,
  FolderOutlined,
  FileOutlined,
  StarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  LockOutlined,
  CloudOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import PhotoGallery from '../components/PhotoGallery';
import PhotoUpload from '../components/PhotoUpload';
import StorageSection from '../components/StorageSection';
import VideoGallery from '../components/VideoGallery';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;

function Homepage() {
  const [photos, setPhotos] = useState({ photos: [] });
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Create a debounced version of fetchPhotos
  const debouncedFetch = useRef(
    debounce((section, query) => {
      fetchPhotos(section, query);
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const fetchPhotos = async (section = 'all', query = '') => {
    try {
      let endpoint = `${process.env.REACT_APP_API_URL}/api/photos`;

      switch (section) {
        case 'all':
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
          break;
        case 'photos':
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos/images${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
          break;
        case 'favorites':
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos/starred${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
          break;
        case 'trash':
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos/trash${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
          break;
        case 'videos':
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos/videos${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
          break;
        default:
          endpoint = `${process.env.REACT_APP_API_URL}/api/photos${
            query ? `?search=${encodeURIComponent(query)}` : ''
          }`;
      }

      const response = await axios.get(endpoint);
      setPhotos(response.data);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  const renderContent = () => {
    if (currentSection === 'storage') {
      return <StorageSection />;
    }

    if (!photos.photos?.length) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>
            {currentSection === 'trash'
              ? 'Trash is empty'
              : 'Ready to add some media?'}
          </Title>
          <p>
            {currentSection === 'trash'
              ? 'No deleted items found'
              : 'Click the upload button to add photos or videos'}
          </p>
        </div>
      );
    }

    if (currentSection === 'all') {
      const images = photos.photos.filter((item) =>
        item.mimetype.startsWith('image/')
      );
      const videos = photos.photos.filter((item) =>
        item.mimetype.startsWith('video/')
      );

      return (
        <div>
          {videos.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <Title level={4}>Videos</Title>
              <VideoGallery
                videos={videos}
                onRefresh={() => fetchPhotos(currentSection)}
              />
            </div>
          )}
          {images.length > 0 && (
            <div>
              <Title level={4}>Photos</Title>
              <PhotoGallery
                photos={images}
                onRefresh={() => fetchPhotos(currentSection)}
                isTrash={false}
              />
            </div>
          )}
        </div>
      );
    }

    if (currentSection === 'videos') {
      return (
        <VideoGallery
          videos={photos.photos}
          onRefresh={() => fetchPhotos(currentSection)}
          isTrash={currentSection === 'trash'}
        />
      );
    }

    return (
      <PhotoGallery
        photos={photos.photos}
        onRefresh={() => fetchPhotos(currentSection)}
        isTrash={currentSection === 'trash'}
      />
    );
  };

  useEffect(() => {
    debouncedFetch(currentSection, searchQuery);
  }, [currentSection, searchQuery, debouncedFetch]);

  const handleMenuClick = ({ key }) => {
    setCurrentSection(key);
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.input.value = '';
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const menuItems = [
    { key: 'all', icon: <PictureOutlined />, label: 'All Media' },
    { key: 'updates', icon: <BellOutlined />, label: 'Updates' },
    { type: 'divider' },
    { key: 'collections-title', type: 'group', label: 'Collections' },
    { key: 'photos', icon: <FolderOutlined />, label: 'Photos' },
    { key: 'documents', icon: <FileOutlined />, label: 'Documents' },
    { key: 'favorites', icon: <StarOutlined />, label: 'Favorites' },
    { key: 'people', icon: <TeamOutlined />, label: 'People' },
    { key: 'places', icon: <EnvironmentOutlined />, label: 'Places' },
    { key: 'videos', icon: <VideoCameraOutlined />, label: 'Videos' },
    { key: 'recent', icon: <ClockCircleOutlined />, label: 'Recently added' },
    { key: 'archive', icon: <LockOutlined />, label: 'Archive' },
    { key: 'locked', icon: <LockOutlined />, label: 'Locked Folder' },
    { key: 'trash', icon: <DeleteOutlined />, label: 'Trash' },
    { type: 'divider' },
    { key: 'storage', icon: <CloudOutlined />, label: 'Storage' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: '#fff' }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Media App
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['all']}
          selectedKeys={[currentSection]}
          onClick={handleMenuClick}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flex: 1,
            }}
          >
            <Title level={4} style={{ margin: 0, minWidth: 'fit-content' }}>
              My Photos
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
              onSearch={handleSearch}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              style={{ width: 300 }}
            />
          </div>
          <PhotoUpload onUploadSuccess={fetchPhotos}>
            <Button type="primary" icon={<PlusOutlined />} loading={loading}>
              Upload
            </Button>
          </PhotoUpload>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Homepage;
