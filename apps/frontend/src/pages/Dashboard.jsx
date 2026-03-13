import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Activity, LogOut, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

// Renderizador recursivo avanzado para Atlassian Document Format (ADF) nativo en React
const renderAdfToJsx = (node, index = 0) => {
    if (!node) return null;
    if (typeof node === 'string') return node;

    if (node.type === 'text') {
        let text = node.text;
        if (node.marks) {
            node.marks.forEach(mark => {
                if (mark.type === 'strong') text = <strong key={'strong' + index}>{text}</strong>;
                if (mark.type === 'em') text = <em key={'em' + index}>{text}</em>;
                if (mark.type === 'link') text = <a key={'link' + index} href={mark.attrs?.href} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{text}</a>;
                if (mark.type === 'code') text = <code key={'code' + index} style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' }}>{text}</code>;
            });
        }
        return <span key={index}>{text}</span>;
    }

    const children = Array.isArray(node.content)
        ? node.content.map((child, i) => renderAdfToJsx(child, `${index}-${i}`))
        : null;

    switch (node.type) {
        case 'paragraph': return <p key={index} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{children}</p>;
        case 'bulletList': return <ul key={index} style={{ paddingLeft: '20px', marginBottom: '8px', listStyleType: 'disc' }}>{children}</ul>;
        case 'orderedList': return <ol key={index} style={{ paddingLeft: '20px', marginBottom: '8px' }}>{children}</ol>;
        case 'listItem': return <li key={index} style={{ marginBottom: '4px' }}>{children}</li>;
        case 'heading':
            const Tag = `h${node.attrs?.level || 3}`;
            return <Tag key={index} style={{ fontWeight: 'bold', margin: '12px 0 8px', color: '#fff' }}>{children}</Tag>;
        case 'codeBlock':
            return <pre key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', overflowX: 'auto', marginBottom: '8px', fontFamily: 'monospace' }}>{children}</pre>;
        case 'rule': return <hr key={index} style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />;
        case 'blockquote': return <blockquote key={index} style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '12px', color: 'var(--text-muted)', margin: '8px 0' }}>{children}</blockquote>;
        case 'mention': return <span key={index} style={{ color: '#3b82f6', fontWeight: '500', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>@{node.attrs?.text || 'usuario'}</span>;
        case 'panel': return <div key={index} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '8px' }}>{children}</div>;
        case 'doc': return <div key={index}>{children}</div>;
        default: return <span key={index}>{children}</span>;
    }
};

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ jiraStatuses: [], errorStatuses: [] });
    const [selectedJiraStatus, setSelectedJiraStatus] = useState('ALL');
    const [selectedError, setSelectedError] = useState('ALL');
    const [ticketIdQuery, setTicketIdQuery] = useState('');

    // Panel states
    const [selectedTicketKey, setSelectedTicketKey] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Estados para la botonera de Scraping
    const [scrappingUuid, setScrappingUuid] = useState('');
    const [showUuidInput, setShowUuidInput] = useState(false);
    const [isScraping, setIsScraping] = useState(false);

    const triggerPartialScrape = async () => {
        if (!scrappingUuid) return alert("Por favor ingresa un Job UUID válido para el análisis.");
        setIsScraping(true);
        try {
            await axios.post('http://localhost:3001/api/scrape/partial', {
                jobUuid: scrappingUuid,
                ticketKey: selectedTicketKey
            });
            alert(`✅ El Robot ha iniciado exitosamente el Scraping Parcial en tu computadora para el UUID:\n${scrappingUuid}\n\nRevisa la nueva ventana de Chromium que se abrirá.`);
        } catch (error) {
            console.error('Error al iniciar web scraping:', error);
            alert('❌ Ocurrió un error al intentar iniciar el robot de scraping.');
        } finally {
            setIsScraping(false);
        }
    };

    const triggerGeneralScrape = async () => {
        setIsScraping(true);
        try {
            await axios.post('http://localhost:3001/api/scrape/general', {
                ticketKey: selectedTicketKey
            });
            alert(`✅ El Robot de Scraping General ha iniciado exitosamente para el Ticket: ${selectedTicketKey}`);
        } catch (error) {
            console.error('Error al iniciar web scraping general:', error);
            alert('❌ Ocurrió un error al intentar iniciar el robot de scraping total.');
        } finally {
            setIsScraping(false);
        }
    };

    const fetchFilters = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/tickets/filters');
            setFilters(data);
        } catch (err) {
            console.error('Error fetching filters', err);
        }
    }, []);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:3001/api/tickets', {
                params: {
                    status: selectedJiraStatus,
                    errorStatus: selectedError,
                    ticketId: ticketIdQuery
                }
            });
            setTickets(data.data);
        } catch (err) {
            console.error('Error fetching tickets', err);
        } finally {
            setLoading(false);
        }
    }, [selectedJiraStatus, selectedError, ticketIdQuery]);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Si hacemos click en "Enter" dentro de text filter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchTickets();
        }
    }

    const getStatusBadge = (status) => {
        const s = status.toUpperCase();
        if (s.includes('TO DO')) return <span className="badge badge-todo"><Clock size={14} /> To Do</span>;
        if (s.includes('IN PROGRESS')) return <span className="badge badge-progress"><RefreshCw size={14} /> In Progress</span>;
        if (s.includes('DONE')) return <span className="badge badge-done"><CheckCircle2 size={14} /> Done</span>;
        return <span className="badge badge-todo">{status}</span>;
    };

    const getErrorBadge = (summary) => {
        if (summary.includes('507')) return <span className="badge badge-error">507 Latency</span>;
        if (summary.includes('253')) return <span className="badge badge-warning" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>253 Partial</span>;
        if (summary.includes('500')) return <span className="badge badge-error">500 Server Error</span>;
        return <span className="badge badge-todo">Other</span>;
    };

    const loadTicketDetails = async (ticketKey) => {
        setSelectedTicketKey(ticketKey);
        setTicketDetails(null);
        setLoadingDetails(true);
        setScrappingUuid('');
        setShowUuidInput(false);
        try {
            const { data } = await axios.get(`http://localhost:3001/api/tickets/${ticketKey}`);
            setTicketDetails(data);
        } catch (err) {
            console.error('Error fetching ticket details', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexShrink: 0 }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Tickets Pendientes</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Visualiza y filtra logs de extracción descargados.</p>
                </div>

                <div className="filters-bar" style={{ marginBottom: 0 }}>
                    <div style={{ width: '220px' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Buscar por ID (Ej. SY-37972)"
                            value={ticketIdQuery}
                            onKeyDown={handleKeyDown}
                            onChange={e => setTicketIdQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <select
                            className="input-field"
                            value={selectedJiraStatus}
                            onChange={e => setSelectedJiraStatus(e.target.value)}
                        >
                            {filters.jiraStatuses.map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '200px' }}>
                        <select
                            className="input-field"
                            value={selectedError}
                            onChange={e => setSelectedError(e.target.value)}
                        >
                            {filters.errorStatuses.map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={fetchTickets}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* CONTENEDOR GRID: Tabla a la Izquierda, Panel a la Derecha */}
            <div style={{
                display: 'flex',
                gap: '24px',
                flex: 1,
                minHeight: 0, /* Important for inner scrolling */
                overflow: 'hidden'
            }}>
                <div className="glass-panel animate-fade-in" style={{
                    animationDelay: '0.1s',
                    flex: selectedTicketKey ? '1' : '1', /* Se contrae al 50% cuando el panel Dcho se abre */
                    transition: 'flex 0.3s ease',
                    overflowY: 'auto',
                    minWidth: '0'
                }}>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Error Type</th>
                                    <th>Status Jira</th>
                                    <th>Resumen Original</th>
                                    <th>Job UUID</th>
                                    <th>Acciones</th>
                                    <th>Creado DB</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 16px' }} />
                                            <p>Cargando tickets desde Jira...</p>
                                        </td>
                                    </tr>
                                ) : tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                            <AlertCircle size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                            <p>No se encontraron tickets con estos filtros.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr
                                            key={ticket.ticketKey}
                                            onClick={() => loadTicketDetails(ticket.ticketKey)}
                                            style={{
                                                cursor: 'pointer',
                                                background: selectedTicketKey === ticket.ticketKey ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                                borderLeft: selectedTicketKey === ticket.ticketKey ? '3px solid #3b82f6' : '3px solid transparent'
                                            }}
                                            className="hover-row"
                                        >
                                            <td style={{ fontWeight: '600', color: 'var(--accent)' }}>{ticket.ticketKey}</td>
                                            <td>{getErrorBadge(ticket.summary)}</td>
                                            <td>{getStatusBadge(ticket.jiraStatus)}</td>
                                            <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ticket.summary}>
                                                {ticket.summary}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                                                {ticket.job_uuid !== 'uuid-no-encontrado' ? ticket.job_uuid : <span style={{ opacity: 0.5 }}>No UUID</span>}
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                                                    {ticket.action_count}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)' }}>
                                                {new Date(ticket.created).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PANEL DERECHO: Detalles del Ticket y Scraping */}
                {selectedTicketKey && (
                    <div className="glass-panel animate-slide-in" style={{
                        flex: '1', minWidth: '0',
                        display: 'flex', flexDirection: 'column',
                        borderLeft: '1px solid rgba(255,255,255,0.05)',
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        {/* Header Panel */}
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{selectedTicketKey}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Detalles y Scraping</p>
                            </div>
                            <button onClick={() => setSelectedTicketKey(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                                ✕
                            </button>
                        </div>

                        {/* Content Panel */}
                        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                            {loadingDetails ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                    <RefreshCw size={24} className="animate-spin" style={{ marginBottom: '16px' }} />
                                    <p>Cargando detalles de Jira...</p>
                                </div>
                            ) : !ticketDetails ? (
                                <div style={{ textAlign: 'center', color: '#ef4444', padding: '24px' }}>Error al cargar detalles</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {/* Info Container */}
                                    <div>
                                        <h4 style={{ color: '#fff', fontWeight: '600', marginBottom: '8px' }}>Resumen</h4>
                                        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{ticketDetails.fields?.summary}</p>

                                        <h4 style={{ color: '#fff', fontWeight: '600', marginBottom: '8px' }}>Descripción Total</h4>
                                        <div style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                                            {ticketDetails.fields?.description ? renderAdfToJsx(ticketDetails.fields.description) : 'Sin descripción en el ticket.'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Estatus Jira</p>
                                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{ticketDetails.fields?.status?.name}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Prioridad</p>
                                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{ticketDetails.fields?.priority?.name || 'Media'}</p>
                                        </div>
                                    </div>

                                    {/* Comentarios */}
                                    <div>
                                        <h4 style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Comentarios ({ticketDetails.fields?.comment?.total || 0})
                                        </h4>
                                        {ticketDetails.fields?.comment?.comments?.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {ticketDetails.fields.comment.comments.map(c => (
                                                    <div key={c.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '500' }}>{c.author?.displayName}</span>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(c.created).toLocaleDateString()}</span>
                                                        </div>
                                                        <div style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                                                            {c.body ? renderAdfToJsx(c.body) : 'Contenido no disponible'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>No hay comentarios.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botonera Inferior (Acciones de Scraping) */}
                        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                            <h4 style={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Acciones de Procesamiento</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {showUuidInput && (
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Ingresa el Job UUID aquí..."
                                        value={scrappingUuid}
                                        onChange={(e) => setScrappingUuid(e.target.value)}
                                        style={{ marginBottom: '4px', fontFamily: 'monospace' }}
                                    />
                                )}
                                <button
                                    className="btn-primary"
                                    style={{ padding: '12px', width: '100%', fontWeight: '600', background: 'var(--accent)', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                    onClick={() => {
                                        if (!showUuidInput) {
                                            setShowUuidInput(true);
                                        } else {
                                            triggerPartialScrape();
                                        }
                                    }}
                                    disabled={isScraping}
                                >
                                    {isScraping && <RefreshCw size={14} className="animate-spin" />}
                                    Análisis Parcial
                                </button>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                            <button
                                style={{
                                    padding: '12px', width: '100%', fontWeight: '600',
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', borderRadius: '8px', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                                }}
                                onClick={triggerGeneralScrape}
                                disabled={isScraping}
                            >
                                {isScraping && <RefreshCw size={14} className="animate-spin" />}
                                Análisis Total
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Small inline spin utility class */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .hover-row:hover { background: rgba(255,255,255,0.02) !important; }
        .animate-slide-in { animation: slideInX 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: right; }
        @keyframes slideInX {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
      `}} />
        </div>
    );
}
