import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Footer from './Footer'; // import Footer

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard with Footer */}
        <Route path="/home" element={
          <>
            <Home />
            <Footer />
          </>
        } />

        {/* Placeholder routes for future features */}
        <Route path="/start-test" element={<div className="text-center mt-5"><h2>Start Test Page (Coming Soon)</h2></div>} />
        <Route path="/mock-interview" element={<div className="text-center mt-5"><h2>Mock Interview Page (Coming Soon)</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
