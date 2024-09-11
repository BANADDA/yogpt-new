import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { addTrainingJob, auth, userJobs } from "../../../auth/config/firebase-config";
import Navigator from "../../../widgets/NavComponent";
import NewJobModal from "../../../widgets/NewJobModal";
import Sidebar from "../../../widgets/sidebar";
import UserInfoPopup from "../../../widgets/userInfo";

const TrainingJobs = () => {
    // State variables and hooks
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newModelName, setNewModelName] = useState('');
    const [license, setLicense] = useState('');
    const [spaceHardware, setSpaceHardware] = useState('');
    const [huggingFaceModelID, setHuggingFaceModelID] = useState('');
    const [huggingFaceDatasetID, setHuggingFaceDatasetID] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [modelNameError, setModelNameError] = useState('');
    const [modelIDError, setModelIDError] = useState('');
    const [datasetIDError, setDatasetIDError] = useState('');
    const [hardwareError, setHardwareError] = useState('');
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [groupedModels, setGroupedModels] = useState({});
    const [selectedModel, setSelectedModel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [validationCriteria, setValidationCriteria] = useState('');
    const [performanceBenchmarks, setPerformanceBenchmarks] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [datasetDescription, setDatasetDescription] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [activeButton, setActiveButton] = useState("All");
    const [fineTuningJobs, setFineTuningJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage, setJobsPerPage] = useState(10);
    const [dateFilter, setDateFilter] = useState('All');
    const [totalPages, setTotalPages] = useState(10);


    const location = useLocation(); // This reacts to changes in the route
    const [refreshJobs, setRefreshJobs] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const jobs = await userJobs();
                console.log("Jobs fetched:", jobs); // Log the fetched jobs
                setFineTuningJobs(jobs);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            }
            setIsLoading(false);
        };

        fetchJobs();
    }, [refreshJobs]);

    const filteredJobs = fineTuningJobs.filter(job => {
        const matchName = job.suffix?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchId = (job.baseModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.huggingFaceId?.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log("Match Name:", matchName, "Match ID:", matchId); // See which one matches
        return matchName || matchId;
    });

    console.log("Filtered Jobs:", filteredJobs); // See the filtered array

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredJobs.length / jobsPerPage); i++) {
        pageNumbers.push(i);
    }
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName); // This already sets the active button style
        setCurrentFilter(buttonName); // Add this line to set the current filter
    };


    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    // Ref for interval
    const intervalRef = useRef(null);

    // Dependency array includes refreshJobs

    const handleJobSubmission = async () => {
        setShowProgress(true);
        try {
            await addTrainingJob(/* job data */);
            setRefreshJobs(!refreshJobs); // Toggle to trigger re-fetch
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 2000);
        } catch (error) {
            console.error('Failed to submit job:', error);
        }
        setShowProgress(false);
    };

    // Effect to set navbar height
    useEffect(() => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            const height = navbar.offsetHeight;
            setNavbarHeight(height);
        }
    }, []);

    // Theme check on mount
    useEffect(() => {
        themeCheck();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Theme check function
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

    // Theme switch function
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

    // Function to toggle mobile menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Function to toggle profile widget
    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

    // Function to select a job
    const selectJob = (job) => setSelectedJob(job);

    // Function to handle file change
    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setHuggingFaceDatasetID('');
        }
    };

    // Function to validate form
    const validateForm = () => {
        let isValid = true;

        if (!newModelName.trim()) {
            setModelNameError('Model name is required.');
            isValid = false;
        } else {
            setModelNameError('');
        }

        if (!modelIDError.trim()) {
            setModelIDError('Model id is required.');
            isValid = false;
        } else {
            setModelIDError('');
        }

        if (!huggingFaceDatasetID.trim()) {
            setDatasetIDError('Dataset ID is required.');
            isValid = false;
        } else {
            setDatasetIDError('');
        }

        if (!spaceHardware) {
            setHardwareError('Training hardware is required.');
            isValid = false;
        } else {
            setHardwareError('');
        }

        return isValid;
    };

    // Function to handle fine-tune
    const handleFineTune = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setShowProgress(true);
        setProgressValue(0);

        intervalRef.current = setInterval(() => {
            setProgressValue((prevValue) => {
                const newValue = prevValue + 10;
                if (newValue >= 100) {
                    clearInterval(intervalRef.current);
                    handleTrainingJobSubmission(newModelName);
                    setShowProgress(false);
                    return 100;
                }
                return newValue;
            });
        }, 300);
    };

    // Function to handle training job submission
    const handleTrainingJobSubmission = async (newModelName) => {
        try {
            console.log("Submitting training job...");
            console.log("New Model Name:", newModelName);
            console.log("Huggingface Dataset ID:", huggingFaceDatasetID);
            console.log("Space Hardware:", spaceHardware);
            console.log("License:", license);

            const domain = "Large Language Models";
            const jobStatus = "Queued";

            await addTrainingJob(
                newModelName,
                selectedModel,
                huggingFaceDatasetID,
                spaceHardware,
                license,
                domain,
                jobStatus
            );
            console.log("Training job submitted successfully!");
            setShowSuccessAlert(true);
            navigate('/models');
        } catch (error) {
            console.error("Failed to submit the model for training:", error);
        }

        setShowProgress(false);
        setNewModelName('');
        setHuggingFaceModelID('');
        setHuggingFaceDatasetID('');
        setSelectedModel(null);
        setSpaceHardware('');
        setLicense('MIT');

        setShowProgress(true);
        setProgressValue(0);

        // Simulate progress
        intervalRef.current = setInterval(() => {
            setProgressValue((prevValue) => {
                const newValue = prevValue + 10;
                if (newValue >= 100) {
                    clearInterval(intervalRef.current);
                    handleTrainingJobSubmission(newModelName);
                    setShowProgress(false);// Pass newModelName as argument
                    return 100;
                }
                return newValue;
            });
        }, 300);
    };

    // Effect to handle authentication state changes
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

    // Filter models by search term
    const getFilteredModelsByGroup = (models) => {
        return models.filter(model => {
            const searchQuery = searchTerm.toLowerCase();
            const matchesTag = model?.pipeline_tag?.toLowerCase().includes(searchQuery);
            const matchesModelId = model?.modelId?.toLowerCase().includes(searchQuery);
            return searchTerm ? matchesTag || matchesModelId : true;
        });
    };

    function chunkArray(myArray, chunk_size) {
        const results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }
        return results;
    }

    const handleDateFilterChange = (event) => {
        const selectedFilter = event.target.value;
        setDateFilter(selectedFilter);
        filterJobsByDate(selectedFilter);
    };

    const filterJobsByDate = (filter) => {
        const now = new Date();
        let filteredJobs = [];

        switch (filter) {
            case 'Last day':
                filteredJobs = fineTuningJobs.filter(job =>
                    new Date(job.createdAt.seconds * 1000) >= new Date(now.setDate(now.getDate() - 1))
                );
                break;
            case 'Last 7 days':
                filteredJobs = fineTuningJobs.filter(job =>
                    new Date(job.createdAt.seconds * 1000) >= new Date(now.setDate(now.getDate() - 7))
                );
                break;
            case 'Last 30 days':
                filteredJobs = fineTuningJobs.filter(job =>
                    new Date(job.createdAt.seconds * 1000) >= new Date(now.setDate(now.getDate() - 30))
                );
                break;
            case 'Last year':
                filteredJobs = fineTuningJobs.filter(job =>
                    new Date(job.createdAt.seconds * 1000) >= new Date(now.setFullYear(now.getFullYear() - 1))
                );
                break;
            default:
                filteredJobs = fineTuningJobs;
        }

        setFineTuningJobs(filteredJobs);
    };

    useEffect(() => {
        setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage));
    }, [filteredJobs, jobsPerPage]);

    const goToNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const changePage = (page) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(Math.min(pageNumber, totalPages));
    };

    const currentJobs = filteredJobs.slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage
    );

    function getStatusColor(status) {
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
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                {/* Profile Popup */}
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}
                {/* Sidebar */}
                <Sidebar user={user} activeScreen="Fine-tuning" />

                <div className="flex flex-col flex-1 min-h-screen">
                    {/* Navbar */}
                    <Navigator
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        onProfileClick={toggleProfileWidget}
                    />
                    {/* Main Content */}
                    <NewJobModal />
                </div>
            </div>
        </>
    );
};

export default TrainingJobs;
