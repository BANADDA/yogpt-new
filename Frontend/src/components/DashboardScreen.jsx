import {
  AddCircleOutlineRounded,
  Close,
  MoreVert,
  PlayArrowRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, firestore } from "../auth/config/firebase-config";
import { Footer } from "../widgets/Footer";
import Navbar from "./Navbar";

const statuses = {
  completed: { color: "black", text: "Completed", icon: "🟢" },
  running: { color: "black", text: "Running", icon: "🟡" },
  stopped: { color: "black", text: "Stopped", icon: "🔴" },
  pending: { color: "black", text: "Pending", icon: "🟠" },
  default: { color: "red", text: "Unknown", icon: "🔴" },
};

const modelDatasets = {
  "openai-community/gpt2": [
    "iohadrubin/wikitext-103-raw-v1",
    "carlosejimenez/wikitext__wikitext-2-raw-v1",
  ],
  "openai-community/gpt2-medium": [
    "iohadrubin/wikitext-103-raw-v1",
    "carlosejimenez/wikitext__wikitext-2-raw-v1",
  ],
  "openai-community/gpt2-large": [
    "iohadrubin/wikitext-103-raw-v1",
    "carlosejimenez/wikitext__wikitext-2-raw-v1",
  ],
  "openai-community/gpt2-xl": [
    "iohadrubin/wikitext-103-raw-v1",
    "carlosejimenez/wikitext__wikitext-2-raw-v1",
  ],
  "openlm-research/open_llama_7b_v2": ["mlabonne/guanaco-llama2-1k"],
  "openlm-research/open_llama_13b": ["mlabonne/guanaco-llama2-1k"],
  "NousResearch/Llama-2-7b-chat-hf": ["mlabonne/guanaco-llama2-1k"],
  "apple/OpenELM-270M": ["g-ronimo/oasst2_top4k_en"],
  "apple/OpenELM-450M": ["g-ronimo/oasst2_top4k_en"],
  "apple/OpenELM-3B": ["g-ronimo/oasst2_top4k_en"],
};

const DeployList = () => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    name: "",
    email: "",
    photoURL: "",
  });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelGroupFilter, setModelGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const updatedUser = {
          isAuthenticated: true,
          name: user.displayName || "No Name",
          email: user.email,
          photoURL: user.photoURL || "path/to/default/image.png",
        };
        setUser(updatedUser);

        // Fetch jobs based on the logged-in user
        const q = query(
          collection(firestore, "fine_tuning_jobs"),
          where("userId", "==", user.uid)
        );
        const unsubscribeJobs = onSnapshot(q, (snapshot) => {
          const jobsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJobs(jobsData);
          setFilteredJobs(jobsData);
        });

        return () => unsubscribeJobs();
      } else {
        setUser({
          isAuthenticated: false,
          name: "",
          email: "",
          photoURL: "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, modelGroupFilter, statusFilter, dateFilter, jobs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModelGroupFilterChange = (event) => {
    setModelGroupFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.baseModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.huggingFaceId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (modelGroupFilter !== "all") {
      filtered = filtered.filter((job) =>
        job.baseModel.toLowerCase().includes(modelGroupFilter.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.createdAt.seconds * 1000);
        const filterDate = new Date(dateFilter);
        return jobDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredJobs(filtered);
  };

  const handleRowClick = (job) => {
    console.log("Job ID:", job.id);
    setSelectedJob(job);
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleDeleteJob = async () => {
    try {
      await deleteDoc(doc(firestore, "fine_tuning_jobs", selectedJob.id));
      toast.success("Job deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete job.");
      console.error("Error deleting job:", error);
    }
    handleMenuClose();
  };

  const handleStopResumeTraining = async () => {
    try {
      const newStatus =
        selectedJob.status === "stopped" ? "pending" : "stopped";
      await updateDoc(doc(firestore, "fine_tuning_jobs", selectedJob.id), {
        status: newStatus,
      });
      toast.success(
        `Job ${newStatus === "stopped" ? "stopped" : "resumed"} successfully.`
      );
    } catch (error) {
      toast.error(
        `Failed to ${selectedJob.status === "stopped" ? "resume" : "stop"} job.`
      );
      console.error(
        `Error ${selectedJob.status === "stopped" ? "resuming" : "stopping"} job:`,
        error
      );
    }
    handleMenuClose();
  };

  const handleEditJob = () => {
    if (selectedJob.status === "completed") {
      toast.error("Can't edit a completed job.");
      handleMenuClose();
    } else {
      setEditModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = async (updatedJob) => {
    try {
      await updateDoc(
        doc(firestore, "fine_tuning_jobs", selectedJob.id),
        updatedJob
      );
      toast.success("Job updated successfully.");
    } catch (error) {
      toast.error("Failed to update job.");
      console.error("Error updating job:", error);
    }
    setEditModalOpen(false);
  };

  const navigate = useNavigate();

  const handleCreateNewJob = () => {
    navigate('/');
    console.log("Creating new training job");
  };

  const models = [
    {
      name: 'GPT2 ',
      id: 'openai-community/gpt2',
      description: 'Text Generation',
      lastUsed: '3 hours ago',
      usageCount: '339k'
    },
    {
      name: 'GPT-2 Medium',
      id: 'openai-community/gpt2-medium',
      description: 'Text Generation',
      lastUsed: '5 days ago',
      usageCount: '48.5k'
    },
    {
      name: 'GPT-2 Large',
      id: 'openai-community/gpt2-large',
      description: 'Text Generation',
      lastUsed: '3 hours ago',
      usageCount: '17.7k'
    },
    {
      name: 'LLaMA-2 7B',
      id: 'openlm-research/open_llama_7b_v2',
      description: 'Text Generation',
      lastUsed: '3 hours ago',
      usageCount: '66.1k'
    },
    {
      name: 'LLaMA-2 13B',
      id: 'openlm-research/open_llama_13b',
      description: 'Text Generation',
      lastUsed: '17 days ago',
      usageCount: '121k'
    },
    {
      name: 'NousResearch llama2',
      id: 'NousResearch/Llama-2-7b-chat-hf',
      description: 'Text Generation',
      lastUsed: '5 days ago',
      usageCount: '616'
    },
    {
      name: 'OpenELM 270M',
      id: 'apple/OpenELM-270M',
      description: 'Text Generation',
      lastUsed: '21 hours ago',
      usageCount: '84.8k'
    },
    {
      name: 'OpenELM 450M',
      id: 'apple/OpenELM-450M',
      description: 'Text Generation',
      lastUsed: '4 days ago',
      usageCount: '3.47k'
    },
    {
      name: 'OpenELM 3B',
      id: 'apple/OpenELM-3B',
      description: 'Text Generation',
      lastUsed: '3 days ago',
      usageCount: '77.8k'
    },
  ];

  return (
    <>
      <Navbar />
      <Box
        sx={{
          marginTop: "90px",
          marginBottom: "90px",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Training Jobs
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  Training jobs generated by {user.name}
                </Typography>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#a777e3' }}
                  startIcon={<AddCircleOutlineRounded />}
                  onClick={handleCreateNewJob}
                >
                  Create New Training Job
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel>All Jobs</InputLabel>
                    <Select
                      label="All Jobs"
                      value={modelGroupFilter}
                      onChange={handleModelGroupFilterChange}
                    >
                      <MenuItem value="all">All Jobs</MenuItem>
                      <MenuItem value="gpt">GPT Models</MenuItem>
                      <MenuItem value="llama">Llama Models</MenuItem>
                      <MenuItem value="openelm">OpenElm Models</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    type="date"
                    size="small"
                    fullWidth
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="running">Running</MenuItem>
                      <MenuItem value="stopped">Stopped</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {filteredJobs.length === 0 ? (
            <Card
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                No Training Jobs Available
              </Typography>
              <img
                src="images/setting.png"
                alt="No Jobs"
                style={{ width: "150px", height: "150px", margin: "20px 0" }}
              />
              <Button
                variant="contained"
                style={{ backgroundColor: '#a777e3' }}
                startIcon={<AddCircleOutlineRounded />}
                onClick={handleCreateNewJob}
              >
                Create New Training Job
              </Button>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #6e8efb, #a777e3)" }}>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Job ID
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Model ID
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Model Description
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Dataset ID
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Running Time
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow
                      key={job.id}
                      sx={{ fontWeight: "normal", cursor: "pointer" }}
                      onClick={() => handleRowClick(job)}
                    >
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.baseModel}</TableCell>
                      <TableCell>{job.domain}</TableCell>
                      <TableCell>{job.huggingFaceId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="body2"
                            sx={{
                              marginRight: 1,
                              fontSize:'14px',
                              color: statuses[job.status] ? statuses[job.status].color : "gray",
                            }}
                          >
                            {statuses[job.status] ? statuses[job.status].icon: "🔴"} {statuses[job.status] ? statuses[job.status].text : "Failed"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" sx={{ marginRight: 1 }}>
                            {new Date(
                              job.createdAt.seconds * 1000
                            ).toLocaleString()}{" "}
                            by {user.name}
                          </Typography>
                          <Avatar
                            src={user.photoURL}
                            alt={user.name}
                            sx={{ width: 24, height: 24 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleMenuOpen(event, job)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDeleteJob}>
          <Typography color="red">Delete</Typography>
        </MenuItem>
        <MenuItem onClick={handleStopResumeTraining}>
          {selectedJob?.status === "stopped"
            ? "Resume Training"
            : "Stop Training"}
        </MenuItem>
        <MenuItem onClick={handleEditJob}>Edit</MenuItem>
      </Menu>
      {selectedJob && (
        <EditJobModal
          open={editModalOpen}
          onClose={handleEditModalClose}
          job={selectedJob}
          onSave={handleEditSave}
        />
      )}
      <Footer />
      <ToastContainer />
    </>
  );
};

const EditJobModal = ({ open, onClose, job, onSave }) => {
  const [selectedDataset, setSelectedDataset] = useState(job.huggingFaceId);
  const [batchSize, setBatchSize] = useState(job.batchSize);
  const [learningRate, setLearningRate] = useState(job.learningRateMultiplier);
  const [epochs, setEpochs] = useState(job.numberOfEpochs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedDataset(job.huggingFaceId);
    setBatchSize(job.batchSize);
    setLearningRate(job.learningRateMultiplier);
    setEpochs(job.numberOfEpochs);
  }, [job]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const handleBatchSizeChange = (event, newValue) => {
    setBatchSize(newValue);
  };

  const handleLearningRateChange = (event, newValue) => {
    setLearningRate(newValue);
  };

  const handleEpochsChange = (event, newValue) => {
    setEpochs(newValue);
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedJob = {
      huggingFaceId: selectedDataset,
      batchSize,
      learningRateMultiplier: learningRate,
      numberOfEpochs: epochs,
    };

    try {
      await onSave(updatedJob);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error("Error saving job:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6">Edit Job - {job.id}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Model: {job.baseModel}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            select
            label="HuggingFace Dataset ID"
            fullWidth
            margin="normal"
            value={selectedDataset}
            onChange={handleDatasetChange}
          >
            <MenuItem value="">Select a dataset</MenuItem>
            {modelDatasets[job.baseModel]?.map((dataset) => (
              <MenuItem key={dataset} value={dataset}>
                {dataset}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Batch size</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Slider
                value={batchSize}
                onChange={handleBatchSizeChange}
                aria-labelledby="batch-size-slider"
                min={1}
                max={128}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Learning rate multiplier</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Slider
                value={learningRate}
                onChange={handleLearningRateChange}
                aria-labelledby="learning-rate-slider"
                min={0.1}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Number of epochs</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Slider
                value={epochs}
                onChange={handleEpochsChange}
                aria-labelledby="epochs-slider"
                min={1}
                max={10}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                loading ? <CircularProgress size={24} /> : <PlayArrowRounded />
              }
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeployList;


// import { AddCircleOutlineRounded, Close, MoreVert, PlayArrowRounded } from '@mui/icons-material';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Divider,
//   FormControl,
//   Grid,
//   IconButton,
//   InputLabel,
//   Menu,
//   MenuItem,
//   Modal,
//   Paper,
//   Select,
//   Slider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography
// } from '@mui/material';
// import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { auth, firestore } from '../auth/config/firebase-config';
// import { Footer } from '../widgets/Footer';
// import Navbar from './Navbar';

// const statuses = {
//   completed: { color: 'black', text: 'Completed', icon: '🟢' },
//   running: { color: 'black', text: 'Running', icon: '🟡' },
//   stopped: { color: 'black', text: 'Stopped', icon: '🔴' },
//   pending: { color: 'black', text: 'Pending', icon: '🟠' }
// };

// const modelDatasets = {
//   "openai-community/gpt2": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
//   "openai-community/gpt2-medium": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
//   "openai-community/gpt2-large": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
//   "openai-community/gpt2-xl": ["iohadrubin/wikitext-103-raw-v1", "carlosejimenez/wikitext__wikitext-2-raw-v1"],
//   "openlm-research/open_llama_7b_v2": ["mlabonne/guanaco-llama2-1k"],
//   "openlm-research/open_llama_13b": ["mlabonne/guanaco-llama2-1k"],
//   "NousResearch/Llama-2-7b-chat-hf": ["mlabonne/guanaco-llama2-1k"],
//   "apple/OpenELM-270M": ["g-ronimo/oasst2_top4k_en"],
//   "apple/OpenELM-450M": ["g-ronimo/oasst2_top4k_en"],
//   "apple/OpenELM-3B": ["g-ronimo/oasst2_top4k_en"]
// };

// const DeployList = () => {
//   const [user, setUser] = useState({
//     isAuthenticated: false,
//     name: '',
//     email: '',
//     photoURL: ''
//   });
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [modelGroupFilter, setModelGroupFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('');
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         const updatedUser = {
//           isAuthenticated: true,
//           name: user.displayName || 'No Name',
//           email: user.email,
//           photoURL: user.photoURL || 'path/to/default/image.png'
//         };
//         setUser(updatedUser);

//         // Fetch jobs based on the logged-in user
//         const q = query(collection(firestore, 'fine_tuning_jobs'), where('userId', '==', user.uid));
//         const unsubscribeJobs = onSnapshot(q, (snapshot) => {
//           const jobsData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//           setJobs(jobsData);
//           setFilteredJobs(jobsData);
//         });

//         return () => unsubscribeJobs();
//       } else {
//         setUser({
//           isAuthenticated: false,
//           name: '',
//           email: '',
//           photoURL: ''
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     filterJobs();
//   }, [searchQuery, modelGroupFilter, statusFilter, dateFilter, jobs]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleModelGroupFilterChange = (event) => {
//     setModelGroupFilter(event.target.value);
//   };

//   const handleStatusFilterChange = (event) => {
//     setStatusFilter(event.target.value);
//   };

//   const handleDateFilterChange = (event) => {
//     setDateFilter(event.target.value);
//   };

//   const filterJobs = () => {
//     let filtered = jobs;

//     if (searchQuery) {
//       filtered = filtered.filter(job =>
//         job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         job.baseModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         job.huggingFaceId.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (modelGroupFilter !== 'all') {
//       filtered = filtered.filter(job =>
//         job.baseModel.toLowerCase().includes(modelGroupFilter.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(job => job.status === statusFilter);
//     }

//     if (dateFilter) {
//       filtered = filtered.filter(job => {
//         const jobDate = new Date(job.createdAt.seconds * 1000);
//         const filterDate = new Date(dateFilter);
//         return jobDate.toDateString() === filterDate.toDateString();
//       });
//     }

//     setFilteredJobs(filtered);
//   };

//   const handleRowClick = (job) => {
//     console.log("Job ID:", job.id);
//     setSelectedJob(job);
//   };

//   const handleMenuOpen = (event, job) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedJob(job);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedJob(null);
//   };

//   const handleDeleteJob = async () => {
//     try {
//       await deleteDoc(doc(firestore, 'fine_tuning_jobs', selectedJob.id));
//       toast.success("Job deleted successfully.");
//     } catch (error) {
//       toast.error("Failed to delete job.");
//       console.error("Error deleting job:", error);
//     }
//     handleMenuClose();
//   };

//   const handleStopResumeTraining = async () => {
//     try {
//       const newStatus = selectedJob.status === 'stopped' ? 'pending' : 'stopped';
//       await updateDoc(doc(firestore, 'fine_tuning_jobs', selectedJob.id), { status: newStatus });
//       toast.success(`Job ${newStatus === 'stopped' ? 'stopped' : 'resumed'} successfully.`);
//     } catch (error) {
//       toast.error(`Failed to ${selectedJob.status === 'stopped' ? 'resume' : 'stop'} job.`);
//       console.error(`Error ${selectedJob.status === 'stopped' ? 'resuming' : 'stopping'} job:`, error);
//     }
//     handleMenuClose();
//   };

//   const handleEditJob = () => {
//     if (selectedJob.status === 'completed') {
//       toast.error("Can't edit a completed job.");
//       handleMenuClose();
//     } else {
//       setEditModalOpen(true);
//     }
//   };

//   const handleEditModalClose = () => {
//     setEditModalOpen(false);
//   };

//   const handleEditSave = async (updatedJob) => {
//     try {
//       await updateDoc(doc(firestore, 'fine_tuning_jobs', selectedJob.id), updatedJob);
//       toast.success("Job updated successfully.");
//     } catch (error) {
//       toast.error("Failed to update job.");
//       console.error("Error updating job:", error);
//     }
//     setEditModalOpen(false);
//   };

//   const handleCreateNewJob = () => {
//     // Handler to perform actions when the "Create New Training Job" button is clicked
//     console.log("Creating new training job");
//     // You might navigate to a job creation form or open a modal here
//   }

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ marginTop: "90px", marginBottom: "90px", minHeight: '80vh', display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column', backgroundColor: '#f0f2f5' }}>
//         <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//           <Card>
//             <CardContent>
//               <Typography variant="h4" gutterBottom>
//                 Training Jobs
//               </Typography>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                   Training jobs generated by {user.name}
//                 </Typography>
//                 <Button variant="contained" color="primary" startIcon={<AddCircleOutlineRounded />} onClick={handleCreateNewJob}>
//                   Create New Training Job
//                 </Button>
//               </Box>
//               <Divider sx={{ my: 2 }} />
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={12} sm={3}>
//                   <TextField
//                     variant="outlined"
//                     placeholder="Search..."
//                     size="small"
//                     fullWidth
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <FormControl variant="outlined" size="small" fullWidth>
//                     <InputLabel>All Jobs</InputLabel>
//                     <Select label="All Jobs" value={modelGroupFilter} onChange={handleModelGroupFilterChange}>
//                       <MenuItem value="all">All Jobs</MenuItem>
//                       <MenuItem value="gpt">GPT Models</MenuItem>
//                       <MenuItem value="llama">Llama Models</MenuItem>
//                       <MenuItem value="openelm">OpenElm Models</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <TextField
//                     variant="outlined"
//                     type="date"
//                     size="small"
//                     fullWidth
//                     value={dateFilter}
//                     onChange={handleDateFilterChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <FormControl variant="outlined" size="small" fullWidth>
//                     <InputLabel>Status</InputLabel>
//                     <Select label="Status" value={statusFilter} onChange={handleStatusFilterChange}>
//                       <MenuItem value="all">All</MenuItem>
//                       <MenuItem value="completed">Completed</MenuItem>
//                       <MenuItem value="running">Running</MenuItem>
//                       <MenuItem value="stopped">Stopped</MenuItem>
//                       <MenuItem value="pending">Pending</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//           <TableContainer component={Paper} sx={{ mt: 2 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Job ID</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Model ID</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Model Description</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Dataset ID</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Running Time</TableCell>
//                   <TableCell sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredJobs.map((job) => (
//                   <TableRow key={job.id} sx={{ fontWeight: 'medium', cursor: 'pointer' }} onClick={() => handleRowClick(job)}>
//                     <TableCell>{job.id}</TableCell>
//                     <TableCell>{job.baseModel}</TableCell>
//                     <TableCell>{job.domain}</TableCell>
//                     <TableCell>{job.huggingFaceId}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="body2" sx={{ marginRight: 1, color: statuses[job.status].color }}>
//                           {statuses[job.status].icon} {statuses[job.status].text}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="body2" sx={{ marginRight: 1 }}>
//                           {new Date(job.createdAt.seconds * 1000).toLocaleString()} by {user.name}
//                         </Typography>
//                         <Avatar src={user.photoURL} alt={user.name} sx={{ width: 24, height: 24 }} />
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <IconButton onClick={(event) => handleMenuOpen(event, job)}>
//                         <MoreVert />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Container>
//       </Box>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDeleteJob}>
//           <Typography color="red">Delete</Typography>
//         </MenuItem>
//         <MenuItem onClick={handleStopResumeTraining}>
//           {selectedJob?.status === 'stopped' ? 'Resume Training' : 'Stop Training'}
//         </MenuItem>
//         <MenuItem onClick={handleEditJob}>
//           Edit
//         </MenuItem>
//       </Menu>
//       {selectedJob && (
//         <EditJobModal
//           open={editModalOpen}
//           onClose={handleEditModalClose}
//           job={selectedJob}
//           onSave={handleEditSave}
//         />
//       )}
//       <Footer />
//       <ToastContainer />
//     </>
//   );
// };

// const EditJobModal = ({ open, onClose, job, onSave }) => {
//   const [selectedDataset, setSelectedDataset] = useState(job.huggingFaceId);
//   const [batchSize, setBatchSize] = useState(job.batchSize);
//   const [learningRate, setLearningRate] = useState(job.learningRateMultiplier);
//   const [epochs, setEpochs] = useState(job.numberOfEpochs);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setSelectedDataset(job.huggingFaceId);
//     setBatchSize(job.batchSize);
//     setLearningRate(job.learningRateMultiplier);
//     setEpochs(job.numberOfEpochs);
//   }, [job]);

//   const handleDatasetChange = (event) => {
//     setSelectedDataset(event.target.value);
//   };

//   const handleBatchSizeChange = (event, newValue) => {
//     setBatchSize(newValue);
//   };

//   const handleLearningRateChange = (event, newValue) => {
//     setLearningRate(newValue);
//   };

//   const handleEpochsChange = (event, newValue) => {
//     setEpochs(newValue);
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     const updatedJob = {
//       huggingFaceId: selectedDataset,
//       batchSize,
//       learningRateMultiplier: learningRate,
//       numberOfEpochs: epochs
//     };

//     try {
//       await onSave(updatedJob);
//       setLoading(false);
//       onClose();
//     } catch (error) {
//       setLoading(false);
//       console.error("Error saving job:", error);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '50%',
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6">Edit Job - {job.id}</Typography>
//           <IconButton onClick={onClose}>
//             <Close />
//           </IconButton>
//         </Box>
//         <Typography variant="subtitle1" gutterBottom>
//           Model: {job.baseModel}
//         </Typography>
//         <Box sx={{ mt: 2 }}>
//           <TextField
//             select
//             label="HuggingFace Dataset ID"
//             fullWidth
//             margin="normal"
//             value={selectedDataset}
//             onChange={handleDatasetChange}
//           >
//             <MenuItem value="">Select a dataset</MenuItem>
//             {modelDatasets[job.baseModel]?.map((dataset) => (
//               <MenuItem key={dataset} value={dataset}>
//                 {dataset}
//               </MenuItem>
//             ))}
//           </TextField>
//           <Box sx={{ mt: 2 }}>
//             <Typography gutterBottom>Batch size</Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Slider
//                 value={batchSize}
//                 onChange={handleBatchSizeChange}
//                 aria-labelledby="batch-size-slider"
//                 min={1}
//                 max={128}
//                 valueLabelDisplay="auto"
//                 sx={{ flexGrow: 1 }}
//               />
//             </Box>
//           </Box>
//           <Box sx={{ mt: 2 }}>
//             <Typography gutterBottom>Learning rate multiplier</Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Slider
//                 value={learningRate}
//                 onChange={handleLearningRateChange}
//                 aria-labelledby="learning-rate-slider"
//                 min={0.1}
//                 max={10}
//                 step={0.1}
//                 valueLabelDisplay="auto"
//                 sx={{ flexGrow: 1 }}
//               />
//             </Box>
//           </Box>
//           <Box sx={{ mt: 2 }}>
//             <Typography gutterBottom>Number of epochs</Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Slider
//                 value={epochs}
//                 onChange={handleEpochsChange}
//                 aria-labelledby="epochs-slider"
//                 min={1}
//                 max={10}
//                 valueLabelDisplay="auto"
//                 sx={{ flexGrow: 1 }}
//               />
//             </Box>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//             <Button variant="outlined" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={loading ? <CircularProgress size={24} /> : <PlayArrowRounded />}
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default DeployList;
