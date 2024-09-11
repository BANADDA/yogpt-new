import React from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'mediumseagreen',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Poppins',
    '&:hover': {
        backgroundColor: 'seagreen',
    },
}));

const StripeForm = ({ onSubmit }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            amount: formData.get('amount'),
            cardHolderName: formData.get('cardHolderName'),
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvc: formData.get('cvc'),
            billingAddress: formData.get('billingAddress'),
            consent: formData.get('consent') ? true : false,
        };
        console.log("Form data submitted:", data);
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                Stripe Payment
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                YOGPT follows Stripe's conditions. You can use Visa, MasterCard, American Express, Discover, and other cards.
            </Typography>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <FaCcVisa size={36} style={{ marginRight: '8px' }} />
                <FaCcMastercard size={36} style={{ marginRight: '8px' }} />
                <FaCcAmex size={36} style={{ marginRight: '8px' }} />
                <FaCcDiscover size={36} />
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth name="email" label="Email Address" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="amount" label="Amount" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="cardHolderName" label="Card Holder's Name" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="cardNumber" label="Card Number" variant="outlined" required helperText="Supported: Visa, MasterCard, Amex, Discover" />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth name="expiryDate" label="Expiry Date" variant="outlined" required />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth name="cvc" label="CVC" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="billingAddress" label="Billing Address" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox name="consent" required />}
                        label="I consent to the terms and conditions"
                    />
                </Grid>
                <Grid item xs={12}>
                    <StyledButton type="submit" fullWidth>
                        Submit Payment
                    </StyledButton>
                </Grid>
            </Grid>
        </form>
    );
};

export default StripeForm;
