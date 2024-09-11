import React from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    backgroundColor: 'mediumseagreen',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Poppins',
    '&:hover': {
        backgroundColor: 'seagreen',
    },
}));

const BittensorForm = ({ onSubmit }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            senderId: formData.get('senderId'),
            recipientAddress: formData.get('recipientAddress'),
            amount: formData.get('amount'),
            consent: formData.get('consent')
        };
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                TAO Bittensor Payment
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                TAO Bittensor is a decentralized, open-source protocol that leverages blockchain technology to provide secure and transparent payment options. You can use TAO cryptocurrency to make payments.
                <br />
                <Link href="https://bittensor.com" target="_blank" rel="noopener" style={{ fontFamily: 'Poppins', marginTop: '8px', display: 'block' }}>
                    Learn more about Bittensor
                </Link>
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth name="senderId" label="Sender's ID" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="recipientAddress" label="Recipient's Address" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth name="amount" label="Amount" variant="outlined" required />
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

export default BittensorForm;
