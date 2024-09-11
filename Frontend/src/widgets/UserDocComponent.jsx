import { 
  Edit as EditIcon, 
  Menu as MenuIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

const modelsData = [
  { type: 'GPT-2', models: ['GPT-2', 'GPT-2 Medium', 'GPT-2 Large', 'GPT-2 XL'] },
  { type: 'LLaMA-2', models: ['LLaMA-2 7B', 'LLaMA-2 13B', 'NousResearch LLaMA2'] },
  { type: 'OpenELM', models: ['OpenELM 270M', 'OpenELM 450M', 'OpenELM 3B'] }
];

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'getStarted', title: 'Get Started' },
  { id: 'datasets', title: 'Datasets' },
  { id: 'fineTuning', title: 'Fine-Tuning' },
  { id: 'deploying', title: 'Deploying Models' },
  { id: 'billing', title: 'Billing and Pricing' },
];

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: 'white',
  fontSize: '12px',
  fontFamily: 'Poppins, sans-serif',
  border: '1px solid white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

function UserDocComponent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white', color: 'black', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#1E1E1E',
            fontSize: '10px',
            color: 'white',
            mt: '64px',
          },
        }}
      >
        <Box p={2}>
          <TextField 
            placeholder="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
          />
        </Box>
        <List>
          {filteredSections.map((section) => (
            <ListItem button key={section.id} onClick={() => document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' })}>
              <ListItemText 
                primary={section.title} 
                primaryTypographyProps={{ 
                  sx: { 
                    fontSize: '12px', 
                    fontWeight: 'normal',
                    color: '#fff',
                    fontFamily: 'Poppins',
                  } 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'white' }}>
        <IconButton onClick={toggleDrawer} sx={{ display: { md: 'none' }, mb: 2, color: 'black' }}>
          <MenuIcon />
        </IconButton>

        <Box id="introduction">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '14px' }}>INTRODUCTION</Typography>
            
          </Box>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black' }}>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              YoGPT is a powerful platform designed for fine-tuning large language models, enabling clients to customize GPT models, LLaMA2 models, and OpenELM models. The platform provides an intuitive interface and robust tools for seamless model customization. Users can interact with their customized models via an API, offering flexibility and scalability for various applications.
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              The platform supports models such as <b>GPT-2,LLaMA-2, OpenELM</b>. These models can be fine-tuned on both HuggingFace data and custom datasets for tailored applications.
            </Typography>
          </Paper>
        </Box>

        <Box id="getStarted">
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px', mb: 2 }}>GETTING STARTED</Typography>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black'}}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins', mb: 2, fontSize: '14px',fontWeight:'bold' }}>Installation and Setup</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              To begin, tap on <b>"Create New Job"</b> on the home screen. Fill in the training job form with the necessary details such as model type, dataset, and hyperparameters. Advanced settings are available for configuring training rounds and other parameters for technical users.
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              Once the form is completed, submit it to initiate the fine-tuning process. You can monitor the job status and view results directly on the platform. Detailed instructions and guides are available to help you through each step.
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              For billing details, please refer to our pricing page to understand the costs associated with different operations. This ensures transparency and allows you to plan your projects efficiently.
            </Typography>
          </Paper>
        </Box>

        <Box id="datasets">
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px', mb: 2 }}>DATASETS</Typography>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black' }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins', mb: 2, fontSize: '14px', fontWeight:'bold' }}>Overview</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              This documentation provides guidelines for managing datasets within our software platform, including both System-Defined Datasets and User-Custom Datasets. Understanding these options will enable you to effectively set up and train your models.
            </Typography>
            <Typography variant="h5" gutterBottom id="systemDefined" sx={{ fontFamily: 'Poppins', mb: 2, mt: 4, fontSize: '14px' , fontWeight:'bold'}}>System-Defined Datasets</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              System-Defined Datasets are predefined and publicly accessible datasets provided by the platform. These datasets are selected during the setup of a training job and are tailored to suit various model training requirements. When setting up your job, you will choose from these datasets based on the type of model you intend to train.
            </Typography>
            <Typography variant="h5" gutterBottom id="userCustom" sx={{ fontFamily: 'Poppins', mb: 2, mt: 4, fontSize: '14px', fontWeight:'bold' }}>User-Custom Datasets</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              User-Custom Datasets allow for greater flexibility and personalization in your model training processes. Below are the detailed steps to create and manage your custom datasets.
            </Typography>
            <Typography variant="h6" gutterBottom id="creatingCustom" sx={{ fontFamily: 'Poppins', mb: 2, mt: 4, fontSize: '14px', fontWeight:'bold' }}>Creating a Custom Dataset</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px' }}>
              To create a custom dataset, follow these steps:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', ml: 2 }}>
              <ol>
                <li>
                  <ArrowRightIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /><b>Navigate to the Dataset Page:</b>  Start by accessing the 'Dataset' page on our platform.
                </li>
                <li>
                  <ArrowRightIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Fill in the Dataset Creation Form:</b> You will need to provide specific details about your dataset:
                  <ul>
                    <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Dataset Name:</b> Assign a name to your dataset for easy identification.</li>
                    <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Model Type:</b> Specify the type of model you plan to develop or train with this dataset.</li>
                    <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Visibility Settings:</b> Declare whether the dataset should be public (visible to all users on the platform) or private (visible only to you).</li>
                  </ul>
                </li>
                <li>
                  <ArrowRightIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Upload Your Dataset:</b>
                  <ul>
                    <li><CloudUploadIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Prepare Your Data:</b> Ensure your data is formatted according to our platform’s required template. You can download the template directly from this link (clickable link to the template).</li>
                    <li><CloudUploadIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Upload Method:</b> Drag and drop your CSV or Excel file into the designated area or browse your computer/local storage to select the file.</li>
                  </ul>
                </li>
              </ol>
            </Typography>
            <Typography variant="h6" gutterBottom id="datasetVisibility" sx={{ fontFamily: 'Poppins', mb: 2, mt: 4, fontSize: '14px',fontWeight:'bold' }}>Dataset Visibility</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
              <ul>
                <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Public Datasets:</b> Once declared public, the dataset is accessible to all platform users, fostering collaboration and broader utilization.</li>
                <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> <b>Private Datasets:</b> A private dataset is accessible only to its creator, ensuring data privacy and security.</li>
              </ul>
            </Typography>
            <Typography variant="h6" gutterBottom id="postUpload" sx={{ fontFamily: 'Poppins', mb: 2, mt: 4, fontSize: '14px', fontWeight:'bold' }}>Post-Upload Steps</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
              After uploading your dataset:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', ml: 2 }}>
              <ul>
                <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> The dataset will undergo a validation process to ensure it meets the template and data format standards.</li>
                <li><CheckCircleOutlineIcon sx={{ fontSize: '14px', verticalAlign: 'middle' }} /> Upon successful validation, the dataset becomes available for selection during the training job creation process.</li>
              </ul>
            </Typography>
          </Paper>
        </Box>

        <Box id="fineTuning">
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px', mb: 2 }}>FINE-TUNING</Typography>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black',  }}>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              YoGPT supports fine-tuning of several powerful models, including:
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: 'white',  }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'black', backgroundColor: 'white', fontWeight:'bold'  }}>Model Type</TableCell>
                    <TableCell sx={{ color: 'black', backgroundColor: 'white',fontWeight:'bold'   }}>Models</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelsData.map((model) => (
                    <TableRow key={model.type}>
                      <TableCell sx={{ color: 'black', backgroundColor: 'white', }}>{model.type}</TableCell>
                      <TableCell sx={{ color: 'black', backgroundColor: 'white', }}>{model.models.join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography mt={2} sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
              These models can be fine-tuned using both HuggingFace datasets and custom datasets provided by the user. This ensures that the models are tailored to your specific requirements.
            </Typography>
          </Paper>
        </Box>

        <Box id="deploying">
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px', mb: 2 }}>DEPLOYING MODELS</Typography>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black' }}>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', mb: 2 }}>
              Once your model is fine-tuned, you can deploy it on the YoGPT platform for seamless interaction and integration. The platform provides an easy-to-use API for inference and interaction, allowing you to incorporate the model into your applications. Subscription options for the API are available to suit different needs.
            </Typography>
          </Paper>
        </Box>

        <Box id="billing">
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px', mb: 2 }}>BILLING & PRICING</Typography>
          <Paper sx={{ padding: 3, mb: 4, bgcolor: 'white', color: 'black' }}>
            <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              Pricing for Training Jobs
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              Detailed information about the pricing for training jobs can be found on our pricing page. This includes costs for different model types and the associated fine-tuning time.
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2, mt: 4 }}>
              Pricing for Inference
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 2 }}>
              For information on pricing for inference services, please refer to our detailed pricing section. This will help you understand the costs associated with deploying and utilizing your models.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default UserDocComponent;