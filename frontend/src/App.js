// src/App.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Sidebar />
            <div className="content">
                {/* Main content will go here */}
            </div>
            <Footer />
        </div>
    );
};

export default App;
