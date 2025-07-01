import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <ConfigProvider
      theme = {{
        token: {
          colorPrimary: '#1677ff',
        },
      }}>

        <BrowserRouter>
          <Routes>
            <Route path = "/register" element = {<RegisterPage />} />
            <Route path = "/login" element = {<LoginPage />} />
            
            <Route element = {<ProtectedRoute />}>
              <Route path = "/" element = {<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;