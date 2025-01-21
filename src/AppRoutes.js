import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';

const AppRoutes = () => {
  return (
    <Box maxW="container.xl" mx="auto">
      <Routes>
        {/* Redirect root to blog */}
        <Route path="/" element={<Navigate to="/blog" replace />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Box>
  );
};

export default AppRoutes; 