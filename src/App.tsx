import './assets/styles/index.scss';
import { ConfigProvider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AppRoutes } from './pages/Router.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getAccessToken } from './utils/storage.util.ts';
import { getUserInfo } from './redux/slices/user.slice.ts';
import { AppState, useDispatch, useSelector } from './redux/store';
import { SocketContextProvider } from './context/SocketContext.tsx';
import { Toaster } from 'react-hot-toast';
import { Chart, registerables } from 'chart.js';
import { ProjectProvider } from './context/ProjectContext.tsx';

Chart.register(...registerables);
const App: React.FC = () => {
  const userProfile = useSelector((state: AppState) => state.user);
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const access_token = getAccessToken();
    if (access_token) {
      if (!userProfile.isAuthenticated) {
        dispatch(getUserInfo());
      }
    } else if (pathname === '/') {
      navigate('/login');
    }
  }, [pathname, userProfile.isAuthenticated]);
  return (
    <ProjectProvider>
      <SocketContextProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ConfigProvider
            theme={{
              hashed: false,
              components: {
                Layout: { colorBgBase: '#fff' },
                Menu: {
                  iconSize: 20,
                  collapsedIconSize: 20,
                  itemColor: '#6C718B',
                  itemSelectedBg: '#46b4be',
                  itemSelectedColor: '#FFF',
                  itemHoverColor: '#46b4be',
                },
                Select: {
                  multipleItemBg: 'rgba(98,141,182,0.25)',
                  optionActiveBg: '#B5E1E5',
                },
                Avatar: { groupSpace: 2, groupOverlapping: -20 },
                Tabs: { itemSelectedColor: '#3E5B76', inkBarColor: '#3E5B76', titleFontSize: 20 },
                Card: {
                  headerBg: '#3E5B76',
                },
                Table: {
                  headerColor: '#3E5B76',
                },
                Button: {
                  defaultBorderColor: '#628DB6',
                  defaultColor: '#628DB6',
                },
                Tooltip: {},
              },
              token: {
                colorPrimary: '#46b4be',
                colorError: '#f56a00',
                colorErrorBg: '#fde3cf',
              },
            }}
          >
            <Toaster />
            <AppRoutes />
          </ConfigProvider>
        </GoogleOAuthProvider>
      </SocketContextProvider>
    </ProjectProvider>
  );
};

export default App;
