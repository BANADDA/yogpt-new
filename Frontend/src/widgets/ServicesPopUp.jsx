import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    backgroundColor: '#f4f6f8',
    height: 'auto',
    maxHeight: '80vh', // Allow dialog to grow but not exceed 80vh
    maxWidth: '100vh', // Set the maxWidth to reduce the dialog width
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));

const Card = styled(Box)(({ theme }) => ({
  width: '50%',
  textAlign: 'left',
  padding: '0',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  margin: '10px 0',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const CardImage = styled('img')({
  width: '100%',
  height: '150px', // Adjust the height to be smaller
  objectFit: 'cover', // Ensure the image covers the area
});

const CardContent = styled(Box)(({ theme }) => ({
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  height: '100%',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 500,
  color: '#1a202c',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#4a5568',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: 'green',
  borderColor: 'green',
  '&:hover': {
    backgroundColor: 'green',
    color: '#fff',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  },
}));

const NewPopup = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLLMs = () => {
      navigate('/llms');
  }

  const handleCom = () => {
    navigate('/com');
}

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div" color="GREEN" gutterBottom className='font-extrabold'>
          YoGPT
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, height: '100%', gap: 5 }}>
          <Card>
            <CardImage src="static/img/finetune.png" alt="Fine-Tune LLMs" />
            <CardContent>
              <CardTitle>Fine-Tune LLMs</CardTitle>
              <CardDescription>
                Optimize language models for specific tasks.
              </CardDescription>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <StartButton variant="outlined" onClick={handleLLMs}>
                  Explore
                </StartButton>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardImage src="static/img/compute.png" alt="Provide Compute" />
            <CardContent>
              <CardTitle>Provide Compute</CardTitle>
              <CardDescription>
                Provide distributed computing resources for model fine-tuning.
              </CardDescription>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <StartButton variant="outlined" onClick={handleCom}>
                  Explore
                </StartButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default NewPopup;
