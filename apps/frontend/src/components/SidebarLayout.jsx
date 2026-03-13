import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, BarChart3, LogOut } from 'lucide-react';

export default function SidebarLayout({ children, onLogout }) {
    const location = useLocation();

    const isCurrent = (path) => location.pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* Sidebar Fijo */}
            <aside style={{
                width: '260px',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 0'
            }}>
                <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <Activity size={28} color="#3b82f6" />
                    <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em', color: 'white' }}>Syncfy Triage</h1>
                </div>

                <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                        to="/dashboard"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                            textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s',
                            backgroundColor: isCurrent('/dashboard') ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            color: isCurrent('/dashboard') ? '#3b82f6' : 'var(--text-muted)'
                        }}
                    >
                        <LayoutDashboard size={20} />
                        TAREAS
                    </Link>
                    <Link
                        to="/historico"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                            textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s',
                            backgroundColor: isCurrent('/historico') ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            color: isCurrent('/historico') ? '#3b82f6' : 'var(--text-muted)'
                        }}
                    >
                        <BarChart3 size={20} />
                        HISTORIAL
                    </Link>
                </nav>

                <div style={{ padding: '0 16px' }}>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); onLogout(); }}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', fontWeight: '500', transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', flex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
