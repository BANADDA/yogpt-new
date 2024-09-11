import { AccountBalance, AccountBox, Computer, Home, MoreVert, Settings } from '@mui/icons-material';
import { AppBar, Box, Button, Checkbox, CircularProgress, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { auth, db } from '../auth/config/firebase-config';
import AuthenticatorSetup from './AuthenticatorSetup';
import MinerAccount from './MinerAccount';
import TransactionHistory from './TransactionHistory';

const drawerWidth = 260;

const StatusIcon = ({ status }) => {
  const statusStyles = {
    completed: { color: 'green', text: 'Completed', icon: '🟢' },
    running: { color: 'orange', text: 'Running', icon: '🟡' },
    stopped: { color: 'red', text: 'Stopped', icon: '🔴' },
  };

  const currentStatus = statusStyles[status] || statusStyles['completed'];

  return (
    <Box display="flex" alignItems="center">
      <Box component="span" sx={{ color: currentStatus.color, marginRight: 1 }}>
        {currentStatus.icon}
      </Box>
      <Typography variant="body2" component="span" sx={{ color: currentStatus.color }}>
        {currentStatus.text}
      </Typography>
    </Box>
  );
};

const Sidebar = ({ currentScreen, setCurrentScreen, navigate }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#F5F5F5', color: '#333' },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto', padding: 2 }}>
      <Button variant="outlined" color="primary" fullWidth sx={{ marginBottom: 2 }}>
        MINER PROGRAM
      </Button>
      <Divider />
      <List>
        {[
          { text: 'Home', icon: <Home />, path: '/' },
          { text: 'Training Jobs', icon: <Computer />, component: 'RecentFiles' },
          { text: 'Miner Account', icon: <AccountBox />, component: 'MinerAccount' },
          { text: 'Payment History', icon: <AccountBalance />, component: 'TransactionHistory' },
          { text: 'Settings', icon: <Settings />, path: '/settings' },
        ].map((item) => (
          <ListItem
            button
            key={item.text}
            selected={currentScreen === item.component}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              } else {
                setCurrentScreen(item.component);
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

const Com = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [currentScreen, setCurrentScreen] = useState('RecentFiles');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserPhotoURL(user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
        setUserEmail(user.email);

        const minerQuery = await getDocs(query(collection(db, 'miners'), where('email', '==', user.email)));
        if (!minerQuery.empty) {
          setIsRegistered(true);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => console.error('Sign out error', error));
  };

  const handleProceedToDashboard = () => {
    setIsRegistered(true);
  };

  const RecentFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recentFilesData, setRecentFilesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchJobs = async () => {
        setLoading(true);
        const user = auth.currentUser;

        if (user) {
          const jobExecutionsQuery = query(collection(db, 'job_executions'), where('minerId', '==', user.uid));
          const jobExecutionsSnapshot = await getDocs(jobExecutionsQuery);

          const recentFiles = await Promise.all(jobExecutionsSnapshot.docs.map(async (jobExecutionDoc) => {
            const jobExecutionData = jobExecutionDoc.data();
            const { jobId, startDate, status } = jobExecutionData;

            const fineTuningJobDoc = await getDoc(doc(db, 'fine_tuning_jobs', jobId));
            const fineTuningJobData = fineTuningJobDoc.exists() ? fineTuningJobDoc.data() : {};

            const completedJobQuery = query(collection(db, 'completed_jobs'), where('jobId', '==', jobId));
            const completedJobSnapshot = await getDocs(completedJobQuery);
            const completedJobData = !completedJobSnapshot.empty ? completedJobSnapshot.docs[0].data() : {};

            return {
              name: fineTuningJobData.baseModel || 'N/A',
              uploaded: startDate.toDate().toLocaleString(),
              duration: completedJobData.totalPipelineTime || 'N/A',
              status: status || 'running',
              token: completedJobData.accuracy || 'N/A',
            };
          }));

          setRecentFilesData(recentFiles);
        }

        setLoading(false);
      };

      fetchJobs();
    }, []);

    const handleSelectFile = (file) => {
      setSelectedFiles((prevSelected) =>
        prevSelected.includes(file)
          ? prevSelected.filter((f) => f !== file)
          : [...prevSelected, file]
      );
    };

    const handleSelectAllFiles = (event) => {
      if (event.target.checked) {
        setSelectedFiles(recentFilesData.map((file) => file.name));
      } else {
        setSelectedFiles([]);
      }
    };

    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Box>
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              Recent Jobs
            </Typography>
            <Button
              variant="contained"
              startIcon={<FaDollarSign />}
              sx={{
                textTransform: 'none',
              }}
              style={{ backgroundColor: '#a777e3' }}
            >
              CASH-OUT
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedFiles.length > 0 && selectedFiles.length < recentFilesData.length}
                      checked={selectedFiles.length === recentFilesData.length}
                      onChange={handleSelectAllFiles}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Model ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tokens Generated</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentFilesData.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFiles.includes(file.name)}
                        onChange={() => handleSelectFile(file.name)}
                      />
                    </TableCell>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.uploaded}</TableCell>
                    <TableCell>{file.duration}</TableCell>
                    <TableCell>
                      <StatusIcon status={file.status} />
                    </TableCell>
                    <TableCell>{file.token} Credits</TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {recentFilesData.length === 0 && (
              <Box mt={2} p={2} sx={{ backgroundColor: '#FEDBDB', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                  No jobs have been taken up by the miner.
                </Typography>
              </Box>
            )}
          </TableContainer>
          {selectedFiles.length > 0 && (
            <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <img src="/path/to/bulk/actions/icon.png" alt="Bulk Actions Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
                Bulk Actions
              </Typography>
              <Typography variant="body2" component="div">
                Select multiple files to manage them in bulk.
              </Typography>
              <Box display="flex" mt={2}>
                <Button variant="contained" startIcon={<img src="/path/to/export/icon.png" alt="Export Icon" style={{ width: 24, height: 24 }} />} sx={{ textTransform: 'none', marginRight: 2 }}>
                  EXPORT
                </Button>
                <Button variant="contained" color="error" startIcon={<img src="/path/to/delete/icon.png" alt="Delete Icon" style={{ width: 24, height: 24 }} />} sx={{ textTransform: 'none' }}>
                  DELETE
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} className='bg-slate-100'>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #6e8efb, #a777e3)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" noWrap component="div">
              YoGPT
            </Typography>
            <Box sx={{ display: 'flex', marginLeft: 4 }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'Docs', path: '/miner-docs' },
              ].map((item) => (
                <Typography
                  key={item.label}
                  variant="h8"
                  component="div"
                  sx={{ marginLeft: 2, cursor: 'pointer' }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          </Box>
          {isAuthenticated && (
            <Box display="flex" alignItems="center" ref={menuRef}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <img
                  className="h-8 w-8 rounded-md"
                  src={userPhotoURL}
                  alt="User Profile"
                  style={{ height: '32px', width: '32px', borderRadius: '8px' }}
                />
              </IconButton>
              <Typography variant="body2" component="div" sx={{ marginLeft: 2 }}>
                {userEmail}
              </Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
                <MenuItem onClick={() => navigate('/account-settings')}>Account Settings</MenuItem>
                <MenuItem onClick={handleSignOut}>Log Out</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #6e8efb, #a777e3)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" noWrap component="div">
              YoGPT
            </Typography>
            <Box sx={{ display: 'flex', marginLeft: 4 }}>
              {['FAQS', 'BLOG'].map((item) => (
                <Typography key={item} variant="h8" component="div" sx={{ marginLeft: 2 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          {isAuthenticated && (
            <Box display="flex" alignItems="center" ref={menuRef}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <img
                  className="h-8 w-8 rounded-md"
                  src={userPhotoURL}
                  alt="User Profile"
                  style={{ height: '32px', width: '32px', borderRadius: '8px' }}
                />
              </IconButton>
              <Typography variant="body2" component="div" sx={{ marginLeft: 2 }}>
                {userEmail}
              </Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
                <MenuItem onClick={() => navigate('/account-settings')}>Account Settings</MenuItem>
                <MenuItem onClick={handleSignOut}>Log Out</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar> */}
      <Box sx={{ display: 'flex', width: '100%' }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100%"
          >
            <CircularProgress />
          </Box>
        ) : !isRegistered ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100%"
          >
            <AuthenticatorSetup onRegister={() => setIsRegistered(true)} userEmail={userEmail} onContinue={handleProceedToDashboard} />
          </Box>
        ) : (
          <>
            <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} navigate={navigate} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }} className='bg-slate-100'>
              <Toolbar />
              {currentScreen === 'RecentFiles' && <RecentFiles />}
              {currentScreen === 'MinerAccount' && <MinerAccount />}
              {currentScreen === 'TransactionHistory' && <TransactionHistory />}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Com;
