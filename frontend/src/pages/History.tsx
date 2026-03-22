import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

interface SubmissionData {
  id: number;
  title: string | null;
  code: string;
  language: string;
  status: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/history?t=${new Date().getTime()}`);
        setHistory(response.data);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.error || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '3rem' }}>Loading your history...</div>;
  if (errorMsg) return <div style={{ color: '#f87171', textAlign: 'center', marginTop: '3rem' }}>{errorMsg}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>My Code History</h1>
        <Link 
          to="/" 
          style={{ 
            backgroundColor: 'transparent', 
            color: 'var(--text-primary)', 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            textDecoration: 'none',
            border: '1px solid var(--border-color)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ← Back to Editor
        </Link>
      </div>

      {/* Table Section */}
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>You haven't run any code on this account yet!</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                {/* DELETED THE ID HEADER HERE */}
                <th style={{ padding: '1rem 1.5rem', color: '#aaa', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '1rem 1.5rem', color: '#aaa', fontWeight: 600 }}>Language</th>
                <th style={{ padding: '1rem 1.5rem', color: '#aaa', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', color: '#aaa', fontWeight: 600 }}>Code Snippet</th>
              </tr>
            </thead>
            <tbody>
              {history.map((sub) => (
                <tr 
                  key={sub.id} 
                  onClick={() => navigate(`/submission/${sub.id}`)} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* DELETED THE ID ROW DATA HERE */}
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#fff' }}>{sub.title || 'Untitled'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {sub.language}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      backgroundColor: sub.status === 'COMPLETED' || sub.status === 'success' ? 'rgba(74, 222, 128, 0.15)' : sub.status === 'FAILED' || sub.status === 'failed' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                      color: sub.status === 'COMPLETED' || sub.status === 'success' ? '#4ade80' : sub.status === 'FAILED' || sub.status === 'failed' ? '#f87171' : '#facc15'
                    }}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#aaa', fontSize: '0.9rem' }}>
                    {sub.code.substring(0, 40)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;