import { ChevronRight, GraduationCap, Brain, Lightbulb } from 'lucide-react';

const RESOURCES = [
    { id: 1, title: '5 Passos para a oração', type: 'Leitura', duration: '4 min', icon: GraduationCap, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { id: 2, title: 'Inteligência Espiritual', type: 'Artigo', duration: '7 min', icon: Brain, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { id: 3, title: 'Dicas para não se distrair', type: 'Guia Rápido', duration: '2 min', icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
];

export default function ResourceList() {
    return (
        <section style={{ margin: '24px 0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>Conteúdos Educativos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {RESOURCES.map(item => (
                    <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#1e293b',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                borderRadius: '12px',
                                backgroundColor: item.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: item.color
                            }}>
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</h4>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.type} • {item.duration}</span>
                            </div>
                        </div>
                        <ChevronRight size={20} color="#64748b" />
                    </div>
                ))}
            </div>
        </section>
    );
}
