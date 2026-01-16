
export default function PrayerStats({ total, completed }: { total: number, completed: number }) {
    // Generate mock weekly data
    const weeklyData = [0.4, 0.7, 0.3, 0.8, 0.6, 0.2, 0.5]; // percentage
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
        <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Progresso Diário</h4>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>
                        {completed}/{total} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>orações</span>
                    </div>
                </div>
                <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '50%',
                    background: `conic-gradient(#3b82f6 ${(completed / total) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#1e293b', borderRadius: '50%' }} />
                </div>
            </div>

            {/* Weekly Bar Chart */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', gap: '8px' }}>
                    {weeklyData.map((val, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '100%',
                                height: `${val * 100}%`,
                                backgroundColor: i === 3 ? '#3b82f6' : 'rgba(255,255,255,0.1)', // Highlight "Today" (Wed/Thu) mock
                                borderRadius: '4px',
                                minHeight: '4px'
                            }} />
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{days[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
