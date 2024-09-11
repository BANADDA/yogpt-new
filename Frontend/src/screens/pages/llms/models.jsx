import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Avatar, IconButton, Divider } from '@mui/material';
import { Chat as ChatIcon, Menu as MenuIcon } from '@mui/icons-material';
import { auth } from '../../../auth/config/firebase-config';
import Navbar from '../../../components/Navbar';
import CustomModels from '../../../widgets/CustomModels';
import UserInfoPopup from '../../../widgets/userInfo';


const models = [
  {
    modelName: 'LLama-2 Agric Assistant',
    modelIcon: <ChatIcon />,
    description: 'This is a short description of Model 1.',
    inference_url:'https://x8wnetsdbdlewc-80.proxy.runpod.net/generate'
  },
  {
    modelName: 'LLama-3 Customer Support',
    modelIcon: <ChatIcon />,
    description: 'This is a short description of Model 2.',
    inference_url:'https://x8wnetsdbdlewc-80.proxy.runpod.net/generate'
  },
  {
    modelName: 'My Tutor',
    modelIcon: <ChatIcon />,
    description: 'This is a short description of Model 3.',
    inference_url:'https://x8wnetsdbdlewc-80.proxy.runpod.net/generate'
  },
];

const ModelsScreen = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [domainFilter, setDomainFilter] = useState(null);
  const intervalRef = useRef(null);

  const [user, setUser] = useState({
    isAuthenticated: false,
    name: '',
    email: '',
    photoURL: '',
  });

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const height = navbar.offsetHeight;
      setNavbarHeight(height);
    }
  }, []);

  useEffect(() => {
    themeCheck();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const themeCheck = () => {
    const userTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.theme === 'dark' || (!userTheme && systemTheme)) {
      document.documentElement.classList.add('dark');
      setIsDarkTheme(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkTheme(false);
    }
  };

  const themeSwitch = () => {
    if (isDarkTheme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkTheme(true);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          isAuthenticated: true,
          name: user.displayName || 'No Name',
          email: user.email,
          photoURL: user.photoURL || 'path/to/default/image.png',
        });
      } else {
        setUser({
          isAuthenticated: false,
          name: '',
          email: '',
          photoURL: '',
        });
      }
    });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {isProfileClicked && (
        <UserInfoPopup
          onClose={() => setIsProfileClicked(false)}
          userName={user.name}
          userEmail={user.email}
          userPhotoURL={user.photoURL}
        />
      )}
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 50 }}>
        <Navbar
          isDarkTheme={isDarkTheme}
          themeSwitch={themeSwitch}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          onProfileClick={toggleProfileWidget}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          py:8,
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '20%' },
            bgcolor: 'background.paper',
            p: 2,
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          {user.isAuthenticated && (
            <Card sx={{ bgcolor: 'background.paper', mb: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={user.photoURL}
                  alt="User Avatar"
                  sx={{ width: 100, height: 100, mb: 2, mx: 'auto' }}
                />
                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user.email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{fontSize:'16px'}}>Filters</Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setDomainFilter(null)}
                  sx={{ mt: 1,fontSize:'12px'}}
                >
                  All Domains
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setDomainFilter('Computer Vision')}
                  sx={{ mt: 1,fontSize:'12px' }}
                >
                  Computer Vision
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setDomainFilter('Large Language Models')}
                  sx={{ mt: 1,fontSize:'12px' }}
                >
                  Large Language Models
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setDomainFilter('Language Processing')}
                  sx={{ mt: 1,fontSize:'12px' }}
                >
                  Language Processing
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setDomainFilter('Regression Models')}
                  sx={{ mt: 1,fontSize:'12px' }}
                >
                  Regression Models
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          <CustomModels models={models} />
        </Box>
      </Box>
    </Box>
  );
};

export default ModelsScreen;
