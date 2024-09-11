// // Layout.js

// import PropTypes from 'prop-types';
// import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import AuthModal from "../auth/AuthModal";
// import { auth } from "../auth/config/firebase-config";
// import { menus } from "../data/menus";
// import Alert from "./Alert";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// export const Layout = ({ children }) => {  
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [showAuthModel, setShowAuthModel] = useState(false);
//   const [currentTitle, setCurrentTitle] = useState('');
//   const navigate = useNavigate(); // Define useNavigate hook here

//   // Listen for changes in the authentication state
//   useEffect(() => {
//     auth.onAuthStateChanged((user) => {
//       if (user) {
//         // User is signed in.
//         setIsAuthenticated(true);
//       } else {
//         // User is signed out.
//         setIsAuthenticated(false);
//       }
//     });
//     themeCheck();
//   }, []);

//   const handleExploreClick = (title, link) => {
//     if (isAuthenticated) {
//       setCurrentTitle(title);
//       setShowAlert(true);
//       // Navigate to the provided link
//       if (link) {
//         navigate(link);
//       }
//     } else {
//       setShowAuthModel(true);
//     }
//   };

//   // Initial Theme Check
//   useEffect(() => {
//     themeCheck();
//   }, []);

//   const themeCheck = () => {
//     const userTheme = localStorage.getItem("theme");
//     const systemTheme = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;
//     if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
//       document.documentElement.classList.add("dark");
//       setIsDarkTheme(true);
//     } else {
//       document.documentElement.classList.add("light");
//       setIsDarkTheme(false);
//     }
//   };

//   // Manual Theme Switch
//   const themeSwitch = () => {
//     if (document.documentElement.classList.contains("dark")) {
//       document.documentElement.classList.remove("dark");
//       document.documentElement.classList.add("light");
//       localStorage.setItem("theme", "light");
//       setIsDarkTheme(false);
//     } else {
//       document.documentElement.classList.add("dark");
//       document.documentElement.classList.remove("light");
//       localStorage.setItem("theme", "dark");
//       setIsDarkTheme(true);
//     }
//   };

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   return (
//     <div className="flex flex-col">
//       <>
//         {showAlert && (
//           <Alert currentTitle={currentTitle} onClose={() => setShowAlert(false)} />
//         )}
//         {showAuthModel && (
//           <AuthModal onClose={() => setShowAuthModel(false)} />
//         )}
//         <Navbar
//           isDarkTheme={isDarkTheme}
//           themeSwitch={themeSwitch}
//           toggleMobileMenu={toggleMobileMenu}
//           isMobileMenuOpen={isMobileMenuOpen}
//         />
//         <div className="flex flex-1">
//           <Sidebar isDarkTheme={isDarkTheme} Menus={menus} />
//           <div className="flex-1 p-10 px-8 bg-slate-100 dark:bg-slate-900">
//             {children}
//           </div>
//         </div>
//       </>
//     </div>
//   );
// }

// // Prop type validation for children
// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default Layout;
