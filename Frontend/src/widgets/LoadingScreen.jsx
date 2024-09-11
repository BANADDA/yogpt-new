// LoadingScreen.jsx
const LoadingScreen = () => {
    return (
      <>
        {/* Styles inserted directly within a <style> tag */}
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
  
            .loading-screen {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #e2e8f0; /* Tailwind's slate-200 */
              color-scheme: dark;
              background-color: #1e293b; /* Tailwind's slate-800 */
            }
  
            .spinner {
              width: 4rem; /* Tailwind's w-16 */
              height: 4rem; /* Tailwind's h-16 */
              border-top: 4px solid #3BF64B; /* Tailwind's blue-500 */
              border-bottom: 4px solid #3BF64B; /* Tailwind's blue-500 */
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
          `}
        </style>
        <div className="loading-screen flex items-center justify-center h-screen bg-slate-200 dark:bg-slate-800">
          <div className="spinner border-t-4 border-b-4 border-green-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      </>
    );
  };
  
  export default LoadingScreen;
  