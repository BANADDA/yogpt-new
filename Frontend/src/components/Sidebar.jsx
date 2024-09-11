import PropTypes from 'prop-types';
import { useState } from 'react';

const Sidebar = ({ isDarkTheme, Menus }) => {
  const [open, setOpen] = useState(false); // State to manage sidebar open/close

  return (
    <div className={`sidebar ${open ? "w-72" : "w-20"} h-screen p-8 pt-8 relative duration-300 ${isDarkTheme ? "dark:bg-gray-800" : "bg-dark-purple"}`}>
      <img
        src="./static/img/control.png"
        alt="Toggle Sidebar"
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src="./static/img/logo.png"
          alt="Logo"
          className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
        />
        <h1 className={`text-gray-400 origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`} style={{ fontFamily: 'Poppins' }}>
          Echo
        </h1>
      </div>
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <li 
            key={index} 
            className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-4"} ${isDarkTheme ? "hover:bg-gray-700 text-gray-200" : "hover:bg-light-white text-gray-900"} ${index === 0 && (isDarkTheme ? "bg-gray-700" : "bg-light-white")}`}
            style={{ fontFamily: 'Poppins', fontSize: '14px' }}
          >
            <Menu.Icon className="text-xl" />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isDarkTheme: PropTypes.bool.isRequired,
  Menus: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
    gap: PropTypes.bool
  })).isRequired
};

export default Sidebar;
