import React from 'react';
import logo from './logo.svg';
import { AuthProvider } from './components/AuthContext';
import SignIn from './components/SignIn';


function App() {
  return (
    <AuthProvider>
    <SignIn />
    <div className="bg-[#f7d2ab] text-[#2b2b2b] relative flex min-h-screen flex-col justify-center items-center p-6">
      <header className="flex flex-col justify-center items-center tracking-widest"> 
        <img src={logo} className="h-80 w-auto" alt="logo" />
        <p className="text-3xl">
          Welcome!
        </p>
        <p className="text-xl">An app to easily meet up with friends to do things you enjoy, or make new friends doing what you love doing!</p>
      </header>
    </div>
    </AuthProvider>
  );
}

export default App;
