import BitcoinIcon from '@mui/icons-material/CurrencyBitcoin'; // Importing Bitcoin icon
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'; // Importing Link from react-router-dom
import { auth, db } from '../auth/config/firebase-config';

const MinerAccount = () => {
  const [token, setToken] = useState("TAO");
  const [withdrawMethod, setWithdrawMethod] = useState("bittensor");
  const [walletAddress, setWalletAddress] = useState("");
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [availableTokens, setAvailableTokens] = useState(1000); // Mock available tokens
  const [open, setOpen] = useState(false); // State to handle modal open/close

  useEffect(() => {
    // Fetching the wallet address of the current miner
    const fetchWalletAddress = async () => {
      const user = auth.currentUser;
      if (user) {
        const minerQuery = query(collection(db, 'miners'), where('email', '==', user.email));
        const minerSnapshot = await getDocs(minerQuery);
        if (!minerSnapshot.empty) {
          const minerData = minerSnapshot.docs[0].data();
          setWalletAddress(minerData.ethereumAddress || "N/A");
        }
      }
    };

    fetchWalletAddress();

    // Mock bank list data
    setBankList(["Bank of America", "Chase", "Wells Fargo", "Citibank"]);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const getTokenEquivalence = () => {
    const taoEquivalent = (availableTokens * 0.3).toFixed(2);
    const usdEquivalent = (availableTokens * 1.5).toFixed(2);

    if (token === "TAO") {
      return `${availableTokens} Tokens = ${taoEquivalent} TAO`;
    } else if (token === "USD") {
      return `${availableTokens} Tokens = ${usdEquivalent} USD`;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRedeem = () => {
    // Redeem logic goes here
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
      <Box component="main" sx={{ flexGrow: 1, mr: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Redeem Payout Tokens
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Available Tokens
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: 1, p: 2, mr: 2, display: "flex", alignItems: "center" }}>
              <BitcoinIcon sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{availableTokens}</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Token Equivalence:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <Select value={token} onChange={(e) => setToken(e.target.value)}>
                <MenuItem value="TAO">TAO</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mb: 3, p: 2, backgroundColor: "#e0f7fa", borderRadius: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#006064" }}>{getTokenEquivalence()}</Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Withdraw to</strong>
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={withdrawMethod} onChange={(e, newValue) => setWithdrawMethod(newValue)}>
              <Tab label="BITENSOR-WALLET" value="bittensor" />
              <Tab label="BANK ACCOUNT" value="bank" />
            </Tabs>
          </Box>

          {withdrawMethod === "bittensor" && (
            <>
              <Typography variant="body2" sx={{ mb: 2, color: "#A80B86", backgroundColor: "#FFF3E0", padding: 2, borderRadius: 1 }}>
                <WarningIcon sx={{ mr: 1 }} /> Ensure your wallet address is correct and that it is a bittensor wallet address. You may lose your assets if you use an incorrect wallet address.
              </Typography>
              <TextField
                fullWidth
                value={walletAddress}
                label="Wallet Address"
                variant="outlined"
                sx={{ mb: 3 }}
                disabled={!isEditing}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleEditClick}>
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </>
          )}

          {withdrawMethod === "bank" && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select Bank
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                  {bankList.map((bank, index) => (
                    <MenuItem key={index} value={bank}>{bank}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Account Number
              </Typography>
              <TextField
                fullWidth
                value={accountNumber}
                label="Account Number"
                variant="outlined"
                onChange={(e) => setAccountNumber(e.target.value)}
                sx={{ mb: 3 }}
              />
            </>
          )}

          <Button 
            variant="contained" fullWidth
            sx={{
             textTransform: 'none',
            }}
            style={{ backgroundColor: '#a777e3' }}
            onClick={handleOpen}
          >
            Redeem Tokens
          </Button>
        </Paper>
      </Box>

      <Box sx={{ width: "300px" }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Tips
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            For the safety of your funds, the customer service may contact you by phone to confirm your withdrawal request. Please pay attention to incoming calls.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ensure the security of your computer and browser to prevent information from being tampered with or leaked.
          </Typography>
          <Typography variant="body2">
            Be aware of scams! Do not share YoGPT account information with other personnel or third party organizations.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            FAQs
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Link to="/withdrawal-limit-adjustment" style={{ textDecoration: 'underline', color: 'blue' }}>
              <strong>Withdrawal Limit Adjustment</strong>
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/calculate-token-equivalence" style={{ textDecoration: 'underline', color: 'blue' }}>
              <strong>How to calculate token equivalence both in Tao and in USD?</strong>
            </Link>
          </Typography>
        </Paper>
      </Box>

      {/* Modal for redeem confirmation */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="redeem-confirmation-dialog-title"
        aria-describedby="redeem-confirmation-dialog-description"
      >
        <DialogTitle id="redeem-confirmation-dialog-title">
          {"Confirm Redeem Tokens"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="redeem-confirmation-dialog-description" sx={{ color: "#A80B86" }}>
            <WarningIcon sx={{ mr: 1 }} /> Redeeming tokens cannot be undone. Please confirm that you want to proceed with the redemption.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleRedeem} 
            sx={{ 
              textTransform: 'none', 
              backgroundColor: '#006400', 
              color: 'white',
              '&:hover': {
                backgroundColor: '#004d00'
              } 
            }}>
            Confirm Redeem
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MinerAccount;
