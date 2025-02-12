import React, { useState, useEffect } from 'react';
import { Progress, Card, Typography, Space } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const StorageSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/photos/storage/stats'
      );
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching storage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading || !stats) {
    return <div>Loading storage information...</div>;
  }

  const totalPercentage = (stats.totalSize / stats.limit) * 100;
  const imagePercentage = (stats.imageSize / stats.limit) * 100;
  const videoPercentage = (stats.videoSize / stats.limit) * 100;

  return (
    <Card style={{ maxWidth: 800, margin: '24px auto' }}>
      <Title level={4}>Storage Usage</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Total Storage: </Text>
          <Text>
            {formatSize(stats.totalSize)} of {formatSize(stats.limit)} used
          </Text>
        </div>

        <Progress
          percent={totalPercentage}
          success={{ percent: imagePercentage, strokeColor: '#52c41a' }}
          trailColor="#f0f0f0"
          strokeColor="#1890ff"
          format={(percent) => `${percent.toFixed(1)}%`}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Space>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: '#52c41a',
                borderRadius: 4,
              }}
            />
            <div>
              <div>Images ({stats.files.images} files)</div>
              <Text type="secondary">{formatSize(stats.imageSize)}</Text>
            </div>
          </Space>
          <Space>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: '#1890ff',
                borderRadius: 4,
              }}
            />
            <div>
              <div>Videos ({stats.files.videos} files)</div>
              <Text type="secondary">{formatSize(stats.videoSize)}</Text>
            </div>
          </Space>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            {formatSize(stats.limit - stats.totalSize)} available
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default StorageSection;
