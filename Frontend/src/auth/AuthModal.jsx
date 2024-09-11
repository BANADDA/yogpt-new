// AuthModal.jsx
import PropTypes from 'prop-types';
import { FaArrowRight, FaSmile, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const AuthModal = ({ onClose }) => {
    let navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/sign-in');
    };

    return (
        <div role="alert" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div role="alert" className="w-96 bg-white rounded-lg overflow-hidden shadow-lg"> {/* Added shadow for depth */}
                <div className="bg-green-800 text-white text-lg font-bold rounded-t px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Alert icon added here */}
                        <FaSmile className="text-xl" />
                        Account Login
                    </div>
                    {/* Close icon added here, positioned to the right */}
                    <FaTimes className="cursor-pointer" onClick={onClose} />
                </div>
                <div className="px-4 py-3 text-black flex-wrap">
                    <p className="font-semibold">To access this feature you need to login with your Echo user account</p>
                </div>
                {/* Login button added here */}
                <div className="px-4 py-4 flex justify-center">
                    <button
                        onClick={handleSignInClick} className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center group" type="button">
                        SignIn
                        <FaArrowRight className="ml-2 transition-transform transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Define prop types for Alert
AuthModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default AuthModal;
