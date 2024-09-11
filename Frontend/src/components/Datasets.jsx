import { Dataset } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress, Container, Grid, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { formatDistanceToNow } from 'date-fns';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth } from '../auth/config/firebase-config';
import DatasetCard from '../widgets/DatasetCard';
import DatasetModal from '../widgets/DatasetModal';
import { Footer } from '../widgets/Footer';
import Navbar from './Navbar';

const Datasets = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [allDatasets, setAllDatasets] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChips, setSelectedChips] = useState({
    publicDatasets: false,
    yourDatasets: false,
    GPT: false,
    Llama: false,
    OpenELM: false,
  });
  const [currentFilter, setCurrentFilter] = useState('all');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const datasetsRef = collection(db, 'datasets');
    const q = query(datasetsRef);

    setIsLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedDatasets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllDatasets(loadedDatasets);
      setDatasets(loadedDatasets);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const filteredDatasets = allDatasets.filter(dataset => {
      const visibilityFilter = selectedChips.publicDatasets ? dataset.visibility === 'public' :
        selectedChips.yourDatasets ? dataset.userId === userId : true;
      const modelFilter = selectedChips.GPT ? dataset.model.toLowerCase().includes('gpt') :
        selectedChips.Llama ? dataset.model.toLowerCase().includes('llama') :
          selectedChips.OpenELM ? dataset.model.toLowerCase().includes('openelm') : true;
      const searchFilter = dataset.datasetName.toLowerCase().includes(searchQuery.toLowerCase());

      return visibilityFilter && modelFilter && searchFilter;
    });

    setDatasets(filteredDatasets);
  }, [selectedChips, searchQuery, allDatasets, userId]);

  const handleChipToggle = (chip) => {
    setSelectedChips(prev => ({
      ...prev,
      [chip]: !prev[chip],
    }));
  };

  useEffect(() => {
    let filteredDatasets = allDatasets;

    if (currentFilter === 'public') {
      filteredDatasets = allDatasets.filter(dataset => dataset.visibility === 'public');
    } else if (currentFilter === 'your') {
      filteredDatasets = allDatasets.filter(dataset => dataset.userId === userId);
    }

    setDatasets(filteredDatasets);
  }, [currentFilter, allDatasets, userId]);


  return (
    <>
      <Navbar />
      <Box
        className="min-h-screen bg-gray-100"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 0.1, mb: 4 }}>
          <Toolbar />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Datasets
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Explore, analyze, and share quality data. Learn more about data types, creating, and collaborating.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#a777e3' }}
              startIcon={<Dataset />}
              onClick={() => setModalOpen(true)}
            >
              Add New Dataset
            </Button>
            <DatasetModal open={modalOpen} onClose={() => setModalOpen(false)} />
          </Box>
          <TextField
            fullWidth
            placeholder="Search datasets"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap:1, mt: 2, mb: 4 }}>
            <Chip
              label="All Datasets"
              variant={currentFilter === 'all' ? "filled" : "outlined"}
              onClick={() => setCurrentFilter('all')}
              sx={{ backgroundColor: currentFilter === 'all' ? '#a777e3' : 'transparent', color: currentFilter === 'all' ? 'white' : 'inherit' }}
            />
            <Chip
              label="Public Datasets"
              variant={currentFilter === 'public' ? "filled" : "outlined"}
              onClick={() => setCurrentFilter('public')}
              sx={{ backgroundColor: currentFilter === 'public' ? '#a777e3' : 'transparent', color: currentFilter === 'public' ? 'white' : 'inherit' }}
            />
            <Chip
              label="Your Datasets"
              variant={currentFilter === 'your' ? "filled" : "outlined"}
              onClick={() => setCurrentFilter('your')}
              sx={{ backgroundColor: currentFilter === 'your' ? '#a777e3' : 'transparent', color: currentFilter === 'your' ? 'white' : 'inherit' }}
            />
          </Box>{isLoading ? (
            <CircularProgress size={60} />
          ) : (
            <Grid container spacing={0.05}>
              {datasets.map((dataset, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
                  <DatasetCard
                    repositoryName={dataset.datasetName}
                    datasetId={dataset.repoId}
                    model={dataset.models}
                    tags={['LLMs', 'Text Generation']}
                    lastUpdated={formatDistanceToNow(new Date(dataset.uploadedAt), { addSuffix: true })}
                    visibility={dataset.visibility}
                    likes={dataset.likes}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Datasets;
