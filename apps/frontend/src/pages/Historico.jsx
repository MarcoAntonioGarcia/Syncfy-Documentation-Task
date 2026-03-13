import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Historico() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('Semana'); // Enum: Día, Semana, Mes

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:3001/api/stats/historical');
            setStats(data);
        } catch (err) {
            console.error(err);
            // Fallback a datos estáticos si el enpoint de DB no existe todavía
            setStats([
                { date: 'Lun 09', assigned: 15, closed: 5 },
                { date: 'Mar 10', assigned: 20, closed: 12 },
                { date: 'Mie 11', assigned: 18, closed: 10 },
                { date: 'Jue 12', assigned: 22, closed: 15 },
                { date: 'Vie 13', assigned: 10, closed: 8 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Agrupar datos basados en timeFilter
    const getGroupedStats = () => {
        const safeStats = Array.isArray(stats) ? stats : [];
        if (timeFilter === 'Día') return safeStats;

        const grouped = {};
        safeStats.forEach(st => {
            const d = new Date(st.fechaOriginal || st.date); // Necesitamos la fecha real
            let key = '';
            let label = '';

            if (timeFilter === 'Semana') {
                // Lógica simple para año-semana
                const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
                const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
                const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                key = `${d.getFullYear()}-W${weekNum}`;
                label = `Sem ${weekNum}`;
            } else if (timeFilter === 'Mes') {
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                key = `${d.getFullYear()}-${d.getMonth()}`;
                label = `${months[d.getMonth()]} ${d.getFullYear()}`;
            }

            if (!grouped[key]) {
                grouped[key] = { date: label, assigned: 0, closed: 0, totalBacklog: 0 };
            }
            grouped[key].assigned += st.assigned;
            grouped[key].closed += st.closed;
            // Para totalBacklog, en agrupaciones por semana/mes mostraremos el máximo alcanzado para representar el volumen total
            if (st.totalBacklog > grouped[key].totalBacklog) {
                grouped[key].totalBacklog = st.totalBacklog;
            }
        });

        return Object.values(grouped);
    };

    const displayStats = getGroupedStats();

    const totalAssigned = displayStats.reduce((acc, curr) => acc + curr.assigned, 0);
    const totalClosed = displayStats.reduce((acc, curr) => acc + (curr.closed || 0), 0);
    // Para el KPI Global podemos calcular el Backlog promedio o usar el último registrado
    const safeStats = Array.isArray(stats) ? stats : [];
    const lastBacklog = safeStats.length > 0 ? safeStats[safeStats.length - 1].totalBacklog : 0;
    const successRate = totalAssigned > 0 ? Math.round((totalClosed / totalAssigned) * 100) : 0;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Historial de Desempeño</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Métricas visuales de tareas ingresadas vs tareas finalizadas.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select
                        className="input-field"
                        style={{ width: '150px' }}
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="Día">Vista por Día</option>
                        <option value="Semana">Vista por Semana</option>
                        <option value="Mes">Vista por Mes</option>
                    </select>
                    <button className="btn-primary" style={{ width: 'auto', display: 'flex', gap: '8px' }} onClick={fetchStats}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Tasa de Éxito Global</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: successRate > 50 ? '#10b981' : '#f59e0b' }}>
                        {successRate}%
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Backlog (Atrazadas Vivas)</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#ef4444' }}>
                        {lastBacklog || 0}
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Nuevas (Rango Actual)</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#3b82f6' }}>
                        {totalAssigned}
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Finalizadas (DONE)</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>
                        {totalClosed}
                    </div>
                </div>
            </div>

            {/* Recharts Graph */}
            <div className="glass-panel" style={{ padding: '32px 24px', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayStats}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barGap={-40} // Esto sobrepone las barras exactamete si barSize es ~40
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />

                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        {/* LINEA / DATO FANTASMA */}
                        <Bar dataKey="totalBacklog" fill="transparent" barSize={0} />

                        {/* BARRA AZUL (Fondo - Asignadas/Nuevas Totales) */}
                        <Bar
                            dataKey="assigned"
                            name="Nuevas (Solo Hoy)"
                            fill="rgba(59, 130, 246, 0.4)"
                            barSize={40}
                            radius={[4, 4, 0, 0]}
                            label={{ position: 'top', fill: '#94a3b8', fontSize: 12, formatter: (val, name, props) => `Totales: ${props?.payload?.totalBacklog || val}` }}
                        />
                        {/* BARRA VERDE (Frente - Cerradas) */}
                        <Bar
                            dataKey="closed"
                            name="Cerradas Específicas Hoy"
                            fill="rgba(16, 185, 129, 0.9)"
                            barSize={40}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
        </div>
    );
}
