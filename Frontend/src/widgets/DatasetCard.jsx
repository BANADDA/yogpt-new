import { Storage, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import DatasetDetailsModel from '../components/DatasetDetailsModel';

const DatasetCard = ({ repositoryName, datasetId, lastUpdated, visibility, model, tags }) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleCardClick = () => {
    setDetailsModalOpen(true);
  };

  return (
    <>
    <Card

onClick={handleCardClick}
     sx={{
      
      paddingTop: 1,
      width: { xs: '100%', sm: '409px' }, // Responsive width
      background: '#FFFFFF',
      color: '#333',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '8px',
      paddingBottom: 0,
      marginBottom: 2.5
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '8px 0', paddingBottom: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
          <Storage fontSize="small" sx={{ marginRight: 0.5 }} /> {/* Database icon */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'left', width: '100%' }}>
            {repositoryName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start', marginBottom: 0.1, marginTop: 0.5 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Model:
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
            {model}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start', marginBottom: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 0, marginRight: 2, fontWeight: 'bold' }}>
            Updated {lastUpdated}
          </Typography>
          <IconButton aria-label="visibility" size="small" sx={{ paddingRight: '0px' }}>
            {visibility === 'public' ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 1 }}>
              {visibility}
          </Typography>
          {/* Display Tags in the same line */}
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} sx={{ marginRight: 0.5 }} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
    <DatasetDetailsModel
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        model={{ name: model, id: model, description: tags }}
        dataset={{datasetId}}
      />
    </>
  );
};

export default DatasetCard;
