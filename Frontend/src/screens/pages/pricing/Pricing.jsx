import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import PricingContent from '../../../components/PricingContent';
import { Footer } from '../../../widgets/Footer';
import {Box} from '@mui/material';
const Pricing = () => {

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', py: 8 }}>  
          <PricingContent/>
       
      </Box>
      <Footer/>
    </>
  );
};

export default Pricing;
