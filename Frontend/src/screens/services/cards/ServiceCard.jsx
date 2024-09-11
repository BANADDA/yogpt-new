import { Card, Typography } from "@material-tailwind/react";
import React from 'react';
import { useNavigate } from "react-router-dom";

export const ServiceCard = ({ title, icon, details, primaryAction, secondaryAction, poweredByText, isComingSoon, primaryRoute, secondaryRoute }) => {
    const navigate = useNavigate();

    // Function to handle primary button press
    const handlePrimaryAction = () => {
        // Add logic to navigate to the desired route
        navigate(`${primaryRoute}`);
    };

    // Function to handle secondary button press
    const handleSecondaryAction = () => {
        // Add logic to navigate to the desired route
        navigate(`${secondaryRoute}`);
    };
    // Function to determine background color based on the poweredByText
    const getBackgroundColor = (poweredByText) => {
        if (poweredByText.includes("bit tensor")) {
            return "bg-green-700"; // Green background for bit tensor
        } else if (poweredByText.includes("commune")) {
            return "bg-blue-500"; // Blue background for commune
        } else {
            return "bg-gray-400"; // Default background color
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white overflow-hidden transform transition duration-500 ease-in-out hover:scale-105 relative">
            {isComingSoon && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <Typography variant="h5" className="text-white">
                        Coming Soon...
                    </Typography>
                </div>
            )}
            <div className="absolute top-0 left-0 flex items-center text-xs">
                {poweredByText && (
                    <div className={`${getBackgroundColor(poweredByText)} text-white text-xs rounded px-2 py-1`}>
                        <span>{poweredByText}</span>
                    </div>
                )}
            </div>
            <img src={icon} alt={title} className="w-full h-auto" />
            <div className='p-3'>
                <h3 className="text-xl font-bold mb-2 self-start">{title}</h3>
                <div className="font-normal bg-green-50 dark:bg-slate-500 p-4 rounded-lg my-5">
                    <ul>
                        {details.map((detail, index) => (
                            <li key={index} className="text-gray-900 font-medium dark:text-gray-50">{detail}</li>
                        ))}
                    </ul>
                </div>
                <div className="w-full pl-0 pr-12">
                    {primaryAction && (
                        <button onClick={handlePrimaryAction} className="bg-green-600 text-white w-full py-2 rounded-tr-md hover:bg-green-700 transition duration-300 mb-2">
                            {primaryAction}
                        </button>
                    )}
                    {secondaryAction && (
                        <button onClick={handleSecondaryAction} className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800 transition duration-300">
                            {secondaryAction}
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;
