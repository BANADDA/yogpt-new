import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Snackbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { saveDeployedModel } from '../auth/config/firebase-config';

const DeploymentModal = ({ job, complete_job, onClose, setActiveScreen }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [serverUrl, setServerUrl] = useState('');

  if (!job || !complete_job) return null;

  const extractModelId = (url) => {
    if (url) {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    }
    return '';
  };

  const modelId = extractModelId(complete_job.huggingFaceRepoId);

  const handleConfirmDeployment = async () => {
    const modelData = {
      model_id: modelId,
      model_name: job.modelName
    };

    setLoading(true);

    try {
      const response = await axios.post('https://yogpt-server.vercel.app/deploy-model', modelData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Deployment successful:', response.data);
      setSnackbarMessage('Deployment successful, wait for around 5 minutes for your model to get ready.');
      setSnackbarSeverity('success');
      setServerUrl(response.data);

      // Save deployed model information
      await saveDeployedModel(complete_job.jobId, modelId, response.data, job.modelName);
      setDeploymentSuccess(true);
    } catch (error) {
      console.error('Error deploying model:', error);
      setSnackbarMessage('Error deploying model: ' + error.message);
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleViewDeployedModel = () => {
    setActiveScreen("Models");
    onClose(); // Close the modal
  };

  return (
    <div>
      <Dialog open={Boolean(job)} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {deploymentSuccess ? 'Model Deployed Successfully' : 'Deploy Model'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {deploymentSuccess ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your model has been deployed successfully.
              </Typography>
              <Box my={2} sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Model Name:</strong> {job.modelName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Base Model:</strong> {job.baseModel}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Fine-Tuned Model:</strong> {modelId}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Server URL:</strong> <a href={serverUrl} target="_blank" rel="noopener noreferrer">{serverUrl}</a>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Model Specifications
              </Typography>
              <Box my={2} sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Model Name:</strong> {job.modelName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Base Model:</strong> {job.baseModel}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Fine-Tuned Model:</strong> {modelId}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          {deploymentSuccess ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewDeployedModel}
                sx={{
                  minWidth: '180px',
                  backgroundColor: '#1B6004',
                  '&:hover': {
                    backgroundColor: '#15C057',
                  },
                }}
              >
                View Deployed Model
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{
                  minWidth: '120px',
                  backgroundColor: '#ff1744',
                  '&:hover': {
                    backgroundColor: '#d50000',
                  },
                }}
              >
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                disabled={loading}
                sx={{
                  minWidth: '120px',
                  backgroundColor: '#ff1744',
                  '&:hover': {
                    backgroundColor: '#d50000',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmDeployment}
                disabled={loading}
                sx={{
                  minWidth: '180px',
                  backgroundColor: '#1B6004',
                  '&:hover': {
                    backgroundColor: '#15C057',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Deployment'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeploymentModal;
