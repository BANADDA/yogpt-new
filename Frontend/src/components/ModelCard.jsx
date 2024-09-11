import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const ModelCard = ({ model, onClick, onUseModel }) => {
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
              textTransform: 'none', // Removes uppercase styling from button text
            }}
          >
            Use Model
          </Button>
        </Box>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <DownloadIcon sx={{ fontSize: 'small', marginRight: '5px' }} />
            <Typography variant="body2" color="textSecondary">
              {model.usageCount}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '10px' }}>
            Last used: {model.lastUsed}
          </Typography> */}
        </Box>
        {/* New placement for the button */}
      </CardContent>
    </Card>
  );
};

export default ModelCard;

// import DownloadIcon from '@mui/icons-material/Download';
// import { Box, Card, CardContent, Typography } from '@mui/material';
// import React from 'react';

// const ModelCard = ({ model, onClick }) => {
//   return (
//     <Card
//       sx={{
//         background: '#fff',
//         color: '#333',
//         cursor: 'pointer',
//         marginBottom: '15px',
//         '&:hover': {
//           transform: 'translateY(-5px)',
//           boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
//         },
//       }}
//       onClick={onClick}
//     >
//       <CardContent>
//         <Typography variant="h6" component="div" gutterBottom>
//           {model.name}
//         </Typography>
//         <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
//           {model.id}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
//           <Typography variant="body2" color="textSecondary">
//             {model.description}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
//             <DownloadIcon sx={{ fontSize: 'small', marginRight: '5px' }} />
//             <Typography variant="body2" color="textSecondary">
//               {model.usageCount}
//             </Typography>
//           </Box>
//           <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '10px' }}>
//             Last used: {model.lastUsed}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default ModelCard;
