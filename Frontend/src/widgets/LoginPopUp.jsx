import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Tab, Tabs, TextField, Typography
} from '@mui/material';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../auth/config/firebase-config';
import { getErrorMessage } from '../utils/errorsUtils';

const PopUp = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signInError, setSignInError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setSignInError(getErrorMessage(error.code));
    }
  };

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setSignInError(getErrorMessage(error.code));
    }
  };

  const handleEmailSignUp = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setSignInError(getErrorMessage(error.code));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSignInError('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Button onClick={handleGoogleSignIn} variant="contained" color="secondary" fullWidth>
            Continue with Google
          </Button>
        </Box>
        <Typography variant="h6" align="center">or</Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          error={!!passwordError}
          helperText={passwordError}
        />
        {signInError && <Typography color="error">{signInError}</Typography>}
      </DialogContent>
      <DialogActions>
        {activeTab === 0 ? (
          <Button onClick={handleEmailSignIn} color="primary">Sign In</Button>
        ) : (
          <Button onClick={handleEmailSignUp} color="primary">Sign Up</Button>
        )}
        <Button onClick={onClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopUp;
