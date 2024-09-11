import { DatasetRounded, Delete, Upload } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Autocomplete, Box, Button, Card, CardContent, Chip, CircularProgress, Drawer, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../auth/config/firebase-config';

const models = [
    { name: 'GPT2', id: 'openai-community/gpt2', description: 'Text Generation', lastUsed: '3 hours ago', usageCount: '339k' },
    { name: 'GPT-2 Medium', id: 'openai-community/gpt2-medium', description: 'Text Generation', lastUsed: '5 days ago', usageCount: '48.5k' },
    { name: 'GPT-2 Large', id: 'openai-community/gpt2-large', description: 'Text Generation', lastUsed: '3 hours ago', usageCount: '17.7k' },
    { name: 'OpenELM 270M', id: 'apple/OpenELM-270M', description: 'Text Generation', lastUsed: '21 hours ago', usageCount: '84.8k' },
    { name: 'OpenELM 450M', id: 'apple/OpenELM-450M', description: 'Text Generation', lastUsed: '4 days ago', usageCount: '3.47k' },
    { name: 'OpenELM 3B', id: 'apple/OpenELM-3B', description: 'Text Generation', lastUsed: '3 days ago', usageCount: '77.8k' },
    { name: 'NousResearch llama2', id: 'NousResearch/Llama-2-7b-chat-hf', description: 'Text Generation', lastUsed: '5 days ago', usageCount: '616' },
    { name: 'LLaMA-3.1 8B', id: 'unsloth/llama-3-8b-bnb-4bit', description: 'Text Generation', lastUsed: '3 hours ago', usageCount: '66.1k' },
];

const tagOptions = ['Text Generation', 'Task Classification', 'Question Answering', 'Zero Shot Classification', 'Others'];

const DatasetModal = ({ open, onClose }) => {
    const [datasetName, setDatasetName] = useState('');
    const [license, setLicense] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [files, setFiles] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null); // Change to a single model
    const [tags, setTags] = useState([]);
    const [datasetNameError, setDatasetNameError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId('');
            }
        });
        return () => unsubscribe();
    }, [])

    const validateData = () => {
        let valid = true;
        if (!datasetName.trim()) {
            setDatasetNameError('Please enter a dataset name.');
            valid = false;
        } else {
            setDatasetNameError('');
        }
        if (files.length === 0) {
            toast.error('Please upload at least one file.');
            valid = false;
        }
        if (!license) {
            toast.error('Please select a license.');
            valid = false;
        }
        if (!selectedModel) { // Update validation for single model selection
            toast.error('Please select a model.');
            valid = false;
        }
        return valid;
    };

    const handleSubmit = async () => {
        if (validateData()) {
            setIsLoading(true);
            const submissionTime = new Date().toISOString();
            const fullDatasetName = `${userId}_${datasetName}`;
    
            const formData = new FormData();
            formData.append('datasetName', fullDatasetName);
            formData.append('license', license);
            formData.append('visibility', visibility);
            formData.append('models', selectedModel.id.toLowerCase()); // Ensure model ID is appended correctly and in lowercase
            formData.append('tags', tags.join(',')); // Join tags as a comma-separated string
            formData.append('submissionTime', submissionTime);
    
            // Check if there are files and append the first one
            if (files.length > 0) {
                const file = files[0].file; // Get the actual file object
                if (file) {
                    formData.append('file', file); // Ensure the file is appended correctly
                    formData.append('fileName', file.name);
                    formData.append('fileSize', (file.size / 1048576).toFixed(2) + ' MBs'); // Convert size to MB
                    formData.append('uploadedAt', files[0].uploadedAt);
                } else {
                    console.error('File is not available.');
                    toast.error('File is not available.');
                    setIsLoading(false);
                    return;
                }
            }
    
            // Log the data being submitted
            console.log("Submitting Data:");
            console.log("Dataset Name:", fullDatasetName);
            console.log("License:", license);
            console.log("Visibility:", visibility);
            console.log("Model ID:", selectedModel.id);
            console.log("Tags:", tags);
            console.log("Submission Time:", submissionTime);
            console.log("Files:", files);
    
            try {
                const response = await fetch('https://myowngpt-server.onrender.com/create-dataset', {
                    method: 'POST',
                    body: formData
                });
    
                const data = await response.json();
    
                console.log("Response dataset:", data);
    
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create dataset.');
                }
    
                setIsLoading(false);
                toast.success('Dataset created successfully...', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
    
                // Clear form inputs
                setDatasetName('');
                setLicense('');
                setVisibility('public');
                setFiles([]);
                setSelectedModel(null);
                setTags([]);
    
                // Close modal
                onClose();
            } catch (error) {
                console.error('Error creating dataset:', error);
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsLoading(false);
            }
        }
    };    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9), // generating a pseudo-unique ID for key purposes
                name: file.name,
                size: file.size,
                uploadedAt: new Date().toLocaleString(),
                file // Add the actual file object here
            }))]);
        },
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls', '.xlsx']
        }
    });

    const handleDeleteFile = fileId => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    maxWidth: '600px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <Box sx={{ textAlign: 'center', borderBottom: '1px solid #e0e0e0', padding: '24px' }}>
                <DatasetRounded color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '24px', mt: 2 }}>
                    Create a new dataset repository
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '16px' }}>
                    A dataset repository contains all dataset files.
                </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: '8px', right: '8px' }}>
                <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 2, padding: '0 24px', marginTop: 3 }}>
                <TextField
                    error={!!datasetNameError}
                    helperText={datasetNameError}
                    label="Dataset name"
                    variant="outlined"
                    fullWidth
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="New dataset name"
                />
            </Box>
            <Card sx={{ 
                p: 5,
                m: 3,
                border: '2px dashed #1976d2', 
                borderRadius: 2,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '250px',
                cursor: 'pointer' 
            }}>
                <CardContent {...getRootProps()} sx={{ textAlign: 'center', mb: 5 }}>
                    <input {...getInputProps()} />
                    <CloudUploadIcon color="primary" sx={{ fontSize: 60, mt: 5 }} />
                    <Typography variant="h6">
                        {isDragActive ? "Drop the file here..." : "Drag & drop a file here"}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Browse
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                        drop a file here
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', }}>
                        *File supported: .csv, .xls, .xlsx
                    </Typography>
                </CardContent>
            </Card>
            
            {files.length > 0 && (
                <Box sx={{ padding: '0 24px' }}>
                    {files.map((file) => (
                        <Box key={file.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', py: 1 }}>
                            <Typography variant="body2">{file.name}</Typography>
                            <Typography variant="body2">{`${(file.size / 1024).toFixed(2)} KB`}</Typography>
                            <Typography variant="body2">{file.uploadedAt}</Typography>
                            <IconButton onClick={() => handleDeleteFile(file.id)}><Delete color='error' /></IconButton>
                        </Box>
                    ))}
                </Box>
            )}
            <Box sx={{ width: 500, maxWidth: '100%', padding: '0 24px', marginTop: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Model and Tags
              </Typography>
        
              <Autocomplete
              sx={{mb: 3}}
                multiple
                id="tags-autocomplete"
                options={tagOptions}
                freeSolo
                value={tags}
                onChange={(event, newValue) => setTags(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Add Tags"
                  />
                )}
              />
        
              <Autocomplete
                id="models-autocomplete"
                options={models}
                getOptionLabel={(option) => option.name}
                value={selectedModel}
                onChange={(event, newValue) => setSelectedModel(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Model"
                    placeholder="Select a Model"
                  />
                )}
              />
            </Box>
            <Box sx={{ padding: '0 24px', marginTop: 2 }}>
                <TextField
                    select
                    label="License"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    variant="outlined"
                    fullWidth
                >
                    {["Apache-2.0", "MIT", "GPL-3.0", "BSD-3-Clause", "CC0-1.0"].map((license) => (
                        <MenuItem key={license} value={license}>
                            {license}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Box sx={{ padding: '24px', paddingBottom: '10px' }}>
                <RadioGroup
                    row
                    name="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                >
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                </RadioGroup>
            </Box>
            <Box sx={{ padding: '24px', paddingTop: 0, textAlign: 'center' }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={isLoading ? <CircularProgress size={24} /> : <Upload />}
                onClick={handleSubmit}
                disabled={isLoading}
                >
                {isLoading ? 'Creating...' : 'Create Dataset'}
            </Button>
            </Box>
            <ToastContainer />
        </Drawer>
    );
};

export default DatasetModal;
