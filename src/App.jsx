import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GameGrid from './components/GameGrid';
import GamePage from './components/GamePage';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Games from './pages/Games';
import About from './pages/About';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <GameGrid />
            </>
          } />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/games" element={<Games />} />
          <Route path="/categories" element={<Games />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
