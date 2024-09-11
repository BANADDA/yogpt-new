import { MoreVert } from '@mui/icons-material';
import {
    Box, Button, Checkbox, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { auth, db } from '../auth/config/firebase-config';

const StatusIcon = ({ status }) => {
    const statusStyles = {
      completed: { color: 'green', text: 'Completed', icon: '🟢' },
      running: { color: 'orange', text: 'Running', icon: '🟡' },
      stopped: { color: 'red', text: 'Stopped', icon: '🔴' },
    };
  
    const currentStatus = statusStyles[status] || statusStyles['completed'];
  
    return (
      <Box display="flex" alignItems="center">
        <Box component="span" sx={{ color: currentStatus.color, marginRight: 1 }}>
          {currentStatus.icon}
        </Box>
        <Typography variant="body2" component="span" sx={{ color: currentStatus.color }}>
          {currentStatus.text}
        </Typography>
      </Box>
    );
  };

const RecentFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [recentFilesData, setRecentFilesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        const jobExecutionsQuery = query(collection(db, 'job_executions'), where('minerId', '==', user.uid));
        const jobExecutionsSnapshot = await getDocs(jobExecutionsQuery);

        const recentFiles = await Promise.all(jobExecutionsSnapshot.docs.map(async (jobExecutionDoc) => {
          const jobExecutionData = jobExecutionDoc.data();
          const { jobId, startDate, status } = jobExecutionData;

          const fineTuningJobDoc = await getDoc(doc(db, 'fine_tuning_jobs', jobId));
          const fineTuningJobData = fineTuningJobDoc.exists() ? fineTuningJobDoc.data() : {};

          const completedJobQuery = query(collection(db, 'completed_jobs'), where('jobId', '==', jobId));
          const completedJobSnapshot = await getDocs(completedJobQuery);
          const completedJobData = !completedJobSnapshot.empty ? completedJobSnapshot.docs[0].data() : {};

          return {
            name: fineTuningJobData.baseModel || 'N/A',
            uploaded: startDate.toDate().toLocaleString(),
            duration: completedJobData.totalPipelineTime || 'N/A',
            status: status || 'running',
            token: completedJobData.accuracy || 'N/A',
          };
        }));

        setRecentFilesData(recentFiles);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleSelectFile = (file) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(file)
        ? prevSelected.filter((f) => f !== file)
        : [...prevSelected, file]
    );
  };

  const handleSelectAllFiles = (event) => {
    if (event.target.checked) {
      setSelectedFiles(recentFilesData.map((file) => file.name));
    } else {
      setSelectedFiles([]);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Recent Jobs
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaDollarSign />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#006400'
            }}
          >
            CASH-OUT
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedFiles.length > 0 && selectedFiles.length < recentFilesData.length}
                    checked={selectedFiles.length === recentFilesData.length}
                    onChange={handleSelectAllFiles}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Model ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tokens Generated</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentFilesData.map((file, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => handleSelectFile(file.name)}
                    />
                  </TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.uploaded}</TableCell>
                  <TableCell>{file.duration}</TableCell>
                  <TableCell>
                    <StatusIcon status={file.status} />
                  </TableCell>
                  <TableCell>{file.token} Credits</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {recentFilesData.length === 0 && (
            <Box mt={2} p={2} sx={{ backgroundColor: '#FEDBDB', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                No jobs have been taken up by the miner.
              </Typography>
            </Box>
          )}
        </TableContainer>
        {selectedFiles.length > 0 && (
          <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <img src="/path/to/bulk/actions/icon.png" alt="Bulk Actions Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
              Bulk Actions
            </Typography>
            <Typography variant="body2" component="div">
              Select multiple files to manage them in bulk.
            </Typography>
            <Box display="flex" mt={2}>
              <Button variant="contained" startIcon={<img src="/path/to/export/icon.png" alt="Export Icon" style={{ width: 24, height: 24 }} />} sx={{ textTransform: 'none', marginRight: 2 }}>
                EXPORT
              </Button>
              <Button variant="contained" color="error" startIcon={<img src="/path/to/delete/icon.png" alt="Delete Icon" style={{ width: 24, height: 24 }} />} sx={{ textTransform: 'none' }}>
                DELETE
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RecentFiles;
