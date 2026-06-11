import React, { useEffect } from 'react';
import GameGrid from '../components/GameGrid';

const Games = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1>The Arcade <span className="text-gradient">Catalog</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Browse our entire collection of premium games.</p>
      </div>
      <GameGrid />
    </div>
  );
};

export default Games;
