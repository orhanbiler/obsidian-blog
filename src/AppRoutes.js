import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import About from './components/About';
import TagsPage from './components/TagsPage';

const AppRoutes = () => {
  return (
    <Box maxW="container.xl" mx="auto">
      <Routes>
        {/* Redirect root to blog */}
        <Route path="/" element={<Navigate to="/blog" replace />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/tags" element={<TagsPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Box>
  );
};

export default AppRoutes; 