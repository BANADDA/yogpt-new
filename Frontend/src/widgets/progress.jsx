import PropTypes from 'prop-types';

const CustomLoadingBar = ({ progress, label }) => {
  return (
    <div className="bg-gray-700 p-4 rounded w-full flex flex-col justify-center items-center">
      <div className="text-white mb-2">{label}</div>
      {/* Outer div is now white, representing the unloaded portion */}
      <div className="bg-white w-full rounded-full h-2.5 overflow-hidden">
        {/* Inner div is green, representing the loaded portion. Adjusted className for color */}
        <div
          className="bg-green-500 h-2.5 rounded-full flex justify-end items-center pr-2 text-white text-sm"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};

CustomLoadingBar.propTypes = {
  progress: PropTypes.number.isRequired,
  label: PropTypes.string,
};

export default CustomLoadingBar;
