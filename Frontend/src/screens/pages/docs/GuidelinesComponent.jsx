import { useEffect, useState } from "react";
import Navbar from '../../../components/Navbar';
import { Footer } from '../../../widgets/Footer';
import UserDocsComponent from "../../../widgets//UserDocComponent";
import {Box} from '@mui/material';
const GuidelinesComponent = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', py: 8 }}>  
          <UserDocsComponent/>
      </Box>
      <Footer/>
    </>
  );
};

export default GuidelinesComponent;
