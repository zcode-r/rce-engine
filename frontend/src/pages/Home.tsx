import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Play } from 'lucide-react';

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); 
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please write some code before submitting.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/submit', {
        title: title || 'Untitled Submission',
        code,
        language
      });
      
      const subId = response.data.submission?.id || response.data.id;
      if (subId) {
        navigate(`/submission/${subId}`);
      } else {
        setError('Submission created, but backend did not return an ID.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#fff' }}>Code Editor</h1>
      
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Submission Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Two Sum Solution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
            <label className="form-label">Language</label>
            <select 
              className="form-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ backgroundColor: 'var(--bg-color)', cursor: 'pointer' }}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              {/* Added C language option here */}
              <option value="c">C</option> 
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Source Code</label>
          <textarea
            className="form-input"
            style={{ 
              fontFamily: 'monospace', 
              minHeight: '400px', 
              resize: 'vertical',
              backgroundColor: '#0d1117',
              color: '#c9d1d9',
              fontSize: '14px',
              padding: '1rem'
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Write your ${language} code here...`}
            spellCheck="false"
          />
        </div>

        <button 
          className="btn-primary" 
          type="submit" 
          disabled={loading}
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
        >
          <Play size={18} />
          {loading ? 'Submitting...' : 'Run Code'}
        </button>
      </form>
    </div>
  );
};

export default Home;