import { Play, ArrowRight } from 'lucide-react';
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
          <span className="hero-badge glass-panel">🔥 The Ultimate Gaming Platform</span>
          <h1 className="hero-title" style={{ textTransform: 'uppercase', letterSpacing: '-1px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ff6b00, #ff0080, #00e5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              fontSize: '5rem',
              fontWeight: 900,
              lineHeight: 0.9,
              filter: 'drop-shadow(0 0 20px rgba(255, 107, 0, 0.6))',
            }}>HELL<br/>YEAH</span>
            <span style={{
              display: 'block',
              fontSize: '2.5rem',
              letterSpacing: '10px',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              marginTop: '0.25rem'
            }}>GAMES</span>
          </h1>
          <p className="hero-subtitle">
            860+ of the world's best casual & hardcore games. One platform. Zero compromises. Let's play.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/games')} style={{ background: 'linear-gradient(135deg, #ff6b00, #ff0080)', border: 'none' }}>
              <Play size={20} fill="currentColor" />
              Start Playing 🔥
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Browse Catalog
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="hero-stats glass-panel">
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff6b00' }}>860+</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff0080' }}>500+</span>
              <span className="stat-label">Browser Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#00e5ff' }}>$9.99</span>
              <span className="stat-label">/ Month Unlimited</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div 
            className="hero-card glass-panel featured-game-card" 
            onClick={() => navigate('/game/2048')}
            style={{ cursor: 'pointer' }}
          >
            <div className="featured-image-container">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
                alt="Featured Game" 
                className="featured-image"
              />
              <div className="featured-overlay"></div>
            </div>
            <div className="featured-info">
              <span className="category-tag">Cyberpunk • Action</span>
              <h3>Neon Eclipse</h3>
              <p>The highly anticipated sequel is finally here. Play now.</p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
