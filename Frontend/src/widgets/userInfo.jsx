import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect, useRef, useState } from 'react';
import { FaSmile, FaTimes } from 'react-icons/fa';

const UserInfoPopup = ({ userName, userEmail, onClose, userPhotoURL }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupRef]);

    return (
        <div role="alert" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div role="alert">
            <div className="bg-green-800 text-white text-lg font-bold rounded-t px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Alert icon added here */}
                        <FaSmile className="text-xl" />
                        User Account
                    </div>
                    {/* Close icon added here, positioned to the right */}
                    <FaTimes className="cursor-pointer" onClick={onClose} />
                </div>
                <div className="border border-t-0 bg-white px-4 py-3 text-black flex-wrap">
                    <img src={userPhotoURL} alt="User Avatar" className="h-14 w-14 rounded-full" />
                    <div className='mr-10 py-5'>
                    <p className="font-semibold">User Name: {userName}</p>
                    <p className="font-semibold">Email Address: {userEmail}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define prop types for the component
UserInfoPopup.propTypes = {
    userName: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    userPhotoURL: PropTypes.string.isRequired,
};

export default UserInfoPopup;
