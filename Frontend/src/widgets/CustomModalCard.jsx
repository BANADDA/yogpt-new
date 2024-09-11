import React from 'react';
import { Button, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

const CustomModalCard = ({ modelName, modelIcon, description, onStartChat }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {modelIcon}
          </Avatar>
        </Box>
        <Typography variant="h6" component="div" gutterBottom align="center">
          {modelName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom align="center">
          {description}
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', fontSize:'12px', '&:hover': { backgroundColor: 'black' } }}
            startIcon={<ChatIcon />}
            onClick={onStartChat}
          >
            Start Chat
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomModalCard;
