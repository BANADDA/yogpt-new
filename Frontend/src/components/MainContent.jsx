import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Import an icon for the new card
import { Box, Breadcrumbs, Button, Card, CardContent, Container, Divider, Grid, Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { toast, ToastContainer } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css';
import { auth, signInWithGoogle } from '../auth/config/firebase-config'; // import signInWithGoogle function
import PopUp from '../widgets/LoginPopUp';
import NewPopup from '../widgets/ServicesPopUp';
import FederatedModelCard from './federatedModel';
import FederatedModel from './FederatedModelCard';
import ModelCard from './ModelCard'; // Import the ModelCard component
import ModelDetailsModal from './ModelDetailsModal';

const networks = [
  {
    name: 'Commune',
    description: 'Community-driven AI platform',
    icon: 'https://avatars.githubusercontent.com/u/107713514?v=4',
    comingSoon: false,
  },
  {
    name: 'Federated Learning',
    description: 'Decentralized model training with privacy, powered by Flower.',
    icon: 'https://pypi-camo.freetls.fastly.net/b21aa66f239de63caef75782f1a8d862b126ef3e/68747470733a2f2f666c6f7765722e61692f5f6e6578742f696d6167652f3f75726c3d2532465f6e6578742532467374617469632532466d65646961253246666c6f7765725f77686974655f626f726465722e63323031326537302e706e6726773d36343026713d3735',
    comingSoon: false,
  },
  {
    name: 'Bittensor',
    description: 'Decentralized AI network',
    icon: 'https://bittensor.com/favicon.ico',
    comingSoon: true,
  },
  {
    name: 'Hugging Face',
    description: 'Open-source NLP models',
    icon: 'https://huggingface.co/favicon.ico',
    comingSoon: true,
  },
  {
    name: 'OpenAI',
    description: 'State-of-the-art language models',
    icon: 'https://openai.com/favicon.ico',
    comingSoon: true,
  },
];

const FederatedModels = [
  {
    name: 'GPT2 ',
    id: 'openai-community/gpt2',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '339k',
  },
  {
    name: 'GPT-2 Medium',
    id: 'openai-community/gpt2-medium',
    description: 'Text Generation',
    lastUsed: '5 days ago',
    usageCount: '48.5k',
  },
  {
    name: 'GPT-2 Large',
    id: 'openai-community/gpt2-large',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '17.7k',
  },
  {
    name: 'OpenELM 270M',
    id: 'apple/OpenELM-270M',
    description: 'Text Generation',
    lastUsed: '21 hours ago',
    usageCount: '84.8k',
  },
  {
    name: 'OpenELM 450M',
    id: 'apple/OpenELM-450M',
    description: 'Text Generation',
    lastUsed: '4 days ago',
    usageCount: '3.47k',
  },
  {
    name: 'OpenELM 3B',
    id: 'apple/OpenELM-3B',
    description: 'Text Generation',
    lastUsed: '3 days ago',
    usageCount: '77.8k',
  },
  {
    name: 'NousResearch llama2',
    id: 'NousResearch/Llama-2-7b-chat-hf',
    description: 'Text Generation',
    lastUsed: '5 days ago',
    usageCount: '616',
  },
  {
    name: 'LLaMA-3.1 8B',
    id: 'unsloth/llama-3-8b-bnb-4bit',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '66.1k',
  },
  {
    name: 'Gemini ',
    id: 'google/gemma-2b',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '66.1k',
  },
  // Replacing the last model with a "Submit Your Model" card
  // {
  //   name: 'Submit Your Model',
  //   id: 'submit-your-model',
  //   description: 'Have a model to share? Submit it to us!',
  //   icon: 'add_circle_outline',
  //   link: 'https://forms.gle/your-google-form-link', // Link to the Google Form
  // },
];

const models = [
  {
    name: 'GPT2 ',
    id: 'openai-community/gpt2',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '339k',
  },
  {
    name: 'GPT-2 Medium',
    id: 'openai-community/gpt2-medium',
    description: 'Text Generation',
    lastUsed: '5 days ago',
    usageCount: '48.5k',
  },
  {
    name: 'GPT-2 Large',
    id: 'openai-community/gpt2-large',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '17.7k',
  },
  {
    name: 'OpenELM 270M',
    id: 'apple/OpenELM-270M',
    description: 'Text Generation',
    lastUsed: '21 hours ago',
    usageCount: '84.8k',
  },
  {
    name: 'OpenELM 450M',
    id: 'apple/OpenELM-450M',
    description: 'Text Generation',
    lastUsed: '4 days ago',
    usageCount: '3.47k',
  },
  {
    name: 'OpenELM 3B',
    id: 'apple/OpenELM-3B',
    description: 'Text Generation',
    lastUsed: '3 days ago',
    usageCount: '77.8k',
  },
  {
    name: 'NousResearch llama2',
    id: 'NousResearch/Llama-2-7b-chat-hf',
    description: 'Text Generation',
    lastUsed: '5 days ago',
    usageCount: '616',
  },
  {
    name: 'LLaMA-3.1 8B',
    id: 'unsloth/llama-3-8b-bnb-4bit',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '66.1k',
  },
  {
    name: 'Gemini ',
    id: 'google/gemma-2b',
    description: 'Text Generation',
    lastUsed: '3 hours ago',
    usageCount: '66.1k',
  },
  // Replacing the last model with a "Submit Your Model" card
  {
    name: 'Submit Your Model',
    id: 'submit-your-model',
    description: 'Have a model to share? Submit it to us!',
    icon: 'add_circle_outline',
    link: 'https://forms.gle/your-google-form-link', // Link to the Google Form
  },
];

const MainContent = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [newPopupOpen, setNewPopupOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFederatedModel, setSelectedFederatedModel] = useState(null);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = () => {
    if (user) {
      setNewPopupOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewPopupClose = () => {
    setNewPopupOpen(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCardClick = (network) => {
    const handleSignInAndAction = (action) => {
      if (!user) {
        signInWithGoogle()
          .then((result) => {
            setUser(result);
            action();
          })
          .catch((error) => {
            console.error('Google sign-in error', error);
          });
      } else {
        action();
      }
    };

    if (network.name === 'Commune') {
      handleSignInAndAction(() => navigate('/com'));
    } else if (network.name === 'Federated Learning') {
      handleSignInAndAction(() => setShowModelSelection(true));
    } else if (!network.comingSoon) {
      alert(`${network.name} Selected`);
    }
  };

  const handleFederatedModelCardClick = (model) => {
    console.log('Federated model clicked:', model); // Debugging the click event
    if (model.id === 'submit-your-model') {
      window.open(model.link, '_blank'); // Open the Google Form link in a new tab
    } else if (!user) {
      signInWithGoogle()
        .then((result) => {
          setUser(result);
          setSelectedFederatedModel(model);
        })
        .catch((error) => {
          console.error('Google sign-in error', error);
        });
    } else {
      setSelectedFederatedModel(model);
    }
  };  

  const handleFederatedModalClose = () => {
    setSelectedFederatedModel(null);
  };

  const handleModelCardClick = (model) => {
    if (model.id === 'submit-your-model') {
      window.open(model.link, '_blank'); // Open the Google Form link in a new tab
    } else if (!user) {
      signInWithGoogle()
        .then((result) => {
          setUser(result);
          setSelectedModel(model);
        })
        .catch((error) => {
          console.error('Google sign-in error', error);
        });
    } else {
      setSelectedModel(model);
    }
  };

  const handleModalClose = () => {
    setSelectedModel(null);
  };

  const handleBreadcrumbClick = (breadcrumb) => {
    if (breadcrumb === 'home') {
      setShowModelSelection(false); // Go back to the network selection screen
    }
  }

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(filter.toLowerCase())
  );

  const showToast = () => {
    toast.info('Coming Soon', {
      position: "top-right", // Set position to top-right
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Box
      className="min-h-screen bg-gray-100"
      sx={{
        marginTop: '90px',
        marginBottom: '90px',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      {showModelSelection ? (
        // Model selection screen when Federated Learning is clicked
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
            <Link color="inherit" href="#" onClick={() => handleBreadcrumbClick('home')}>
              Home
            </Link>
            <Typography color="textPrimary">Federated Training</Typography>
          </Breadcrumbs>

          <Typography
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
            style={{ fontSize: '2.5rem', fontWeight: '700' }}
          >
            Federated Fine-Tuning
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            gutterBottom
            sx={{
              fontSize: '1.2rem',
              fontWeight: '400',
              paddingLeft: '30px',
              paddingRight: '30px',
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: '25px',
            }}
          >
            Get started with YoGPT federated fine-tuning, powered by Flower framework. Select a model to fine-tune with decentralized training.
          </Typography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {FederatedModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={model.id}>
                <Box
                  sx={{
                    position: 'relative',
                    filter: model.id !== 'openai-community/gpt2' ? 'brightness(50%)' : 'none', // Apply dark filter for non-GPT2
                    pointerEvents: model.id !== 'openai-community/gpt2' ? 'none' : 'auto', // Disable click for "Coming Soon"
                    '&:hover': {
                      filter: model.id === 'openai-community/gpt2' ? 'none' : 'brightness(50%)', // Keep filter on hover for non-GPT2
                    },
                  }}
                >
                  {/* FederatedModelCard stays as is */}
                  <FederatedModelCard model={model} onClick={() => handleFederatedModelCardClick(model)} />
                  {/* Coming Soon text overlay for non-GPT2 models */}
                  {model.id !== 'openai-community/gpt2' && (
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#333',
                        color: '#FFD700', // Yellow text
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                      }}
                    >
                      Coming Soon
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : (

        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
            style={{ fontSize: '2.0rem', fontWeight: '700' }}
          >
            Fine-Tune Your Own GPT
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}
          >
            Share Your GPU and Earn Tokens
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '20px' }}
          >
            Decentralized GPU Networks
          </Typography>

          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {networks.map((network, index) => (
              <Grid item xs={12} sm={6} md={3} key={network.name}>
                <Card
                  onClick={() => handleCardClick(network)}
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
                    color: '#fff',
                    cursor: network.comingSoon ? 'default' : 'pointer',
                    '&:hover': {
                      transform: network.comingSoon ? 'none' : 'translateY(-5px)',
                      boxShadow: network.comingSoon
                        ? 'none'
                        : '0 6px 12px rgba(0, 0, 0, 0.15)',
                    },
                    filter: network.comingSoon ? 'brightness(50%)' : 'none',
                  }}
                >
                  <CardContent align="center">
                    {network.icon.startsWith('http') ? (
                      <img
                        src={network.icon}
                        alt={network.name}
                        style={{ width: '80px', height: '80px', marginBottom: '10px' }}
                      />
                    ) : (
                      <i className={`${network.icon} fa-6x mb-4`}></i>
                    )}
                    <Typography variant="h5" component="div">
                      {network.name}
                    </Typography>
                    <Typography variant="body2">{network.description}</Typography>
                    {network.comingSoon && (
                      <Typography
                        variant="body2"
                        style={{ color: '#ffd700', marginTop: '5px' }}
                      >
                        Coming Soon
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mt: 6, color: '#280821', borderBottomWidth: 3 }} >
            <Typography
              variant="h1"
              align="center"
              color="textPrimary"
              gutterBottom
              style={{ fontSize: '1.5rem', fontWeight: '700' }}
            >
              Start Your Fine-Tuning Job
            </Typography>
          </Divider>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}
          >
            Choose Your Base Model
          </Typography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {filteredModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={model.id}>
                {model.id === 'submit-your-model' ? (
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(135deg, #6e8efb, #BB89F7)', // Gradient background
                      color: '#fff', // Set text color to white
                      cursor: 'pointer',
                      marginBottom: '15px',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={showToast}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <AddCircleOutlineIcon sx={{ fontSize: 25, color: '#fff', marginBottom: 0 }} />
                        <Typography variant="h8" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {model.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {model.description}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                      <Button
                        variant="outlined"
                        style={{ backgroundColor: '#E8D6FE', borderColor: 'white' }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast();
                        }}
                        sx={{
                          textTransform: 'none',
                          marginBottom: '10px',
                          fontWeight: 'bold',
                          // color: "blueviolet"
                        }}
                      >
                        Submit Model
                      </Button>
                    </Box>
                  </Card>
                ) : (
                  <ModelCard model={model} onClick={() => handleModelCardClick(model)} />
                )}
              </Grid>
            ))}
          </Grid>


        </Container>
      )}
      <ToastContainer />
      <PopUp open={open} onClose={handleClose} />
      <NewPopup open={newPopupOpen} onClose={handleNewPopupClose} />
      {selectedModel && (
        <ModelDetailsModal
          open={!!selectedModel}
          onClose={handleModalClose}
          model={selectedModel}
        />
      )}
      {selectedFederatedModel && (
        <FederatedModel
          open={!!selectedFederatedModel}
          onClose={handleFederatedModalClose}
          model={selectedFederatedModel}
        />
      )}
    </Box>
  );
};

export default MainContent;