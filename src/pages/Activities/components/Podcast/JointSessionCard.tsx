import { Calendar } from 'lucide-react';

interface JointSessionCardProps {
    date?: string;
    time?: string;
}

export default function JointSessionCard({ date, time }: JointSessionCardProps) {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Não agendado';
        // Create date object and adjust for timezone if necessary, or just parse simple string
        // Since input is YYYY-MM-DD, taking it as local is tricky without time.
        // Let's split it to be safe and avoid timezone issues.
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>
                Sessão Conjunta
            </h3>

            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#172554', // Dark blue
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#3b82f6'
                    }}>
                        <Calendar size={24} />
                    </div>

                    <div>
                        <span style={{
                            color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            {date ? 'Próxima Sessão' : 'Sem Agendamento'}
                        </span>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px', textTransform: 'capitalize' }}>
                            {date ? `${formatDate(date)}${time ? ` às ${time}` : ''}` : '---'}
                        </h4>
                    </div>
                </div>

                <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                }}>
                    Alterar
                </button>
            </div>
        </section>
    );
}
