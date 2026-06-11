import React from 'react';
import { Play, Download, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game }) => {
  return (
    <Link to={`/game/${game.id}`} className="game-card glass-panel animate-fade-in" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="game-card-image-wrapper">
        <img src={game.coverUrl} alt={game.title} className="game-card-image" />
        <div className="game-card-overlay">
          <button className="btn btn-primary play-btn round-btn">
            {game.isWebGame ? <Play size={24} fill="currentColor" /> : <Download size={24} />}
          </button>
        </div>
        <div className="game-badge">{game.category}</div>
      </div>
      
      <div className="game-card-content">
        <div className="game-card-header">
          <h3 className="game-title">{game.title}</h3>
          <div className="game-rating">
            <Star size={14} fill="currentColor" className="star-icon" />
            <span>{game.rating}</span>
          </div>
        </div>
        <p className="game-description">{game.description}</p>
        <div className="game-card-footer">
          <span className="game-type">{game.isWebGame ? 'Play in Browser' : 'Windows / Mac'}</span>
          <span className="action-link">View Details</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
