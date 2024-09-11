import { useEffect, useState } from "react";
import { auth, userJobs } from "../../../auth/config/firebase-config";
import DashboardContent from '../../../widgets/DashboardContent';
import Navigator from "../../../widgets/NavComponent";
import Sidebar from "../../../widgets/sidebar";
import UserInfoPopup from "../../../widgets/userInfo";

const LLMSScreen = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [fineTuningJobs, setFineTuningJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage, setJobsPerPage] = useState(10);
    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const jobs = await userJobs();
            setFineTuningJobs(jobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
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
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.classList.add("dark");
            setIsDarkTheme(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkTheme(false);
        }
    }, []);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500';
            case 'running':
                return 'text-blue-700';
            case 'completed':
                return 'text-green-500';
            case 'failed':
                return 'text-red-700';
            default:
                return '';
        }
    };

    const filteredJobs = fineTuningJobs.filter(job => 
        job.suffix?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.baseModel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    const goToPreviousPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const changePage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="flex flex-col h-screen">
            {isProfileClicked && (
                <UserInfoPopup
                    onClose={() => setIsProfileClicked(false)}
                    userName={user.name}
                    userEmail={user.email}
                    userPhotoURL={user.photoURL}
                />
            )}
            <Sidebar user={user} activeScreen="Dashboard" onMenuClick={() => {}} />
            <div className="flex flex-col flex-1 min-h-screen">
                <Navigator
                    isDarkTheme={isDarkTheme}
                    themeSwitch={themeSwitch}
                    toggleMobileMenu={toggleMobileMenu}
                    onProfileClick={toggleProfileWidget}
                />
                <DashboardContent 
                    filteredJobs={filteredJobs} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleDateFilterChange={setDateFilter}
                    dateFilter={dateFilter}
                    currentJobs={currentJobs}
                    getStatusColor={getStatusColor}
                    currentPage={currentPage}
                    jobsPerPage={jobsPerPage}
                    totalPages={totalPages}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage}
                    changePage={changePage}
                    fetchJobs={fetchJobs}
                    setActiveScreen={() => {}}
                />
            </div>
        </div>
    );
};

export default LLMSScreen;
