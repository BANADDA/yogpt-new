import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PauseCircle as PauseCircleIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { fetchCompletedJobById } from '../auth/config/firebase-config';
import GraphWidget from '../wandb/wandGraphWidget';
import DeploymentModal from './DeploymentModal';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const JobDetails = ({ job, setActiveScreen }) => { // Add setActiveScreen here
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobForDeployment, setSelectedJobForDeployment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const convertTimestampToDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return null;
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const createdAt = convertTimestampToDate(job.createdAt);
  const finishedAt = convertTimestampToDate(job.finishedAt);

  const calculateDuration = (start, end) => {
    if (!start) return 'N/A';
    if (!end) return '00:00:00';
    const duration = new Date(end - start);
    const hours = duration.getUTCHours().toString().padStart(2, '0');
    const minutes = duration.getUTCMinutes().toString().padStart(2, '0');
    const seconds = duration.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const trainDuration = calculateDuration(createdAt, finishedAt);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <SyncIcon sx={{ color: 'blue', animation: 'spin 2s linear infinite' }} />;
      case 'stopped':
        return <PauseCircleIcon sx={{ color: 'red' }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'pending':
        return <HourglassEmptyIcon sx={{ color: 'orange', animation: 'pulse 2s infinite' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'red' }} />;
      default:
        return null;
    }
  };

  const labels = [
    'Model Type:',
    'Dataset ID:',
    'Train Created On:',
    'Train Finished On:',
    'Train Duration:',
    'Tags:',
  ];

  const tag = `${job.baseModel}, ${job.huggingFaceId}, ${job.fineTuningType}, ${job.suffix}`;

  const values = [
    job.fineTuningType,
    job.huggingFaceId,
    createdAt?.toLocaleString(),
    finishedAt ? finishedAt.toLocaleString() : 'N/A',
    trainDuration,
    tag,
  ];

  const handleOpenDeploymentModal = async (job) => {
    try {
      setLoading(true);
      console.log('Opening deployment modal for jobId:', job.id); // Debug log
      const jobDetails = await fetchCompletedJobById(job.id);
      setSelectedJobForDeployment(jobDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching completed job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeploymentModal = () => {
    setIsModalOpen(false);
    setSelectedJobForDeployment(null);
  };

  const handleConfirmDeployment = (jobId) => {
    // Add your deployment logic here
    console.log(`Deploying job with ID: ${jobId}`);
    handleCloseDeploymentModal();
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ marginBottom: '20px', padding: '20px', boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '20px' }}>
            <Typography variant="h5" component="div">
              {job.suffix}
            </Typography>
            {getStatusIcon(job.status)}
            <Box>
              {job.status === 'completed' && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeploymentModal(job);
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : '+ Deploy'}
                </Button>
              )}
              <Button variant="contained" color="error" sx={{ mr: 2 }}>Terminate</Button>
              <Button variant="contained" color="success">Update</Button>
            </Box>
          </Box>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
              <Tab label="Overview" />
              <Tab label="Visualization" />
            </Tabs>
          </AppBar>
          {tabValue === 0 && (
            <Box sx={{ padding: '10px', marginTop: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <Paper elevation={0} sx={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
                    {labels.map((label, index) => (
                      <Typography variant="body2" color="textSecondary" key={index} gutterBottom>{label}</Typography>
                    ))}
                  </Paper>
                </Grid>
                <Grid item xs={10} md={10}>
                  <Paper elevation={0} sx={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
                    {values.map((value, index) => (
                      <Typography variant="body1" key={index}>{value}</Typography>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ marginTop: '20px' }}>
              <GraphWidget projectName={job.id} />
            </Box>
          )}
        </CardContent>
      </Card>
      {isModalOpen && (
        <DeploymentModal
          complete_job={selectedJobForDeployment}
          job={{ baseModel: job.baseModel, modelName: job.suffix }}
          onClose={handleCloseDeploymentModal}
          onConfirm={handleConfirmDeployment}
          setActiveScreen={setActiveScreen} // Pass setActiveScreen here
        />
      )}
    </ThemeProvider>
  );
};

export default JobDetails;
