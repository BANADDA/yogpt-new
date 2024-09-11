import {
  Box, Button,
  Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth/config/firebase-config';

const PricingContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));//

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const pricingData = [
    { model: 'llama2-7b', trainingPerHour: '$1.5', hostingPerHour: '$1.5', trainingPer1kTokens: '$0.0005', inputPer1kTokens: '$0.0025', outputPer1kTokens: '$0.0035' },
    { model: 'OpenELM-270', trainingPerHour: '$1.0', hostingPerHour: '$0.6', trainingPer1kTokens: '$0.0005', inputPer1kTokens: '$0.0010', outputPer1kTokens: '$0.0020' },
    { model: 'OpenELM-450M', trainingPerHour: '$1.5', hostingPerHour: '$1.0', trainingPer1kTokens: '$0.0014', inputPer1kTokens: '$0.0015', outputPer1kTokens: '$0.0025' },
    { model: 'OpenELM-3B', trainingPerHour: '$2.5', hostingPerHour: '$2.0', trainingPer1kTokens: '$0.0014', inputPer1kTokens: '$0.0020', outputPer1kTokens: '$0.0030' },
    { model: 'GPT2', trainingPerHour: '$1.5', hostingPerHour: '$0.8', trainingPer1kTokens: '$0.005', inputPer1kTokens: '$0.0010', outputPer1kTokens: '$0.0015' },
    { model: 'LLama3B', trainingPerHour: '$2.5', hostingPerHour: '$2.2', trainingPer1kTokens: '$0.0015', inputPer1kTokens: '$0.0020', outputPer1kTokens: '$0.0030' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{
        py: { xs: 4, sm: 6, md: 8 },
        backgroundColor: '#0000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>

        <Box justifyContent="center" alignItems="center" sx={{ mb: 14, padding: { xs: 2, sm: 4, md: 8 } }}>
          <Typography variant="h3" sx={{ mb: 2 ,fontFamily:'Poppins'}}>Pricing</Typography>
          <Typography variant="h6" sx={{ mb: 2, fontFamily:'Poppins',marginX: { xs: 0, md: 40 } }}>Simple and flexible. Only pay for what you use.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: 'green', color: 'white', borderRadius: '20px', padding: '10px 20px',fontFamily:'Poppins' }}>Contact Sales</Button>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2,fontFamily:'Poppins' }}>Available Models</Typography>
          <Typography variant="body1" sx={{ mb: 2,fontFamily:'Poppins', textAlign: 'left', paddingX: { xs: 2, sm: 4 }, marginX: { xs: 0, sm: 20 } }}>
            Multiple models, each with different capabilities and price points. Prices can be viewed in units of either per 1M or 1K tokens. 
            You can think of tokens as pieces of words, where 1,000 tokens is about 750 words.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2,fontFamily:'Poppins', textAlign: 'left', marginX: { xs: 0, sm: 20 } }}>
            Language models are also available in the Batch API that returns completions within 24 hours for a 50% discount.
          </Typography>
        </Box>
        
        <Paper sx={{ width: '100%', mb: 4, p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'left',fontFamily:'Poppins' }}>Fine-tune Models</Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'left',fontFamily:'Poppins' }}>
              Create your own custom models by fine-tuning our base models with your training data. Once you fine-tune a model, you’ll be billed only for the tokens you use in requests to that model.
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Model</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Training per hour</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Hosting per hour</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Training per 1k tokens</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Input per 1k tokens</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold',fontFamily:'Poppins' }}>Output per 1k tokens</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pricingData.map((row) => (
                  <TableRow key={row.model}>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.trainingPerHour}</TableCell>
                    <TableCell>{row.hostingPerHour}</TableCell>
                    <TableCell>{row.trainingPer1kTokens}</TableCell>
                    <TableCell>{row.inputPer1kTokens}</TableCell>
                    <TableCell>{row.outputPer1kTokens}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default PricingContent;
