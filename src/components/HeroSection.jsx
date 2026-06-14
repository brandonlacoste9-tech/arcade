import { Play, ArrowRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-particles"></div>
      
      <div className="container hero-container">
        <div className="hero-content animate-fade-in">

          <p className="hero-subtitle">
            OVER 800+ OF YOUR FAVOURITE GAMES. ALL IN ONE PLACE. ANYTIME. EVERYWHERE. FREE REGISTRATION. START PLAYING.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/games')} style={{ background: 'linear-gradient(135deg, #ff2a2a, #8d99ae)', border: 'none' }}>
              <Play size={20} fill="currentColor" />
              JOIN THE ADVENTURE.
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Browse Catalog
              <ArrowRight size={20} />
            </button>
            <a href="https://discord.gg/v33kZn6c" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg" style={{ borderColor: '#5865F2', color: '#5865F2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} />
              Join Discord
            </a>
          </div>
          
          <div className="hero-stats glass-panel">
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff2a2a' }}>860+</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff4d4d' }}>500+</span>
              <span className="stat-label">Browser Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#8d99ae' }}>$9.99</span>
              <span className="stat-label">/ Month Unlimited</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Decorative elements */}
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
