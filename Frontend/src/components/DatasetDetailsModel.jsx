import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, Modal, Slider, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, newTrainingJob } from '../auth/config/firebase-config'; // Import the function to add a new training job

const ValueLabelComponent = (props) => {
  const { children, value } = props;
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const DatasetDetailsModel = ({ open, onClose, model, dataset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(1);
  const [epochs, setEpochs] = useState(3);
  const [autoBatchSize, setAutoBatchSize] = useState(true);
  const [autoLearningRate, setAutoLearningRate] = useState(true);
  const [autoEpochs, setAutoEpochs] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(dataset || ""); // Use the provided dataset
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Assuming dataset is an object with an 'id' you want to display
    setSelectedDataset(dataset ? dataset.datasetId : "");
    console.log("Updated dataset details:", dataset);
  }, [dataset]);

  const handleToggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleBatchSizeChange = (event, newValue) => {
    setBatchSize(newValue);
  };

  const handleLearningRateChange = (event, newValue) => {
    setLearningRate(newValue);
  };

  const handleEpochsChange = (event, newValue) => {
    setEpochs(newValue);
  };

  const user = auth.currentUser;

  const handleStartFineTuning = async () => {
    if (!selectedDataset) {
      toast.error("Please select a dataset before starting the fine-tuning job.");
      return;
    }

    setLoading(true);
    const jobData = {
      baseModel: model.id,
      huggingFaceId: selectedDataset,
      userId: user.uid,
      fineTuningType: model.description,
      licenseSelected: "open", // Assuming licenseSelected is always "open"
      domain: model.description, // Assuming domain is always "domain"
      status: "pending", // Initial job status
      batchSize: autoBatchSize ? "auto" : batchSize,
      learningRateMultiplier: autoLearningRate ? "auto" : learningRate,
      numberOfEpochs: autoEpochs ? "auto" : epochs,
    };

    console.log("Submitting job data:", jobData);

    try {
      const jobResponse = await newTrainingJob(jobData);
      console.log("Created job ID:", jobResponse.jobId);
      setLoading(false);
      toast.success("Fine-tuning job started successfully!");
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      console.error("Error starting fine-tuning job:", error);
      toast.error("Failed to start fine-tuning job.");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            backdropFilter: 'blur(8px)', // Add blur effect to the background
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{model.name}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Model ID"
              value={model.id}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
            <TextField
              label="Description"
              value={model.description}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
            <TextField
              label="Selected Dataset"
              value={selectedDataset}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true, // Make the field read-only
              }}
            />
            <Button
              variant="contained"
              onClick={handleToggleAdvanced}
              sx={{ mt: 2, display: 'block', width: 'fit-content' }}
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>
            {showAdvanced && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Hyperparameter Tuning</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Batch size</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={batchSize}
                      onChange={handleBatchSizeChange}
                      aria-labelledby="batch-size-slider"
                      min={1}
                      max={128}
                      disabled={autoBatchSize}
                      valueLabelDisplay="auto"
                      ValueLabelComponent={ValueLabelComponent}
                      sx={{ flexGrow: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoBatchSize}
                          onChange={(e) => setAutoBatchSize(e.target.checked)}
                        />
                      }
                      label="Auto"
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Learning rate multiplier</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={learningRate}
                      onChange={handleLearningRateChange}
                      aria-labelledby="learning-rate-slider"
                      min={0.1}
                      max={10}
                      step={0.1}
                      disabled={autoLearningRate}
                      valueLabelDisplay="auto"
                      ValueLabelComponent={ValueLabelComponent}
                      sx={{ flexGrow: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoLearningRate}
                          onChange={(e) => setAutoLearningRate(e.target.checked)}
                        />
                      }
                      label="Auto"
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Number of epochs</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={epochs}
                      onChange={handleEpochsChange}
                      aria-labelledby="epochs-slider"
                      min={1}
                      max={10}
                      disabled={autoEpochs}
                      valueLabelDisplay="auto"
                      ValueLabelComponent={ValueLabelComponent}
                      sx={{ flexGrow: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoEpochs}
                          onChange={(e) => setAutoEpochs(e.target.checked)}
                        />
                      }
                      label="Auto"
                    />
                  </Box>
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={24} /> : <PlayArrowIcon />}
                onClick={handleStartFineTuning}
                disabled={loading}
              >
                {loading ? 'Starting...' : 'Start Fine-tuning'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default DatasetDetailsModel;
