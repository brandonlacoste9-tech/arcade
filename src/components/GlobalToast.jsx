import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { AlertCircle, Zap, Info, X } from 'lucide-react';
import './GlobalToast.css';

const GlobalToast = () => {
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    // Initial fetch of active broadcasts
    const fetchActiveBroadcasts = async () => {
      const { data } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) setBroadcasts(data);
    };

    fetchActiveBroadcasts();

    // Subscribe to new broadcasts
    const subscription = supabase
      .channel('public:broadcasts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'broadcasts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBroadcasts(prev => [payload.new, ...prev]);
          
          // Auto-dismiss transient toasts
          if (payload.new.priority !== 'system') {
            setTimeout(() => {
              removeToast(payload.new.id);
            }, 8000); // 8 seconds TTL
          }
        } else if (payload.eventType === 'UPDATE') {
          if (!payload.new.is_active) {
            removeToast(payload.new.id);
          } else {
            setBroadcasts(prev => prev.map(b => b.id === payload.new.id ? payload.new : b));
          }
        } else if (payload.eventType === 'DELETE') {
          removeToast(payload.old.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const removeToast = (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
  };

  if (broadcasts.length === 0) return null;

  return (
    <div className="global-toast-container">
      {broadcasts.map((broadcast) => {
        let Icon = Info;
        let colorClass = 'toast-info';
        
        if (broadcast.priority === 'system') {
          Icon = AlertCircle;
          colorClass = 'toast-system';
        } else if (broadcast.priority === 'milestone') {
          Icon = Zap;
          colorClass = 'toast-milestone';
        }

        return (
          <div key={broadcast.id} className={`global-toast ${colorClass}`}>
            <div className="toast-icon">
              <Icon size={24} />
            </div>
            <div className="toast-content">
              {broadcast.message}
            </div>
            <button className="toast-close" onClick={() => removeToast(broadcast.id)}>
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalToast;
