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
      heroBackground: '/cyborg-bg.jpg', // We will copy the image to this path
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
    heroBackground: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url(/hero-bg.png)',
    domain: 'hellyeah-games.com',
    theme: 'default',
  };
};
