import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getChatHistory, saveChatHistory } from '../../../auth/config/firebase-config';
import DefaultChats from './DefaultChats';

const ChatUI = ({ model, setActiveScreen }) => {
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
    setActiveScreen('Inference');
    console.log("Set active screen to inference");
    console.log("Model: fetched: ", model);

    // Fetch chat histories from Firebase
    const fetchChatHistories = async () => {
      if (model.userId && model.id) {
        const fetchedHistories = await getChatHistory(model.userId, model.id);
        console.log('Fetched chat histories on load:', fetchedHistories);
        setChatHistories(fetchedHistories);
      }
    };

    fetchChatHistories();
  }, [setActiveScreen, model.userId, model.id]);

  useEffect(() => {
    if (model.userId && model.id && chatHistories.length > 0) {
      console.log('Chat histories updated:', chatHistories);
      saveChatHistory(model.userId, model.id, chatHistories);
    }
  }, [chatHistories, model.userId, model.id]);

  const generateChatName = (conversation) => {
    const keywords = conversation.slice(0, 1).map(msg => msg.text.split(' ').slice(0, 3).join(' ')).join(', ');
    return keywords || `Chat on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`;
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
      const sanitizedEndpointUrl = model.serverUrl.trim();
      const requestData = {
        endpoint_url: sanitizedEndpointUrl,
        prompt: message,
      };

      console.log("Request data", requestData);
  
      const response = await axios.post('https://yogpt-server.vercel.app/inference', requestData, {
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

  const groupedChats = groupChatsByDate(chatHistories);

  if (!model) return <div>No model selected</div>;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-6 mt-10">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', marginTop: '60px', paddingLeft: '280px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '280px' }}>
            <Box sx={{ position: 'fixed', top: '64px', left: '280px', right: '280px', backgroundColor: 'white', zIndex: 10, borderBottom: '1px solid grey' }}>
              <Typography variant="h6">J.A.R.V.I.S : {model.modelName}</Typography>
            </Box>
            {conversation.length === 0 && (
              <Box sx={{ textAlign: 'center', marginTop: '5%' }}>
                <DefaultChats/>
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
};

export default ChatUI;


