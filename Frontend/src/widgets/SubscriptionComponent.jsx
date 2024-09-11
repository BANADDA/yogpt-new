import React, { useState } from 'react';
import { Grid, Box, Card as MUICard, CardContent, Button, Typography as MUITypography, Paper, Link, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaCreditCard, FaBitcoin } from 'react-icons/fa';
import { Payment as PaymentIcon, AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import StripeForm from './StripeForm';
import BittensorForm from './BittensorForm';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'mediumseagreen',
  color: 'white',
  fontSize: '14px',
  fontFamily: 'Poppins',
  '&:hover': {
    backgroundColor: 'seagreen',
  },
}));

const SubscriptionComponent = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleFormSubmit = (data) => {
    console.log('Form data submitted:', data);
    // Handle the form submission logic here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          fontFamily: 'Poppins',
          fontSize: '14px',
          width: { xs: '100%', sm: '80%', md: '70%', lg: '60%' },
          padding: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Paper sx={{ padding: 2, my: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ marginRight: 1 }} />
            <MUITypography variant="h5" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
              Subscribe to YOGPT
            </MUITypography>
          </Box>
        </Paper>

        <MUICard className="mt-8 p-6">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WalletIcon sx={{ marginRight: 1 }} />
              <MUITypography variant="h5" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                Payment Methods
              </MUITypography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 4, height: '100%' }}>
                  <Box sx={{ mb: 4 }}>
                    <MUITypography variant="h6" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '8px' }}>
                      Pay with Stripe
                    </MUITypography>
                    <MUITypography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                      YOGPT follows Stripe's conditions. Stripe is a global online payment processing platform that provides secure and easy-to-use payment options.
                      You can read more about Stripe's services and terms{' '}
                      <Link href="https://stripe.com/" target="_blank" rel="noopener" style={{ fontFamily: 'Poppins' }}>
                        here
                      </Link>
                      .
                    </MUITypography>
                    <StyledButton startIcon={<FaCreditCard />} onClick={() => handlePaymentMethodClick('stripe')}>
                      Pay with Stripe
                    </StyledButton>
                  </Box>
                  <hr />
                  <Box sx={{ mt: 4 }}>
                    <MUITypography variant="h6" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '8px' }}>
                      Pay with Tao Bittensor
                    </MUITypography>
                    <MUITypography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                      TAO Bittensor is a decentralized, open-source protocol that provides secure and transparent payment options using blockchain technology.
                      Learn more about TAO Bittensor{' '}
                      <Link href="https://bittensor.com/" target="_blank" rel="noopener" style={{ fontFamily: 'Poppins' }}>
                        here
                      </Link>
                      .
                    </MUITypography>
                    <StyledButton startIcon={<FaBitcoin />} onClick={() => handlePaymentMethodClick('bittensor')}>
                      Pay with Tao Bittensor
                    </StyledButton>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 4, height: '100%' }}>
                  {selectedPaymentMethod === 'stripe' && <StripeForm onSubmit={handleFormSubmit} />}
                  {selectedPaymentMethod === 'bittensor' && <BittensorForm onSubmit={handleFormSubmit} />}
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </MUICard>
      </Box>
    </Box>
  );
};

export default SubscriptionComponent;
