import { format } from 'date-fns'; // Import for date formatting
import PropTypes from 'prop-types';
import React from 'react';

const FineTuningJobContainer = ({ modelName, modelId, creationDate, jobType, status, onClick }) => {
  // Convert Firestore Timestamp to JavaScript Date object
  const dateObject = creationDate.toDate ? creationDate.toDate() : new Date(creationDate);
  const formattedDate = format(dateObject, 'MMM d, yyyy'); // Format the Date object

  const statusColorClass = status === 'pending' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="p-2 rounded bg-white dark:bg-gray-100 shadow mb-4 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold truncate">{modelName}</h2>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-600">
        <div>
          <p>Model Id: {modelId}</p>
          <p>Job Type: {jobType}</p>
        </div>
        <span className={`${statusColorClass}`}>{status}</span>
      </div>
    </div>
  );
};

// Define the prop types
FineTuningJobContainer.propTypes = {
    modelName: PropTypes.string.isRequired,
    modelId: PropTypes.string.isRequired,
    creationDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.object // Adjust to expect a Firestore Timestamp object
    ]).isRequired,
    jobType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default FineTuningJobContainer;
