import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './LeaderboardModal.css';

const LeaderboardModal = ({ isOpen, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, empire_points, plan, id')
        .order('empire_points', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchLeaderboard();

      // Subscribe to real-time point updates
      const subscription = supabase
        .channel('public:profiles')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
            // Re-fetch the leaderboard if someone's points change to maintain accurate sorting
            fetchLeaderboard();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
        <button className="leaderboard-close" onClick={onClose}>×</button>
        <h2 className="leaderboard-title">🏆 Empire Leaderboard</h2>
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Points</span>
        </div>
        
        {loading ? (
          <div className="leaderboard-loading">Scanning Network...</div>
        ) : (
          <div className="leaderboard-list">
            {players.map((player, index) => {
              let rankClass = '';
              if (index === 0) rankClass = 'rank-1';
              if (index === 1) rankClass = 'rank-2';
              if (index === 2) rankClass = 'rank-3';

              return (
                <div key={player.id} className={`leaderboard-row ${rankClass}`}>
                  <div className="rank">#{index + 1}</div>
                  <div className="player-info">
                    <span className="username">{player.username || 'Ghost'}</span>
                    {player.plan === 'PRO' && (
                      <span className="pro-badge" title="Empire Passport Holder">PRO</span>
                    )}
                  </div>
                  <div className="points">{player.empire_points?.toLocaleString() || 0}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;
