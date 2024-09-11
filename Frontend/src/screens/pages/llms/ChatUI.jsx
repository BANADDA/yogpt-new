import SendIcon from '@mui/icons-material/Send';
import { Box, CssBaseline, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const ChatUI = ({ model }) => {
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState('');

  const addMessageToConversation = (message) => {
    setConversation((prevConversation) => [...prevConversation, { text: message, sender: 'user' }]);
    // Here you would typically call an API or perform some action with the message
    // Then, add the response to the conversation
    setTimeout(() => {
      setConversation((prevConversation) => [...prevConversation, { text: 'This is a response from the AI.', sender: 'ai' }]);
    }, 1000);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      addMessageToConversation(message);
      setMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    console.log(chat);
    // Implement the functionality to load the selected chat
  };

  if (!model) return <div>No model selected</div>;

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 p-6 mt-16 h-screen">
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Box sx={{ width: '280px', position: 'fixed', height: '100%', borderRight: '1px solid grey' }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Chats</Typography>
          <List>
            <ListItem button onClick={() => handleChatSelect('default chat 1')}>
              <ListItemText primary="Generate a ..." secondary="2 messages" />
            </ListItem>
            <ListItem button onClick={() => handleChatSelect('default chat 2')}>
              <ListItemText primary="ex" secondary="0 messages" />
            </ListItem>
          </List>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '280px', padding: 3 }}>
          <Box sx={{ flex: 1, overflowY: 'auto', paddingTop: '20px' }}>
            {conversation.map((msg, index) => (
              <Typography
                key={index}
                sx={{
                  backgroundColor: msg.sender === 'user' ? 'blue.100' : 'grey.300',
                  padding: 1,
                  borderRadius: 1,
                  marginBottom: 1,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                {msg.text}
              </Typography>
            ))}
          </Box>
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', borderTop: '1px solid grey' }}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              placeholder="Message YOGPT"
              fullWidth
              sx={{ marginRight: 1 }}
            />
            <IconButton onClick={handleSendClick} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ChatUI;
