import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space } from 'antd';
import {
  FileImageOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
  HddOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../utils/mediaHelpers';
import { mediaApi } from '../../services/api/mediaApi';
import Loading from '../../components/common/Loading';

const { Title } = Typography;

const StorageSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);
      const response = await mediaApi.getStorageStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to fetch storage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading tip="Loading storage statistics..." />;
  if (!stats) return null;

  const usedPercentage = ((stats.usedSpace / stats.totalSpace) * 100).toFixed(
    1
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4}>Storage Overview</Title>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={5}>Storage Usage</Title>
              <Progress
                type="circle"
                percent={Number(usedPercentage)}
                format={(percent) => (
                  <Space direction="vertical" align="center">
                    <div>{percent}%</div>
                    <div style={{ fontSize: '12px' }}>Used</div>
                  </Space>
                )}
              />
              <Statistic
                title="Total Space"
                value={formatFileSize(stats.totalSpace)}
                prefix={<HddOutlined />}
              />
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="Used Space"
                value={formatFileSize(stats.usedSpace)}
                prefix={<HddOutlined />}
              />
              <Statistic
                title="Free Space"
                value={formatFileSize(stats.totalSpace - stats.usedSpace)}
                prefix={<HddOutlined />}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Images"
              value={stats.imageCount}
              prefix={<FileImageOutlined />}
              suffix={`(${formatFileSize(stats.imageSize)})`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Videos"
              value={stats.videoCount}
              prefix={<VideoCameraOutlined />}
              suffix={`(${formatFileSize(stats.videoSize)})`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Trash"
              value={stats.trashCount}
              prefix={<DeleteOutlined />}
              suffix={`(${formatFileSize(stats.trashSize)})`}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default StorageSection;
