import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton, TextField } from '@mui/material';
import { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSendClick = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '50px' }}>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
        placeholder="Message YOGPT"
        fullWidth
        sx={{ backgroundColor: 'white', borderRadius: '50px', marginRight: 1 }}
      />
      <IconButton onClick={handleSendClick} color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
