import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SubmissionData {
  id: number;
  title: string | null;
  code: string;
  language: string;
  status: string;
  output: string | null;
  error: string | null;
  createdAt: string;
}

const Submission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/${id}`);
      setSubmission(response.data.submission || response.data);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch submission details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
    // Setup polling if status is still pending
    let interval: ReturnType<typeof setInterval>;
    if (submission?.status === 'pending' || submission?.status === 'processing') {
      interval = setInterval(fetchSubmission, 2000);
    }
    return () => clearInterval(interval);
  }, [id, submission?.status]);

  if (loading && !submission) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading submission details...
      </div>
    );
  }

  if (errorMsg && !submission) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="error-msg">{errorMsg}</div>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Editor
        </Link>
      </div>
    );
  }

  if (!submission) return null;

  const StatusIcon = () => {
    if (submission.status === 'completed' || submission.status === 'success') return <CheckCircle color="var(--success-color)" size={24} />;
    if (submission.status === 'failed' || submission.status === 'error') return <XCircle color="var(--error-color)" size={24} />;
    return <Clock color="var(--text-secondary)" size={24} className="spin-icon" />;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }} title="Back">
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ color: '#fff', margin: 0, flex: 1 }}>{submission.title || `Submission #${submission.id}`}</h1>
        <button 
          onClick={fetchSubmission}
          style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            Status: <StatusIcon /> 
            <span style={{ textTransform: 'capitalize' }}>{submission.status}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', color: 'var(--text-secondary)' }}>
            Language: <span style={{ color: '#fff', textTransform: 'capitalize' }}>{submission.language}</span>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>Code:</h3>
          <pre style={{ backgroundColor: '#0d1117', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
            <code>{submission.code}</code>
          </pre>
        </div>

        {submission.output && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--success-color)' }}>Output:</h3>
            <pre style={{ backgroundColor: '#0d1117', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid var(--success-color)' }}>
              <code>{submission.output}</code>
            </pre>
          </div>
        )}

        {submission.error && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--error-color)' }}>Error:</h3>
            <pre style={{ backgroundColor: '#0d1117', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid var(--error-color)' }}>
              <code>{submission.error}</code>
            </pre>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-icon { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Submission;
