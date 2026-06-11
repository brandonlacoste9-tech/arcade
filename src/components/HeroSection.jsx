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
          <span className="hero-badge glass-panel">{t('hero.badge')}</span>
          <h1 className="hero-title">
            {t('hero.title1')} <br/>
            <span className="text-gradient">{t('hero.title2')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/game/2048')}>
              <Play size={20} fill="currentColor" />
              {t('hero.start')}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              {t('hero.explore')}
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="hero-stats glass-panel">
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">{t('hero.stat_games')}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">50k</span>
              <span className="stat-label">{t('hero.stat_players')}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">4.9/5</span>
              <span className="stat-label">{t('hero.stat_rating')}</span>
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
