import { onAuthStateChanged, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../auth/config/firebase-config';

const Navigator = ({ onProfileClick }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userPhotoURL, setUserPhotoURL] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUserPhotoURL(user.photoURL || 'default_user_image.png');
            } else {
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(auth).then(() => navigate('/')).catch((error) => console.error('Sign out error', error));
    };

    return (
        <nav className="bg-white fixed top-0 left-64 right-0 z-50 font-poppins text-[14px]">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 lg:pl-2">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex-1"></div> 
                    <div className="flex items-center space-x-4">
                        <button className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-w-6" style={{ color: 'black' }}>
                                    <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd"></path>
                                </svg>
                            </span>
                        </button>
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    type="button"
                                    className="relative flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onClick={toggleProfileDropdown}
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={userPhotoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} // Default image URL as fallback
                                        alt="User Profile"
                                    />
                                </button>
                                {isProfileDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                        tabIndex={-1}
                                    >
                                        <div onClick={onProfileClick} className="cursor-pointer block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">
                                            Profile
                                        </div>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">
                                            Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2" onClick={handleSignOut}>
                                            Sign out
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

Navigator.propTypes = {
    onProfileClick: PropTypes.func.isRequired
};

export default Navigator;
