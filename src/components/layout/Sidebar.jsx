import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  PictureOutlined,
  VideoCameraOutlined,
  StarOutlined,
  DeleteOutlined,
  CloudOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({
  collapsed,
  onCollapse,
  currentSection,
  onMenuClick,
  menuItems,
}) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
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
        onClick={onMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
