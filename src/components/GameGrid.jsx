import React, { useState } from 'react';
import GameCard from './GameCard';
import { gamesData } from '../data/games';
import './GameGrid.css';

const GameGrid = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Action', 'Strategy', 'Puzzle', 'Arcade', 'Cards', 'Bubble Shooters'];

  const filteredGames = activeFilter === 'All' 
    ? gamesData.slice(0, 24) // Limit to 24 for "All" to avoid massive page load initially
    : gamesData.filter(game => game.category === activeFilter);

  return (
    <section className="game-section container">
      <div className="section-header">
        <h2 className="section-title">
          Trending <span className="text-gradient">Now</span>
        </h2>
        <div className="section-filters">
          {filters.map(filter => (
            <button 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="game-grid">
        {filteredGames.map((game, index) => (
          <div key={game.id} style={{ animationDelay: `${(index % 12) * 0.05}s` }} className="animate-fade-in">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameGrid;
