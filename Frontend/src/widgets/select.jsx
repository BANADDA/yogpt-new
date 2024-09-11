import PropTypes from "prop-types";
import { useState } from "react";

const CustomSelect = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <select
      value={selectedOption}
      onChange={handleOptionChange}
      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    >
      <option value="">Select hardware</option>
      {options.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} {option.price ? `(${option.price})` : ""}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          price: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomSelect;
