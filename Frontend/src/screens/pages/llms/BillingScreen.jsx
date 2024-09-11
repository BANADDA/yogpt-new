import { useEffect, useRef, useState } from "react";
import { auth, userJobs } from "../../../auth/config/firebase-config";
import BillingSection from "../../../widgets/BillingSection";
import Navigator from "../../../widgets/NavComponent";
import Sidebar from "../../../widgets/sidebar";
import UserInfoPopup from "../../../widgets/userInfo";

const BillingScreen = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [activeScreen, setActiveScreen] = useState("Billing");
    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser({
                    isAuthenticated: true,
                    name: user.displayName || 'No Name',
                    email: user.email,
                    photoURL: user.photoURL || 'path/to/default/image.png'
                });
            } else {
                setUser({
                    isAuthenticated: false,
                    name: '',
                    email: '',
                    photoURL: ''
                });
            }
        });
    }, []);

    useEffect(() => {
        themeCheck();
    }, []);

    const themeCheck = () => {
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.classList.add("dark");
            setIsDarkTheme(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkTheme(false);
        }
    };

    const themeSwitch = () => {
        if (isDarkTheme) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkTheme(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkTheme(true);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

    const handleMenuClick = (screen) => {
        setActiveScreen(screen);
    };

    const renderContent = () => {
        switch (activeScreen) {
            case "Billing":
                return <BillingSection />;
            default:
                return <BillingSection />;
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen">
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}
                <Sidebar user={user} activeScreen={activeScreen} onMenuClick={handleMenuClick} />
                <div className="flex flex-col flex-1 min-h-screen">
                    <Navigator
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        onProfileClick={toggleProfileWidget}
                    />
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default BillingScreen;
