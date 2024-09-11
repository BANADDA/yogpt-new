import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RobotIcon from '@mui/icons-material/SmartToy';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ conversation }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom sx={{color:'green'}}>
        YOGPT
      </Typography>
      {conversation.map((msg, index) => {
        const isUserMessage = msg.startsWith('You:');
        const messageText = msg.replace(/^You: |^Bot: /, ''); // Remove the prefix
        const formattedText = isUserMessage ? messageText : formatResponse(messageText);

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {!isUserMessage && (
              <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                <RobotIcon />
              </Avatar>
            )}
            <Paper
              sx={{
                p: 2,
                maxWidth: '75%',
                backgroundColor: isUserMessage ? '#DCF8C6' : '#FFF',
                boxShadow: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {isUserMessage ? (
                  messageText
                ) : (
                  <ReactMarkdown>{formattedText}</ReactMarkdown>
                )}
              </Typography>
            </Paper>
            {isUserMessage && (
              <Avatar sx={{ bgcolor: '#DCF8C6', ml: 2 }}>
                <AccountCircleIcon />
              </Avatar>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

// Utility function to format response
const formatResponse = (response) => {
  // Convert bullet points into Markdown lists and make bullets/numbers bold
  return response
    .replace(/• /g, '\n- **•** ')  // Bullets to markdown list with bold bullet
    .replace(/(\d+)\. /g, match => `\n**${match.trim()}** `);  // Numbers to markdown list with bold number
};

export default ChatWindow;
