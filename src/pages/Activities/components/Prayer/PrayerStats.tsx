
export default function PrayerStats({ total, completed }: { total: number, completed: number }) {
    // Determine current day of week (0 = Sunday, 1 = Monday, etc.)
    const todayIndex = new Date().getDay();

    // Calculate percentage for today
    const todayProgress = total > 0 ? completed / total : 0;

    // Generate weekly data (mock past days, real today)
    // In a real app, this would come from historical data
    const weeklyData = [0.3, 0.4, 0.5, 0.2, 0.6, 0.4, 0.5]; // mock background
    weeklyData[todayIndex] = todayProgress; // Override today

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
                    background: `conic-gradient(#3b82f6 ${(completed / Math.max(total, 1)) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
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
                                height: `${Math.max(val * 100, 4)}%`, // Ensure minimum visibility
                                backgroundColor: i === todayIndex ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                transition: 'height 0.3s ease'
                            }} />
                            <span style={{
                                fontSize: '0.7rem',
                                color: i === todayIndex ? '#3b82f6' : '#64748b',
                                fontWeight: i === todayIndex ? 700 : 400
                            }}>{days[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
