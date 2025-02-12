import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.min.css' for newer versions

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);


// 4. CODE OPTIMIZATIONS

// a) Bundle Size
// - Implement code splitting
// - Lazy load components
// - Tree shake unused dependencies

// b) Performance Monitoring
// - Add performance metrics
// - Monitor API response times
// - Track memory usage
