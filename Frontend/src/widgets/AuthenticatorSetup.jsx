import { AccountBalanceWallet, CheckCircleOutline, Email, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, Link, Paper, TextField, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';

const AuthenticatorSetup = ({ userEmail, onContinue }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recoveryPhraseAcknowledged, setRecoveryPhraseAcknowledged] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleCheckboxChange = (event) => {
    setAcceptedTerms(event.target.checked);
  };

  const toggleWalletVisibility = () => {
    setWalletVisible(!walletVisible);
  };

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = 'User Name is required';
    if (!walletAddress) errors.walletAddress = 'Wallet Address is required';
    if (!acceptedTerms) errors.terms = 'You must accept the terms and conditions';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('https://yogpt-server.vercel.app/register-miner', {
        ethereumAddress: walletAddress,
        username: username,
        email: userEmail,
      });
      setResult(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error registering miner:', error);
      setLoading(false);
    }
  };

  const handleDownloadCredentials = () => {
    const blob = new Blob(
      [`Username: ${result.username}\nPassword: ${result.password}`],
      { type: 'text/plain;charset=utf-8' }
    );
    saveAs(blob, 'miner_credentials.txt');
  };

  const handleProceed = () => {
    onContinue();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ background: 'linear-gradient(to right)' }}
    >
      {result ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 600, width: '100%', padding: 4, borderRadius: 3, backgroundColor: 'white', boxShadow: 3 }}
        >
          <CheckCircleOutline sx={{ fontSize: 80, color: '#00aaff', marginBottom: 2 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#333' }}>
            Success, miner account created successfully!
          </Typography>
          <Typography variant="h7" component="div" sx={{ marginBottom: 1, color: '#666' }}>
            Save your miner credentials below:
          </Typography>
          <Card sx={{ padding: 1, borderRadius: 2, width: '100%', marginBottom: 2, backgroundColor: '#f8f8f8', boxShadow: 1 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: 'bold' }}>
                    Username: <span style={{ fontWeight: 'normal' }}>{result.username}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: 'bold' }}>
                    Password: <span style={{ fontWeight: 'normal' }}>{result.password}</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Alert severity="warning" sx={{ marginBottom: 1 }}>
            <AlertTitle>NOTE</AlertTitle>
            In case you forget your credentials, this information is the only way to gain access to your account. Keep it secret.
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={recoveryPhraseAcknowledged}
                onChange={(e) => setRecoveryPhraseAcknowledged(e.target.checked)}
                color="primary"
              />
            }
            label="I've saved my credentials"
            sx={{ marginBottom: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadCredentials}
              sx={{ textTransform: 'none', padding: '10px 20px', fontSize: '16px', marginBottom: 2 }}
              disabled={!recoveryPhraseAcknowledged}
            >
              Download Credentials
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleProceed}
              sx={{ textTransform: 'none', padding: '10px 20px', fontSize: '16px', marginBottom: 2 }}
              disabled={!recoveryPhraseAcknowledged}
            >
              Continue to Dashboard
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 800, width: '100%', padding: 4 }}
        >
          <Toolbar />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            YoGpt Miner Program
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginBottom: 4 }}>
            Provide your user name and wallet address to register as compute provider.
          </Typography>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: '130%' }}>
            <Box sx={{ marginTop: 1 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'semibold', marginBottom: 2, textAlign: 'left' }}>
                Microsoft Authenticator
              </Typography>
              <Box sx={{ textAlign: 'left', marginBottom: 2 }}>
                <Typography variant="body1" component="div">
                  Enter your miner user name
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="User Name"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 2, maxWidth: 700 }}
                />
              </Box>
              <Box sx={{ textAlign: 'left', marginBottom: 2 }}>
                <Typography variant="body1" component="div">
                  Your email address
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Email Address"
                  type="email"
                  fullWidth
                  value={userEmail}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 2, maxWidth: 700 }}
                />
              </Box>
              <Box sx={{ textAlign: 'left', marginBottom: 2 }}>
                <Typography variant="body1" component="div">
                  Enter your wallet address
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Wallet Address"
                  type={walletVisible ? 'text' : 'password'}
                  fullWidth
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  error={!!formErrors.walletAddress}
                  helperText={formErrors.walletAddress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWallet />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleWalletVisibility} edge="end">
                          {walletVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 2, maxWidth: 700 }}
                />
              </Box>
              <Box sx={{ textAlign: 'left', maxWidth: 700, marginBottom: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={handleCheckboxChange}
                      name="terms"
                      color="primary"
                    />
                  }
                  label={<Typography variant="body2">I accept the <Link href="#">terms and conditions</Link></Typography>}
                />
                {formErrors.terms && (
                  <Typography variant="body2" color="error">
                    {formErrors.terms}
                  </Typography>
                )}
              </Box>
              <Box sx={{ textAlign: 'left', maxWidth: 700 }}>
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  sx={{ textTransform: 'none', backgroundColor: "green" }}
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AuthenticatorSetup;
