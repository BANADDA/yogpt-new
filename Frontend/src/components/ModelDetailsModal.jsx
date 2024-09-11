import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, MenuItem, Modal, Slider, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
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

const modelDatasets = {
  "openai-community/gpt2": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
  "openai-community/gpt2-medium": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
  "openai-community/gpt2-large": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
  "openai-community/gpt2-xl": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
  "openlm-research/open_llama_7b_v2": ["mlabonne/guanaco-llama2-1k"],
  "openlm-research/open_llama_13b": ["mlabonne/guanaco-llama2-1k"],
  "NousResearch/Llama-2-7b-chat-hf": ["mlabonne/guanaco-llama2-1k"],
  "apple/OpenELM-270M": ["g-ronimo/oasst2_top4k_en"],
  "apple/OpenELM-450M": ["g-ronimo/oasst2_top4k_en"],
  "apple/OpenELM-3B": ["g-ronimo/oasst2_top4k_en"],
  "google/gemma-2b":["Abirate/english_quotes"],
  "google/gemma-2-9b":["Abirate/english_quotes"]
};

const modelGPUs = {
  "openai-community/gpt2": "Nvidia RTX 2080 Ti",
  "openai-community/gpt2-medium": "Nvidia RTX 3090",  
  "openai-community/gpt2-large": "Nvidia A100 (40GB VRAM)",
  "openai-community/gpt2-xl": "Nvidia A100 (40GB VRAM)",
  "openlm-research/open_llama_7b_v2": "Nvidia RTX 2060",
  "openlm-research/open_llama_13b": "Nvidia RTX 3060 12GB",
  "NousResearch/Llama-2-7b-chat-hf": "Nvidia RTX 3090",
  "apple/OpenELM-270M": "Nvidia GTX 1660",
  "apple/OpenELM-450M": "Nvidia RTX 2060",
  "apple/OpenELM-3B": "Nvidia RTX 3090",
  "google/gemma-2b": "Nvidia RTX 3090",
  "google/gemma-2-9b": "Nvidia A100 (40GB VRAM)",
};

const ModelDetailsModal = ({ open, onClose, model }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(1);
  const [epochs, setEpochs] = useState(3);
  const [autoBatchSize, setAutoBatchSize] = useState(true);
  const [autoLearningRate, setAutoLearningRate] = useState(true);
  const [autoEpochs, setAutoEpochs] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
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
                readOnly: true,
              }}
            />
            <TextField
              label="Description"
              value={model.description}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              select
              label="HuggingFace Dataset ID"
              fullWidth
              margin="normal"
              value={selectedDataset}
              onChange={handleDatasetChange}
            >
              <MenuItem value="">Select a dataset</MenuItem>
              {modelDatasets[model.id]?.map((dataset) => (
                <MenuItem key={dataset} value={dataset}>{dataset}</MenuItem>
              ))}
            </TextField>
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

export default ModelDetailsModal;
