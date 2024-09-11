import React from 'react';

const LoadingSpinner = () => {
    const spinnerStyle = {
        border: "4px solid rgba(0, 0, 0, 0.1)", // Light grey border
        borderTopColor: "#09f",  // Blue color for the spinner top
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        animation: "spin 1s ease infinite"
    };

    const spinnerContainerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed", // This makes the spinner overlay the entire screen
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent black background
        zIndex: "9999" // Ensures the spinner is above other content
    };

    return (
        <div style={spinnerContainerStyle}>
            <div style={spinnerStyle}></div>
        </div>
    );
};

export default LoadingSpinner;

// Make sure to include the @keyframes rule for 'spin' in your CSS:
/*
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
*/
