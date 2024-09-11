import PropTypes from 'prop-types'; // Import PropTypes
import { FaExclamationTriangle } from 'react-icons/fa';

const Alert = ({ currentTitle, onClose }) => {

  return (
    <div role="alert" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div role="alert">
        <div className="bg-red-500 text-white text-lg font-bold rounded-t px-4 py-2 flex items-center gap-2">
          {/* Alert icon added here */}
          <FaExclamationTriangle className="text-xl" />
          {/* <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg> */}
          Oops
        </div>
        <div className="border border-t-0 bg-white px-4 py-3 text-black flex-wrap">
          <p className="font-semibold">{currentTitle} under development. The feature will be available soon</p>
          <button onClick={onClose} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Define prop types for Alert
Alert.propTypes = {
  currentTitle: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Alert;
