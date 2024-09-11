export const themeCheck = (setIsDarkTheme) => {
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
  
  export const themeSwitch = (setIsDarkTheme) => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };
  