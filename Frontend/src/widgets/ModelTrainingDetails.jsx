import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ModelTrainingDetails = ({ job }) => {
    const data = [
        { epoch: '1', Loss: 0.4, Accuracy: 0.85 },
        { epoch: '2', Loss: 0.35, Accuracy: 0.89 },
        { epoch: '3', Loss: 0.30, Accuracy: 0.92 },
        // Add more epochs as needed
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'running': return 'primary';
            case 'completed': return 'success';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
            <h3 className="text-lg font-bold">Selected Job Details</h3>
            <div className="flex justify-between items-center">
                <div>
                    <p>Model Name: {job.suffix}</p>
                    <p>Model ID: {job.modelId}</p>
                    <p>Job Type: {job.jobType}</p>
                    <Chip label={job.status} color={getStatusColor(job.status)} />
                </div>
                <CircularProgress variant="determinate" value={job.progress} size={60} />
                <p>{job.progress}%</p>
            </div>
            <div>
                <h4>Training Metrics</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epoch" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Loss" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Accuracy" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ModelTrainingDetails;
