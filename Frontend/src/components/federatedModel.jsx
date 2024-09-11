import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const FederatedModelCard = ({ model, onClick, onUseModel }) => {
  return (
    <Card
      sx={{
        background: '#fff',
        color: '#333',
        cursor: 'pointer',
        marginBottom: '15px',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {model.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          {model.id}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
            {model.description}
          </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onClick}
            sx={{
              textTransform: 'none', 
            }}
          >
            Finetune Model
          </Button>
        </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FederatedModelCard;
