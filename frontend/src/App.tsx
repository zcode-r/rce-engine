import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

import Home from './pages/Home';
import Submission from './pages/Submission';
import History from './pages/History'; // <-- 1. Added the import here

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* These routes require the user to be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/submission/:id" element={<Submission />} />
              <Route path="/history" element={<History />} /> {/* <-- 2. Added the secure route here */}
            </Route>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;