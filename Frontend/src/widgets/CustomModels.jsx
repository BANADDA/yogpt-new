import React from 'react';
import { Grid,Box} from '@mui/material';
import CustomModalCard from './CustomModalCard';
import { useNavigate } from 'react-router-dom';

const CustomModels = ({ models }) => {
    const navigate  = useNavigate()
  const handleStartChat = (modelurl) => {
    console.log("Model url"+modelurl)
    navigate(`/chat/${modelurl}`);
    // navigate(`/chat`);
    
  };

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/dashboard/video/${id}`);
  };
  return (
        
    <Box> 
    <Grid container spacing={3} justifyContent="center" py={3}>
      {models.map((model, index) => (
        <Grid item key={index}>
          <CustomModalCard
            modelName={model.modelName}
            modelIcon={model.modelIcon}
            description={model.description}
            onStartChat={() => handleStartChat(12)}
            
          />
        </Grid>
      ))}
    </Grid>
    </Box> 

  );
};

export default CustomModels;
