import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom'; // Ensure this is imported correctly
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/signin" />}
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
