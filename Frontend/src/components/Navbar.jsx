import { Menu as MenuIcon } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../auth/config/firebase-config';

const Navbar = ({ onProfileClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [docsAnchorEl, setDocsAnchorEl] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isDocsMenuOpen = Boolean(docsAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserPhotoURL(user.photoURL || 'https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg');
        setUserEmail(user.email);
        setUserName(user.displayName || "Admin");
      } else {
        setIsAuthenticated(false);
        setUserPhotoURL('');
        setUserEmail('');
        setUserName('');
      }
      setAuthCheckCompleted(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDocsMenu = (event) => {
    setDocsAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleDocsMenuClose();
    handleMobileMenuClose();
  };

  const handleDocsMenuClose = () => {
    setDocsAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogin = () => {
    signInWithGoogle().catch((error) => {
      console.error('Google sign-in error', error);
    });
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={onProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
    </Menu>
  );

  const docsMenuId = 'docs-menu';
  const renderDocsMenu = (
    <Menu
      anchorEl={docsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={docsMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isDocsMenuOpen}
      onClose={handleDocsMenuClose}
      PaperProps={{
        style: {
          borderRadius: 8,
          marginTop: 8,
          minWidth: 180,
          color: '#fff',
          backgroundColor: '#333',
        }
      }}
    >
      <MenuItem component={Link} to="/miner-docs">
        Miner Docs
      </MenuItem>
      <MenuItem component={Link} to="/userdocs">
        Job Setup Docs
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </Link>
      </MenuItem>
          <MenuItem>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Models
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/datasets" style={{ color: 'inherit', textDecoration: 'none' }}>
              Datasets
            </Link>
          </MenuItem>
      <MenuItem onClick={handleDocsMenu}>
        Docs
      </MenuItem>
      {authCheckCompleted && isAuthenticated && (
        <>
          <MenuItem>
            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
              Dashboard
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenu}>
            <img
              src={userPhotoURL || "images/admin.jpg"}
              alt="User Profile"
              style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}
            />
            <Typography variant="body2" style={{ fontWeight: '500' }}>
              {userName}
            </Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #6e8efb, #a777e3)', fontFamily: 'Roboto, sans-serif' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleMobileMenuOpen}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '500' }}>YoGPT</Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Home</Link>
                <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Models</Link>
                <Link to="/datasets" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Datasets</Link>
            {authCheckCompleted && isAuthenticated && (
              <>
                <Link to="/dashboard" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Dashboard</Link>
              </>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleDocsMenu}>
              <Typography style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Docs</Typography>
              <ArrowDropDownIcon sx={{ color: 'white' }} />
            </Box>
          </Typography>
          {authCheckCompleted && !isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleLogin} sx={{ color: 'white' }}>Login</Button>
              {/* <Button color="inherit" component={Link} to="/sign-up" sx={{ color: 'white' }}>Sign Up</Button> */}
            </>
          ) : (
            <>
              {isAuthenticated && (
                <Button
                  onClick={handleMenu}
                  sx={{ display: 'flex', alignItems: 'center', color: 'white', textTransform: 'none' }}
                >
                  <img
                    src={userPhotoURL || "/public/images/admin.jpg"}
                    alt="User Profile"
                    style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    {userName}
                  </Typography>
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
      {renderMobileMenu}
      {renderMenu}
      {renderDocsMenu}
    </AppBar>
  );
};

Navbar.propTypes = {
  onProfileClick: PropTypes.func.isRequired,
};

export default Navbar;

// import { Menu as MenuIcon } from '@mui/icons-material';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import {
//   AppBar,
//   Box,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   Toolbar,
//   Typography
// } from '@mui/material';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { auth } from '../auth/config/firebase-config';

// const Navbar = ({ onProfileClick }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [docsAnchorEl, setDocsAnchorEl] = useState(null);
//   const [userPhotoURL, setUserPhotoURL] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
//   const isMenuOpen = Boolean(anchorEl);
//   const isDocsMenuOpen = Boolean(docsAnchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthenticated(true);
//         setUserPhotoURL(user.photoURL || 'path/to/default/image.png');
//         setUserEmail(user.email);
//         setUserName(user.displayName || "No Name");
//       } else {
//         setIsAuthenticated(false);
//         setUserPhotoURL('');
//         setUserEmail('');
//         setUserName('');
//       }
//       setAuthCheckCompleted(true);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = () => {
//     signOut(auth).then(() => {
//       navigate('/');
//     }).catch((error) => {
//       console.error('Sign out error', error);
//     });
//   };

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDocsMenu = (event) => {
//     setDocsAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleDocsMenuClose();
//     handleMobileMenuClose();
//   };

//   const handleDocsMenuClose = () => {
//     setDocsAnchorEl(null);
//   };

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem onClick={onProfileClick}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
//       <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
//     </Menu>
//   );

//   const docsMenuId = 'docs-menu';
//   const renderDocsMenu = (
//     <Menu
//       anchorEl={docsAnchorEl}
//       anchorOrigin={{
//         vertical: 'bottom',
//         horizontal: 'left',
//       }}
//       id={docsMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'left',
//       }}
//       open={isDocsMenuOpen}
//       onClose={handleDocsMenuClose}
//       PaperProps={{
//         style: {
//           borderRadius: 8,
//           marginTop: 8,
//           minWidth: 180,
//           color: '#fff',
//           backgroundColor: '#333',
//         }
//       }}
//     >
//       <MenuItem component={Link} to="/miner-docs">
//         Miner Docs
//       </MenuItem>
//       <MenuItem component={Link} to="/userdocs">
//         Job Setup Docs
//       </MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
//           Home
//         </Link>
//       </MenuItem>
//       <MenuItem>
//         <Link to="/models" style={{ color: 'inherit', textDecoration: 'none' }}>
//           Models
//         </Link>
//       </MenuItem>
//       <MenuItem>
//         <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
//           Dashboard
//         </Link>
//       </MenuItem>
//       <MenuItem>
//         <Link to="/datasets" style={{ color: 'inherit', textDecoration: 'none' }}>
//           Datasets
//         </Link>
//       </MenuItem>
//       <MenuItem onClick={handleDocsMenu}>
//         Docs
//       </MenuItem>
//       {authCheckCompleted && isAuthenticated && (
//         <MenuItem onClick={handleMenu}>
//           <img
//             src={userPhotoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
//             alt="User Profile"
//             style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}
//           />
//           <Typography variant="body2" style={{ fontWeight: '500' }}>
//             {userName}
//           </Typography>
//         </MenuItem>
//       )}
//     </Menu>
//   );

//   return (
//     <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #6e8efb, #a777e3)', fontFamily: 'Roboto, sans-serif' }}>
//       <Toolbar sx={{ justifyContent: 'space-between' }}>
//         <IconButton
//           edge="start"
//           color="inherit"
//           aria-label="open drawer"
//           onClick={handleMobileMenuOpen}
//           sx={{ display: { md: 'none' } }}
//         >
//           <MenuIcon />
//         </IconButton>
//         <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
//           <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '500' }}>YoGPT</Link>
//         </Typography>
//         <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
//           <Typography variant="h6" component="div" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
//             <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Home</Link>
//             <Link to="/models" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Models</Link>
//             <Link to="/dashboard" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Dashboard</Link>
//             <Link to="/datasets" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Datasets</Link>
//             <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleDocsMenu}>
//               <Typography style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>Docs</Typography>
//               <ArrowDropDownIcon sx={{ color: 'white' }} />
//             </Box>
//           </Typography>
//           {authCheckCompleted && !isAuthenticated ? (
//             <>
//               <Button color="inherit" component={Link} to="/sign-in" sx={{ color: 'white' }}>Login</Button>
//               <Button color="inherit" component={Link} to="/sign-up" sx={{ color: 'white' }}>Sign Up</Button>
//             </>
//           ) : (
//             <>
//               {isAuthenticated && (
//                 <Button
//                   onClick={handleMenu}
//                   sx={{ display: 'flex', alignItems: 'center', color: 'white', textTransform: 'none' }}
//                 >
//                   <img
//                     src={userPhotoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
//                     alt="User Profile"
//                     style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}
//                   />
//                   <Typography variant="body2" sx={{ fontWeight: '500' }}>
//                     {userName}
//                   </Typography>
//                 </Button>
//               )}
//             </>
//           )}
//         </Box>
//       </Toolbar>
//       {renderMobileMenu}
//       {renderMenu}
//       {renderDocsMenu}
//     </AppBar>
//   );
// };

// Navbar.propTypes = {
//   onProfileClick: PropTypes.func.isRequired,
// };

// export default Navbar;
