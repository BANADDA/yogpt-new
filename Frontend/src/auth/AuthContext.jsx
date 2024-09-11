import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyD1w5Q5sN1rrwOq8lHPtmVg_pqalwYrLEE",
    authDomain: "echo-fe663.firebaseapp.com",
    projectId: "echo-fe663",
    storageBucket: "echo-fe663.appspot.com",
    messagingSenderId: "242213821849",
    appId: "1:242213821849:web:9061001fa288c50249c708",
    measurementId: "G-22D29K0Y6C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
