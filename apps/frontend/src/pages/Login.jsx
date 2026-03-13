import { useState } from 'react';
import { Activity } from 'lucide-react';
import axios from 'axios';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:3001/api/auth/login', { username, password });
            onLogin(data.token);
        } catch (err) {
            setError(err.response?.data?.error || 'Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <div className="glass-panel auth-card animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItem: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', marginBottom: '16px' }}>
                        <Activity size={32} style={{ marginTop: '12px' }} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Syncfy Auto-Triage</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Inicia sesión para gestionar soporte nivel 1</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>Usuario Jira</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ej. marco.garcia@paybook.me"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>Contraseña o Token</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Autenticando...' : 'Ingresar al Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
