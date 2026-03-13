import { useState, useEffect } from 'react';
import { Database, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function DatabaseViewer() {
    const [dbData, setDbData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('tickets');
    const [selectedLog, setSelectedLog] = useState(null); // Para el Modal

    useEffect(() => {
        fetchDbDump();
    }, []);

    const fetchDbDump = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/debug/db', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al obtener el volcado de la base de datos');

            const result = await response.json();
            setDbData(result.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'tickets', label: 'Tickets', icon: <FileText size={18} /> },
        { id: 'job_logs', label: 'Logs Extraídos', icon: <Database size={18} /> },
        { id: 'historical_stats', label: 'Estadísticas', icon: <CheckCircle2 size={18} /> },
        { id: 'ticket_actions', label: 'Acciones', icon: <AlertCircle size={18} /> },
    ];

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '40px' }}>Cargando datos en vivo de MySQL...</div>;
    if (error) return <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '40px' }}>{error}</div>;
    if (!dbData) return null;

    const currentData = dbData[activeTab].records || [];
    const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Database size={28} color="#3b82f6" />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Administrador de Base de Datos</h1>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                            border: `1px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                            color: activeTab === tab.id ? '#3b82f6' : 'var(--text-muted)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                        <span style={{
                            backgroundColor: activeTab === tab.id ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            marginLeft: '8px'
                        }}>
                            {dbData[tab.id].count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                overflowX: 'auto',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid var(--glass-border)' }}>
                            {columns.map(col => (
                                <th key={col} style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'capitalize', fontSize: '13px', letterSpacing: '0.05em' }}>
                                    {col.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay registros en esta tabla.
                                </td>
                            </tr>
                        ) : (
                            currentData.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    {columns.map(col => (
                                        <td key={col} style={{ padding: '16px', fontSize: '14px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {col === 'console_log_content' ? (
                                                <button
                                                    onClick={() => setSelectedLog(row[col])}
                                                    style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                                                >
                                                    Visualizar Log Completo ({Math.floor(String(row[col] || '').length / 1024)} KB)
                                                </button>
                                            ) : (
                                                String(row[col])
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para ver Log Crudo completo */}
            {selectedLog && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ backgroundColor: '#0f172a', border: '1px solid var(--glass-border)', borderRadius: '12px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} color="#3b82f6" /> Raw Console Log Content</h3>
                            <button onClick={() => setSelectedLog(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px', padding: '0 8px' }}>&times;</button>
                        </div>
                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#020617' }}>
                            <pre style={{ color: '#a5b4fc', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                                {selectedLog}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
