import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../auth/config/firebase-config';
import { gpt2Pipeline } from './pipelinesFedertaed/gpt2pipeline';

const FederatedModel = ({ open, onClose, model }) => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(''); // Store the real token here
  const [showToken, setShowToken] = useState(false); // Control whether to show token
  const [pipelineCode, setPipelineCode] = useState(''); // Holds the pipeline code
  const [generatingToken, setGeneratingToken] = useState(false); // Control loader state for token generation

  useEffect(() => {
    console.log("Model name and id: ", model.name, model.id);
    
    // Conditionally load the pipeline based on the trimmed model name
    if (model.name.trim().toLowerCase() === 'gpt2') {
      setPipelineCode(gpt2Pipeline); // Load GPT2 pipeline code
    } else {
      setPipelineCode(''); // You can add more pipelines here for different models
    }
  }, [model.name]);

  // Show/hide token toggle (this just controls visibility)
  const handleShowTokenToggle = () => {
    setShowToken(!showToken);
  };

  const handleStartFineTuning = async () => {
    setLoading(true);
    try {
      // Logic for starting fine-tuning job
      setLoading(false);
      toast.success('Fine-tuning job started successfully!');
    } catch (error) {
      setLoading(false);
      toast.error('Failed to start fine-tuning job.');
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(accessToken);
    toast.success('Access token copied to clipboard!');
  };

  const handleCopyPipeline = () => {
    navigator.clipboard.writeText(pipelineCode);
    toast.success('Pipeline code copied to clipboard!');
  };

  const handleDownloadPipeline = () => {
    const element = document.createElement('a');
    const file = new Blob([pipelineCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${model.name.toLowerCase()}_pipeline.py`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    toast.success('Pipeline downloaded as Python file!');
  };

  // Helper function to generate access token
  const generateAccessToken = (userId, modelId) => {
    const userPart = userId.slice(0, 3).toLowerCase(); // First 3 letters of the user ID
    const modelPart = modelId.replace(/\//g, '_').replace(/\s+/g, '_').toLowerCase(); // Replace slashes and spaces with underscores
    const now = new Date();
    
    // Date part with hours and minutes
    const datePart = `${now.toISOString().split('T')[0].replace(/-/g, '')}_${now.getHours()}${now.getMinutes()}`;
  
    // Random suffix: 1 random letter + 2 random digits
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random letter (a-z)
    const randomDigits = Math.floor(100 + Math.random() * 900).toString().slice(0, 2); // Two random digits (00-99)
  
    const randomSuffix = `${randomLetter}${randomDigits}`;
  
    return `${userPart}_${modelPart}_${datePart}_${randomSuffix}`; // Join parts with underscores
  };  

  // Check if an access token already exists
  const fetchExistingToken = async (userId, modelId) => {
    const tokenQuery = query(collection(db, 'federated_tokens'), where('userId', '==', userId), where('modelId', '==', modelId));
    const tokenSnapshot = await getDocs(tokenQuery);
    if (!tokenSnapshot.empty) {
      return tokenSnapshot.docs[0]; // Return the existing token document
    }
    return null;
  };

  // Method to create or regenerate access token and save it to Firestore
  const handleGenerateToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in");
      return;
    }

    setGeneratingToken(true); // Show loader on the Generate button

    try {
      const existingTokenDoc = await fetchExistingToken(user.uid, model.id);

      // Generate a new access token
      const newAccessToken = generateAccessToken(user.uid, model.id);

      if (existingTokenDoc) {
        // If a token exists, update it
        await updateDoc(doc(db, 'federated_tokens', existingTokenDoc.id), {
          accessToken: newAccessToken,
          updatedAt: new Date(),
        });
        console.log("Access token updated.");
      } else {
        // If no token exists, create a new one
        await addDoc(collection(db, 'federated_tokens'), {
          userId: user.uid,
          modelId: model.id,
          accessToken: newAccessToken,
          createdAt: new Date(),
        });
        console.log("New access token created.");
      }

      setAccessToken(newAccessToken); // Update the token in the state
      toast.success('Generated new access token successfully!');
    } catch (error) {
      console.error("Error creating or saving access token:", error);
      toast.error('Failed to create access token.');
    } finally {
      setGeneratingToken(false); // Hide loader
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
            <Typography variant="h6">Fine-Tune {model.name}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Access Token Section */}
          <Box sx={{ mt: 4, border: '1px solid #e0e0e0', padding: '16px', borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Generated Access Token</Typography>
              <Button
                onClick={handleGenerateToken}
                variant="outlined"
                sx={{ textTransform: 'none' }}
                disabled={generatingToken} // Disable while generating
              >
                {generatingToken ? <CircularProgress size={24} /> : 'Generate'}
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
              Use your generated access token to start the fine-tuning process.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  flexGrow: 1,
                }}
              >
                {showToken ? accessToken : '***************'}
              </Typography>
              <Button onClick={handleShowTokenToggle} sx={{ ml: 2, textTransform: 'none' }}>
                {showToken ? 'Hide' : 'Show'}
              </Button>
              <IconButton onClick={handleCopyToken} sx={{ ml: 2 }}>
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Conditionally Display Starter Pipeline */}
          {pipelineCode && (
            <Box sx={{ mt: 4, border: '1px solid #e0e0e0', padding: '16px', borderRadius: '8px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Starter Pipeline</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleCopyPipeline} sx={{ mr: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={handleDownloadPipeline}>
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  border: '1px solid #e0e0e0',
                  padding: '12px',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: '#f4f4f4',
                }}
              >
                <SyntaxHighlighter language="python" style={tomorrow}>
                  {pipelineCode}
                </SyntaxHighlighter>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
      </Modal>
      <ToastContainer />
    </>
  );
};

export default FederatedModel;
