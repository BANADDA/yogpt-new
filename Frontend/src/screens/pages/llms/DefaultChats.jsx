import { Box, Typography, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FaRobot } from 'react-icons/fa';

const ChatCard = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  width: 'calc(50% - 16px)',
  boxSizing: 'border-box',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  marginBottom: theme.spacing(2),
  elevation: 3,
}));

const defaultChats = [
  { title: 'Plan a trip', description: 'I want to plan a trip to New York City.' },
  { title: 'How to make a cake', description: 'How to make a cake with chocolate and strawberries?' },
  { title: 'Business ideas', description: 'Generate 5 business ideas for a new startup company.' },
  { title: 'What is recursion?', description: 'What is recursion? Show me an example in python.' },
];

const DefaultChats = ({ onChatSelect }) => {
  return (
    <Paper sx={{ padding: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
        <Avatar sx={{ bgcolor: 'mediumseagreen', width: 56, height: 56 }}>
          <FaRobot size={36} />
        </Avatar>
        <Typography variant="h5" style={{ fontFamily: 'Poppins', marginTop: '8px' }}>
          YOGPT
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {defaultChats.map((chat, index) => (
          <ChatCard key={index} onClick={() => onChatSelect(chat)} elevation={3}>
            <Typography variant="h6" noWrap style={{ fontSize: '12px', fontFamily: 'Poppins' }}>
              {chat.title}
            </Typography>
            <Typography variant="body2" noWrap style={{ fontSize: '12px', fontFamily: 'Poppins' }}>
              {chat.description}
            </Typography>
          </ChatCard>
        ))}
      </Box>
    </Paper>
  );
};

export default DefaultChats;
