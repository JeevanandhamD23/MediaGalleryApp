import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Homepage from './Homepage/Homepage';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
    return (
        <ConfigProvider>
            <ErrorBoundary>
                <Router>
                    <Homepage />
                </Router>
            </ErrorBoundary>
        </ConfigProvider>
    );
}

export default App;