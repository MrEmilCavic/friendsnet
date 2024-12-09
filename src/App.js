import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import { AuthProvider } from './components/AuthContext';
import Home from './components/Home';
import SignIn from './components/SignIn';
import Profile from './components/Profile';


function App() {
  return (
    <AuthProvider>
      <Router>
        <SignIn />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Profile/:userId' element={<Profile />} />
          <Route path='*' element={<Navigate to='/' replace={true} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
