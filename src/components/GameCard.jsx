import React, { useState, useEffect } from 'react';
import { Play, Download, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './GameCard.css';

const GameCard = ({ game }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const checkFav = async () => {
        const { data } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('game_id', game.id)
          .single();
        if (data) setIsFavorite(true);
      };
      checkFav();
    }
  }, [user, game.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // prevent routing
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to save favorites!");
      return;
    }

    if (isFavorite) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('game_id', game.id);
      setIsFavorite(false);
    } else {
      await supabase.from('user_favorites').insert([{ user_id: user.id, game_id: game.id }]);
      setIsFavorite(true);
    }
  };

  return (
    <Link to={`/game/${game.id}`} className="game-card glass-panel animate-fade-in" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="game-card-image-wrapper">
        <img src={game.coverUrl} alt={game.title} className="game-card-image" />
        <div className="game-card-overlay">
          <Link 
            to={game.isWebGame ? `/play/${game.id}` : `/game/${game.id}`} 
            className="btn btn-primary play-btn round-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            {game.isWebGame ? <Play size={24} fill="currentColor" /> : <Download size={24} />}
          </Link>
        </div>
        <div className="game-badge">{game.category}</div>
        
        {/* Heart Icon Overlay */}
        <button 
          className="icon-btn" 
          onClick={toggleFavorite}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.4rem' }}
        >
          <Heart size={18} fill={isFavorite ? 'var(--primary-color)' : 'none'} color={isFavorite ? 'var(--primary-color)' : '#fff'} />
        </button>
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
