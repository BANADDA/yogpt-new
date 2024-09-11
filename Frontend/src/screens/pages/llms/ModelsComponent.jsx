import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  ModelTraining as ModelTrainingIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { auth, getChatHistory, saveChatHistory } from '../../../auth/config/firebase-config';
import DefaultChats from './DefaultChats';

const ModelsComponent = () => {
  const [activeScreen, setActiveScreen] = useState('Models');
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [userPhotoURL, setUserPhotoURL] = useState('default_user_image.png');
  const [userName, setUserName] = useState('Unknown User');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState('');
  const [chatHistories, setChatHistories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatNameSet, setChatNameSet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserPhotoURL(user.photoURL || 'default_user_image.png');
        setUserName(user.displayName || 'No Name');
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchDeployedModels = async () => {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, 'deployed_models'));
      const models = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setModels(models);
      setSnackbarMessage('Models fetched successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to fetch deployed models:', error);
      setSnackbarMessage('Failed to fetch deployed models.');
      setSnackbarSeverity('error');
    } finally {
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchDeployedModels();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDeleteModel = async (modelId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'deployed_models', modelId));
        setModels(models.filter(model => model.id !== modelId));
        Swal.fire('Deleted!', 'Your model has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting model:', error);
        Swal.fire('Error!', 'There was an error deleting your model.', 'error');
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleCardClick = (model) => {
    setSelectedModel(model);
    setActiveScreen('Inference');
  };

  const handleSendClick = () => {
    if (message.trim()) {
      addMessageToConversation(message);
      setMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setCurrentChatId(chat.id);
    setChatNameSet(true);
    setConversation(chat.conversation);
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    setChatHistories((prevHistories) => [
      ...prevHistories,
      { id: newChatId, name: `Chat ${chatHistories.length + 1}`, conversation: [], createdAt: new Date() },
    ]);
    setCurrentChatId(newChatId);
    setConversation([]);
    setChatNameSet(false);
  };

  const handleMenuClick = (event, chat) => {
    setAnchorEl(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChat(null);
  };

  const handleDeleteChat = () => {
    setChatHistories((prevHistories) => {
      const updatedHistories = prevHistories.filter((chat) => chat.id !== selectedChat.id);
      const newSelectedChat = updatedHistories.length ? updatedHistories[updatedHistories.length - 1] : null;
      setConversation(newSelectedChat ? newSelectedChat.conversation : []);
      setCurrentChatId(newSelectedChat ? newSelectedChat.id : null);
      return updatedHistories;
    });
    setOpenDeleteDialog(false);
  };

  const handleRenameChat = () => {
    setChatHistories((prevHistories) =>
      prevHistories.map((chat) => chat.id === selectedChat.id ? { ...chat, name: newChatName } : chat)
    );
    setOpenRenameDialog(false);
    setNewChatName('');
  };

  const addMessageToConversation = (message) => {
    const newMessage = { text: message, sender: 'user' };
    const newConversation = [...conversation, newMessage];
    setConversation(newConversation);

    // Send the message to the server and get the response
    sendMessageToModel(message);
  };

  const sendMessageToModel = async (message) => {
    try {
      const sanitizedEndpointUrl = selectedModel.serverUrl.trim();
      const requestData = {
        endpoint_url: sanitizedEndpointUrl,
        prompt: message,
      };

      console.log("Request data", requestData);
  
      const response = await axios.post('https://jarvis-server-1.onrender.com/inference', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      const data = response.data;
      const aiMessage = { text: data.text, sender: 'ai' };
  
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation, aiMessage];
        updateChatHistories(updatedConversation);
        return updatedConversation;
      });
    } catch (error) {
      console.error('Error sending message to model:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const updateChatHistories = (newConversation) => {
    setChatHistories((prevHistories) => {
      const existingChat = prevHistories.find(chat => chat.id === currentChatId);
      const newName = existingChat && chatNameSet ? existingChat.name : generateChatName(newConversation);
      if (!existingChat) setChatNameSet(true);
      const newChat = {
        id: currentChatId,
        name: newName,
        conversation: newConversation,
        createdAt: existingChat ? existingChat.createdAt : new Date(),
      };
      console.log('Updating chat histories with new conversation:', newChat);
      return [
        ...prevHistories.filter((chat) => chat.id !== currentChatId),
        newChat,
      ];
    });
  };

  const generateChatName = (conversation) => {
    const keywords = conversation.slice(0, 1).map(msg => msg.text.split(' ').slice(0, 3).join(' ')).join(', ');
    return keywords || `Chat on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`;
  };

  const groupChatsByDate = (chats) => {
    const grouped = {
      today: [],
      yesterday: [],
      earlier: []
    };
    chats.forEach(chat => {
      let chatDate = new Date(chat.createdAt);
      if (isNaN(chatDate.getTime())) {
        chatDate = new Date(); // Fallback to current date if invalid
      }
      if (isToday(chatDate)) {
        grouped.today.push(chat);
      } else if (isYesterday(chatDate)) {
        grouped.yesterday.push(chat);
      } else {
        grouped.earlier.push(chat);
      }
    });
    return grouped;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearchTerm = model.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateFilter = dateFilter === 'All' || formatTimestamp(model.deployedAt).includes(dateFilter);
    return matchesSearchTerm && matchesDateFilter;
  });

  const groupedChats = groupChatsByDate(chatHistories);

  if (activeScreen === 'Models') {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          marginTop:10,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            fontFamily: 'Poppins',
            fontSize: '12px',
            width: { xs: '100%', sm: '80%', md: '75%', lg: '80%' },
            padding: { xs: 2, sm: 3, md: 4 },
            boxSizing: 'border-box',
          }}
        >
          <Paper sx={{ padding: 2, mb: 4 }}>
            <Box className="flex justify-between items-center">
              <Box className="flex items-center">
                <ModelTrainingIcon sx={{ marginRight: 1 }} />
                <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 'bold' }}>
                  Deployed Models
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/jobs')}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <AddCircleIcon sx={{ marginRight: 1 }} />
                Create New Training Job
              </Button>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Search models..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{ flexGrow: 1 }}
            />
            <TextField
              select
              variant="outlined"
              value={dateFilter}
              onChange={handleDateFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
              <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
            </TextField>
          </Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress size={50} color={"#123abc"} loading={isLoading} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredModels.map((model) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={model.id}>
                  <Card
                    onClick={() => handleCardClick(model)}
                    sx={{ 
                      backgroundColor: '#0e3517', 
                      color: '#fff',
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={model.imageUrl || 'https://www.geeky-gadgets.com/wp-content/uploads/2023/11/How-to-build-knowledge-graphs-with-large-language-models-LLMs.webp'}
                      alt={model.modelName}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{model.modelName}</Typography>
                      <Typography variant="body2" color="white">Updated {formatTimestamp(model.deployedAt)}</Typography>
                      <Typography variant="body2" gutterBottom>{model.description || ''}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{model.tags || 'No tags'}</Typography>
                        <Typography variant="body2" component="a" href={model.serverUrl} target="_blank" rel="noopener noreferrer">View</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l5-5H5l5 5z"/></svg>
                          <Typography variant="body2">{model.upvotes || 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img src={userPhotoURL} alt="User" style={{ width: '16px', height: '16px', borderRadius: '50%', marginRight: '4px' }} />
                          <Typography variant="body2">{userName}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleDeleteModel(model.id); }}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {!isLoading && models.length === 0 && (
            <Box className="flex flex-col items-center justify-center text-white" style={{ height: '300px' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <ModelTrainingIcon sx={{ fontSize: 40, color: 'black' }} />
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/jobs')}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <AddCircleIcon sx={{ marginRight: 1 }} />
                Create New Training Job
              </Button>
            </Box>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    );
  } else if (activeScreen === 'Inference' && selectedModel) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-6 mt-10">
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', marginTop: '60px', paddingLeft: '280px' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '280px' }}>
              <Box sx={{ position: 'fixed', top: '80px', left: '280px', right: '280px', backgroundColor: 'white', zIndex: 10, borderBottom: '1px solid grey' }}>
                <Typography variant="h6">YOGPT: {selectedModel.modelName}</Typography>
              </Box>
              {conversation.length === 0 && (
                <Box sx={{ textAlign: 'center', marginTop: '5%' }}>
                  <DefaultChats />
                </Box>
              )}
              <Box sx={{ flex: 1, overflowY: 'auto', padding: '15px', paddingTop: '35px' }}>
                {conversation.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        backgroundColor: msg.sender === 'user' ? 'lightblue' : 'lightgrey',
                        padding: 2,
                        borderRadius: 1,
                        maxWidth: '50%',
                      }}
                    >
                      {msg.text}
                    </Paper>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid grey', padding: '10px 20px', backgroundColor: '#f7f7f8', marginBottom: '35px' }}>
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  placeholder="Message YOGPT"
                  fullWidth
                  sx={{ marginRight: 1, borderRadius: '20px', backgroundColor: 'white' }}
                />
                <IconButton onClick={handleSendClick} color="primary" sx={{ borderRadius: '50%', backgroundColor: '#ececf1', padding: '10px' }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ width: '280px', height: '100%', borderLeft: '1px solid grey', padding: '8px', position: 'absolute', right: 0 }}>
              <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewChat}
                  fullWidth
                  sx={{
                    backgroundColor: '#006400',
                    '&:hover': {
                      backgroundColor: '#004d00',
                    },
                  }}
                >
                  + New Chat
                </Button>
              </Box>
              <Box sx={{ overflowY: 'auto', height: 'calc(100% - 56px)' }}>
                {Object.entries(groupedChats).map(([group, chats]) => (
                  chats.length > 0 && (
                    <Box key={group} sx={{ marginTop: '10px' }}>
                      <Typography variant="subtitle1" sx={{ padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
                        {group === 'today' ? 'Today' : group === 'yesterday' ? 'Yesterday' : format(new Date(chats[0].createdAt), 'MMMM d, yyyy')}
                      </Typography>
                      <List sx={{ padding: 0 }}>
                        {chats.map((chat, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            sx={{
                              margin: '5px 0',
                              padding: '10px',
                              borderRadius: '8px',
                              backgroundColor: '#f0f0f0',
                              '&:hover': {
                                backgroundColor: '#e0e0e0',
                              },
                              transition: 'background-color 0.3s'
                            }}
                          >
                            <ChatBubbleOutlineIcon sx={{ marginRight: 1, color: '#4caf50' }} />
                            <ListItemText
                              primary={chat.name || `Chat ${index + 1}`}
                              secondary={`${chat.conversation.filter(msg => msg.sender === 'user').length} messages`}
                              primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}
                              secondaryTypographyProps={{ fontSize: '12px', color: '#666' }}
                            />
                            <IconButton onClick={(e) => handleMenuClick(e, chat)} sx={{ padding: '5px' }}>
                              <MoreVertIcon sx={{ color: '#757575' }} />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setOpenRenameDialog(true)}>Rename</MenuItem>
          <MenuItem onClick={() => setOpenDeleteDialog(true)}>Delete</MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>
            Delete chat?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', color: '#666' }}>
              This will delete <strong>{selectedChat?.name}</strong>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#333', fontWeight: 'bold' }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteChat} sx={{ color: 'white', backgroundColor: '#f44336', fontWeight: 'bold', '&:hover': { backgroundColor: '#d32f2f' } }}>
              DELETE
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rename Chat Dialog */}
        <Dialog
          open={openRenameDialog}
          onClose={() => setOpenRenameDialog(false)}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        >
          <DialogTitle id="form-dialog-title" sx={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>
            Rename chat
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New chat name"
              type="text"
              fullWidth
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRenameDialog(false)} sx={{ color: '#333', fontWeight: 'bold' }}>
              Cancel
            </Button>
            <Button onClick={handleRenameChat} sx={{ color: 'white', backgroundColor: '#4caf50', fontWeight: 'bold', '&:hover': { backgroundColor: '#388e3c' } }}>
              Rename
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};

export default ModelsComponent;
