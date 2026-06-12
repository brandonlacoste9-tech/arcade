import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize, Heart } from 'lucide-react';
import { gamesData } from '../data/games';
import { useAuth } from '../context/AuthContext';
import './GamePlayer.css';

const GamePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, plan } = useAuth();
  const [game, setGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // If not pro, they can't play
    if (plan !== 'PRO') {
      navigate('/pricing');
      return;
    }

    const foundGame = gamesData.find(g => g.id === id);
    if (foundGame) {
      setGame(foundGame);
    } else {
      navigate('/games');
    }
  }, [id, plan, navigate]);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!game) return <div className="game-player-loading">Loading arcade...</div>;

  return (
    <div className="game-player-container">
      {/* Overlay Toolbar */}
      <div className="game-player-toolbar">
        <button className="btn btn-outline toolbar-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Exit
        </button>
        <h2 className="game-player-title">{game.title}</h2>
        <div className="toolbar-actions">
          <button className="icon-btn" aria-label="Favorite">
            <Heart size={20} />
          </button>
          <button className="icon-btn" aria-label="Fullscreen" onClick={toggleFullscreen}>
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* The Game Iframe */}
      <div className="iframe-wrapper">
        <iframe
          id="game-iframe"
          src={game.gameUrl}
          title={game.title}
          allowFullScreen
          frameBorder="0"
          className="game-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default GamePlayer;
