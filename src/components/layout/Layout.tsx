import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ChatAssistant from '@components/common/ChatAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
      {/* <ChatAssistant /> */}
    </Box>
  );
};

export default Layout;