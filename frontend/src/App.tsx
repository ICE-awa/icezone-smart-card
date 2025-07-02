import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserManagementPage from './pages/admin/UserManagement';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import AdminLayout from './components/layout/AdminLayout';

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
            <Route element = {<AdminLayout />}>
              <Route path = "/admin/users" element = {<UserManagementPage />} />
            </Route>
            <Route element = {<ProtectedRoute />}>
              <Route path = "/" element = {<HomePage />} />

              {/* <Route element = {<AdminRoute />}> */}
                
              {/* </Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;