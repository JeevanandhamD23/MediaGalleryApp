import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Layout, Menu, Typography, Button, Input, Space, message } from 'antd';
import { debounce } from 'lodash';
import {
  PictureOutlined,
  FolderOutlined,
  StarOutlined,
  VideoCameraOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  BellOutlined,
  FileOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  LockOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ImagesSection from '../features/images/ImagesSection';
import VideosSection from '../features/videos/VideosSection';
import TrashSection from '../features/trash/TrashSection';
import StorageSection from '../features/storage/StorageSection';
import MediaUpload from '../features/upload/MediaUpload';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Loading from '../components/common/Loading';

const { Content } = Layout;

function Homepage() {
  const [photos, setPhotos] = useState({ images: [] });
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [refreshCallbacks, setRefreshCallbacks] = useState({});
  const allSectionRef = useRef(null);
  const photosSectionRef = useRef(null);
  const videosSectionRef = useRef(null);

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/trash');
      const items = response.data.items || [];

      // Separate items by type
      const images = items.filter(
        (item) => item.originalCollection === 'images'
      );
      const videos = items.filter(
        (item) => item.originalCollection === 'videos'
      );

      setPhotos({ images });
      setVideos(videos);
    } catch (err) {
      console.error('Error fetching trash items:', err);
      message.error('Failed to fetch trash items');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUploadSuccess = () => {
    // Call all registered refresh callbacks
    Object.values(refreshCallbacks).forEach((callback) => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  // Register refresh callbacks when refs change
  useEffect(() => {
    const newCallbacks = {};

    if (allSectionRef.current) {
      newCallbacks.all = allSectionRef.current.fetchMedia;
    }
    if (photosSectionRef.current) {
      newCallbacks.photos = photosSectionRef.current.fetchMedia;
    }
    if (videosSectionRef.current) {
      newCallbacks.videos = videosSectionRef.current.fetchVideos;
    }

    setRefreshCallbacks(newCallbacks);
  }, [currentSection]);

  const renderContent = () => {
    switch (currentSection) {
      case 'all':
        return (
          <div>
            {loading ? (
              <Loading tip="Loading media..." />
            ) : (
              <ImagesSection
                query={searchQuery}
                isAllMedia={true}
                ref={allSectionRef}
              />
            )}
          </div>
        );
      case 'photos':
        return <ImagesSection query={searchQuery} ref={photosSectionRef} />;
      case 'videos':
        return <VideosSection query={searchQuery} ref={videosSectionRef} />;
      case 'trash':
        return <TrashSection />;
      case 'storage':
        return <StorageSection />;
      case 'favorites':
        return (
          <div>
            {loading ? (
              <Loading tip="Loading media..." />
            ) : (
              <ImagesSection
                query={searchQuery}
                isAllMedia={true}
                isStarred={true}
              />
            )}
          </div>
        );
      default:
        return <ImagesSection query={searchQuery} />;
    }
  };

  useEffect(() => {
    if (currentSection === 'trash') {
      fetchTrashItems();
    }
  }, [currentSection]);

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
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        currentSection={currentSection}
        onMenuClick={handleMenuClick}
        menuItems={menuItems}
      />
      <Layout>
        <Header
          onSearch={handleSearch}
          onUploadSuccess={handleUploadSuccess}
          currentSection={currentSection}
          searchRef={searchRef}
        />
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
