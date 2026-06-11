import React, { useState, useEffect } from 'react';
import { Gamepad2, Menu, X, Search, User, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, plan, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled glass-panel' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Gamepad2 className="logo-icon" size={32} />
          <span className="logo-text text-gradient">The Arcade</span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link active">{t('nav.home')}</Link>
          <Link to="/games" className="nav-link">{t('nav.games')}</Link>
          <Link to="/categories" className="nav-link">{t('nav.categories')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
        </div>

        <div className="navbar-actions desktop-only">
          <div className="lang-switcher" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <Globe size={16} />
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
              <option value="it">IT</option>
              <option value="hi">HI</option>
              <option value="pa">PA</option>
            </select>
          </div>
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="user-greeting" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {user.user_metadata?.username || user.email}
                {plan === 'PRO' && <span style={{ background: 'var(--accent-gradient)', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>PRO</span>}
              </span>
              <button className="btn btn-outline" onClick={logout}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary" onClick={() => navigate('/pricing')}>{t('nav.gopro')}</button>}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>{t('nav.login')}</button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>{t('nav.signup')}</button>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/games" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.games')}</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.categories')}</Link>
          <hr className="menu-divider" />
          {user ? (
            <>
              <div style={{ padding: '0.5rem 0', color: 'var(--primary-color)' }}>{t('nav.hello')}, {user.user_metadata?.username || user.email}</div>
              <button className="btn btn-outline full-width" onClick={() => { logout(); setMobileMenuOpen(false); }}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary full-width" onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}>{t('nav.gopro')}</button>}
            </>
          ) : (
            <>
              <button className="btn btn-outline full-width" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>{t('nav.login')}</button>
              <button className="btn btn-primary full-width" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>{t('nav.signup')}</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
