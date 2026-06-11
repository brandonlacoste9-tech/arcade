import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Star } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
  const { user, subscribe, plan } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    subscribe();
    navigate('/games'); // Redirect to games after subscription
  };

  return (
    <div className="pricing-container container">
      <div className="pricing-header text-center animate-fade-in">
        <h1 className="pricing-title">Unlock <span className="text-gradient">Premium</span> Gaming</h1>
        <p className="pricing-subtitle">Choose the plan that fits your play style.</p>
      </div>

      <div className="pricing-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Free Tier */}
        <div className="pricing-card glass-panel">
          <div className="pricing-card-header">
            <h3>Explorer</h3>
            <div className="price">
              <span className="amount">$0</span>
              <span className="period">/forever</span>
            </div>
            <p>Browse the catalog and view details.</p>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} className="text-primary" /> View all 200+ games</li>
            <li><Check size={16} className="text-primary" /> Read reviews & details</li>
            <li className="disabled-feature">Play HTML5 Games</li>
            <li className="disabled-feature">Download Desktop Games</li>
          </ul>
          <button className="btn btn-outline full-width" disabled={plan === 'FREE'}>
            {plan === 'FREE' ? 'Current Plan' : 'Free'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className="pricing-card glass-panel pro-card">
          <div className="pro-badge">
            <Star size={14} fill="currentColor" />
            Most Popular
          </div>
          <div className="pricing-card-header">
            <h3 className="text-gradient">Pro Gamer</h3>
            <div className="price">
              <span className="amount">$9.99</span>
              <span className="period">/month</span>
            </div>
            <p>Full unlimited access to The Arcade.</p>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} className="text-primary" /> View all 200+ games</li>
            <li><Check size={16} className="text-primary" /> Read reviews & details</li>
            <li><Check size={16} className="text-primary" /> Play all HTML5 Games</li>
            <li><Check size={16} className="text-primary" /> Download Desktop Games</li>
            <li><Check size={16} className="text-primary" /> Ad-free experience</li>
          </ul>
          <button 
            className="btn btn-primary full-width" 
            onClick={handleSubscribe}
            disabled={plan === 'PRO'}
          >
            {plan === 'PRO' ? 'Active Subscription' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
