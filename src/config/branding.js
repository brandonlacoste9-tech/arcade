export const getBranding = () => {
  // Safe check for SSR/build environments
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Cyborg Gamers configuration
  if (hostname.includes('cyborggamers') || hostname.includes('arcade-5mz2')) {
    return {
      name: 'Cyborg Gamers',
      logoText: 'CYBORG GAMERS',
      heroTitle: 'GAMERS CYBORG',
      heroSubtitle: 'OVER 800+ OF YOUR FAVOURITE GAMES. ALL IN ONE PLACE. ANYTIME. EVERYWHERE. FREE REGISTRATION. START PLAYING.',
      heroBackground: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 40%, rgba(10, 10, 10, 0.4) 100%), url(/cyborg-bg.jpg)',
      domain: 'cyborggamers.com',
      theme: 'cyberpunk', // Custom theme key we can use for CSS if needed
    };
  }

  // Default configuration (Hell Yeah Games)
  return {
    name: 'Hell Yeah Games',
    logoText: 'HELL YEAH',
    heroTitle: 'Welcome to Hell Yeah Games',
    heroSubtitle: 'Play thousands of premium browser games instantly. No downloads required.',
    heroBackground: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 40%, rgba(10, 10, 10, 0.4) 100%), url(/hero-bg.jpg)',
    domain: 'hellyeah-games.com',
    theme: 'default',
  };
};
