import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, CheckCircle, ArrowLeft, Radio } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('info');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const checkAdmin = async () => {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data && data.role === 'admin') {
        setIsAdmin(true);
        fetchUsers();
      } else {
        navigate('/'); // kick out non-admins
      }
    };
    
    checkAdmin();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      const res = await fetch(`${apiUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      setUsersList(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const togglePlan = async (userId, currentPlan) => {
    const newPlan = currentPlan === 'PRO' ? 'FREE' : 'PRO';
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      const res = await fetch(`${apiUrl}/api/users/${userId}/plan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dispatchBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      const { error } = await supabase.from('broadcasts').insert([
        { message: broadcastMsg, priority: broadcastPriority, is_active: true }
      ]);
      if (error) throw error;
      setBroadcastMsg('');
      alert('Broadcast Dispatched!');
    } catch (err) {
      console.error('Broadcast failed:', err);
      alert('Broadcast failed');
    }
  };

  if (loading || !isAdmin) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Loading Secure Area...</div>;

  return (
    <div className="container admin-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={32} className="text-primary" />
          <h1 className="text-gradient" style={{ margin: 0 }}>Admin Dashboard</h1>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Exit Admin</button>
      </div>

      <div className="admin-stats glass-panel" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{usersList.length}</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>PRO Subscribers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--secondary-color)' }}>
            {usersList.filter(u => u.plan === 'PRO').length}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#00f3ff' }}>
          <Radio size={24} /> Broadcast Command Center
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Enter broadcast message..." 
            className="input-field" 
            style={{ flex: 1, minWidth: '300px' }}
            value={broadcastMsg}
            onChange={e => setBroadcastMsg(e.target.value)}
          />
          <select 
            className="input-field" 
            style={{ width: '150px' }}
            value={broadcastPriority}
            onChange={e => setBroadcastPriority(e.target.value)}
          >
            <option value="info">Info (Blue)</option>
            <option value="milestone">Milestone (Gold)</option>
            <option value="system">System (Red Pinned)</option>
          </select>
          <button className="btn btn-primary" onClick={dispatchBroadcast}>
            Dispatch Global Alert
          </button>
        </div>

        {broadcastMsg && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', borderLeft: `4px solid ${broadcastPriority === 'system' ? '#ef4444' : broadcastPriority === 'milestone' ? '#fbbf24' : '#3b82f6'}` }}>
            <h4 style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>Preview</h4>
            <p style={{ margin: 0, fontWeight: 'bold', color: broadcastPriority === 'system' ? '#fff' : '#e2e8f0' }}>{broadcastMsg}</p>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>User ID</th>
              <th style={{ padding: '1rem' }}>Username</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Plan</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id} style={{ borderBottom: 'var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {u.id.substring(0, 8)}...
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.username || 'Anonymous'}</td>
                <td style={{ padding: '1rem' }}>
                  {u.role === 'admin' ? <span style={{ color: 'var(--primary-color)' }}><Shield size={14}/> Admin</span> : 'User'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {u.plan === 'PRO' ? (
                    <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>PRO</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>FREE</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    className={`btn ${u.plan === 'PRO' ? 'btn-outline' : 'btn-primary'}`} 
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => togglePlan(u.id, u.plan)}
                  >
                    {u.plan === 'PRO' ? 'Revoke PRO' : 'Grant PRO'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
