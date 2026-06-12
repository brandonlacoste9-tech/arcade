// Base URL of the Stripe/admin backend. Set VITE_API_URL in production
// (e.g. https://api.hellyeah-games.com); falls back to localhost for dev.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4242';
