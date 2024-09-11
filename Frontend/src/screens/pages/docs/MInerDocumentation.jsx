import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Documentation from '../../../widgets/Documentation';
import { Footer } from '../../../widgets/Footer';
import {Box} from '@mui/material';
const MinerDocumentation = () => {

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', py: 8 }}>  
          <Documentation/>
      </Box>
      <Footer/>
    </>
  );
};

export default MinerDocumentation;
