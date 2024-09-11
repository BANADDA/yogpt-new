import SendIcon from '@mui/icons-material/Send';
import { Box, CircularProgress, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const MessageInput = ({ model_url, addMessage, updateLastMessage }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const endpoint = "https://x8wnetsdbdlewc-80.proxy.runpod.net/generate";

  const handleSend = async () => {
    if (!message) return;

    setLoading(true);
    const userMessage = `You: ${message}`;
    addMessage(userMessage);  

    const botPlaceholder = `Bot: `; 
    addMessage(botPlaceholder);

    const requestData = {
      endpoint_url: endpoint,
      prompt: message,
    };

    try {
      const response = await axios.post('https://yogpt-server.vercel.app/inference', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);
      if (response.data && response.data.generated_text) {
        streamBotResponse(`Bot: ${response.data.generated_text}`);
      } else {
        updateLastMessage(`Bot: No response received`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      updateLastMessage(`Bot: Error occurred while sending message`);
    }

    setMessage(''); // Clear the input field after sending the message
  };

  const streamBotResponse = (responseText) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < responseText.length) {
        updateLastMessage(responseText.substring(0, index + 1));
        index += 1;
      } else {
        clearInterval(intervalId);
        setLoading(false); // Stop loading after streaming the response
      }
    }, 30); // Adjust the interval duration to control the streaming speed
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
      event.preventDefault();
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', borderTop: 1, borderColor: 'divider', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        sx={{ mr: 2 }}
        disabled={loading}
      />
      <IconButton color="primary" aria-label="send" onClick={handleSend} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

export default MessageInput;
