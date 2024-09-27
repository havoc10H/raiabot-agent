import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom'; // Ensure this is imported correctly
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('raia-loginKey'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('raia-loginKey'));
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/signin" />}
        />
        <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/" /> : <SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;