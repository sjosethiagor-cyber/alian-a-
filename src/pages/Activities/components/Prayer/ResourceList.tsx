import { useState } from 'react';
import { ChevronRight, GraduationCap, Brain, Lightbulb, X, Clock } from 'lucide-react';

const RESOURCES = [
    {
        id: 1,
        title: '5 Passos para a oração',
        type: 'Leitura',
        duration: '4 min',
        icon: GraduationCap,
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.15)',
        content: `
            <h3>1. Adoração</h3>
            <p>Comece exaltando quem Deus é. Reconheça Sua grandeza, poder e amor. "Pai nosso que estás nos céus, santificado seja o Teu nome".</p>
            
            <h3>2. Confissão</h3>
            <p>Arrependa-se de pecados conhecidos e desconhecidos. A confissão remove barreiras entre você e Deus.</p>
            
            <h3>3. Gratidão</h3>
            <p>Agradeça pelo que Ele fez, pelo que Ele é e até mesmo pelo que Ele não permitiu que acontecesse. A gratidão abre as portas do céu.</p>
            
            <h3>4. Súplica</h3>
            <p>Apresente seus pedidos. Seja específico. Deus ama ouvir a voz de seus filhos pedindo com fé.</p>
            
            <h3>5. Entrega</h3>
            <p>Termine confiando o resultado a Ele. "Seja feita a Tua vontade". Descanse na certeza de que Ele ouviu.</p>
        `
    },
    {
        id: 2,
        title: 'Inteligência Espiritual',
        type: 'Artigo',
        duration: '7 min',
        icon: Brain,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        content: `
            <p>A Inteligência Espiritual (QS) vai além do QI e da Inteligência Emocional. É a capacidade de acessar significados profundos, valores fundamentais e propósitos maiores.</p>
            <p>Na oração, não estamos apenas pedindo coisas; estamos alinhando nossa mente finita com a Mente Infinita de Deus.</p>
            <p>Estudos mostram que a prática regular da oração e meditação na Palavra altera fisicamente o cérebro, aumentando a densidade no córtex pré-frontal, área responsável pela tomada de decisões sábias e controle de impulsos.</p>
            <p>Desenvolver inteligência espiritual significa aprender a ver as situações da vida através das lentes da eternidade.</p>
        `
    },
    {
        id: 3,
        title: 'Dicas para não se distrair',
        type: 'Guia Rápido',
        duration: '2 min',
        icon: Lightbulb,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
        content: `
            <ul>
                <li><strong>Modo Avião:</strong> O celular é o maior ladrão de atenção. Deixe-o em outro cômodo ou em modo avião.</li>
                <li><strong>Lugar Secreto:</strong> Tenha um local específico e consistente para orar. Seu cérebro vai associar esse lugar ao foco espiritual.</li>
                <li><strong>Escreva:</strong> Mantenha um diário de oração. Escrever mantém sua mente engajada e evita que pensamentos aleatórios dominem.</li>
                <li><strong>Fale em Voz Alta:</strong> Orar sussurrando ou falando ajuda a concretizar os pensamentos e manter o foco.</li>
            </ul>
        `
    },
];

export default function ResourceList() {
    const [selectedResource, setSelectedResource] = useState<typeof RESOURCES[0] | null>(null);

    return (
        <>
            <section style={{ margin: '24px 0' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>Conteúdos Educativos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {RESOURCES.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedResource(item)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#1e293b',
                                borderRadius: '16px',
                                padding: '16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                        >
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

            {/* Reading Modal */}
            {selectedResource && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        width: '100%', maxWidth: '500px',
                        maxHeight: '85vh',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            backgroundColor: '#0f172a'
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '4px 10px', borderRadius: '20px',
                                    backgroundColor: selectedResource.bg, color: selectedResource.color,
                                    fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px'
                                }}>
                                    <selectedResource.icon size={14} />
                                    <span>{selectedResource.type}</span>
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                                    {selectedResource.title}
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                    <Clock size={14} />
                                    <span>Tempo de leitura: {selectedResource.duration}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedResource(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: 'none',
                                    color: 'white', borderRadius: '50%',
                                    width: '32px', height: '32px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{
                            padding: '24px',
                            overflowY: 'auto',
                            color: '#e2e8f0',
                            lineHeight: 1.7,
                            fontSize: '1rem'
                        }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: selectedResource.content }}
                                className="prose-content"
                                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                            />
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            backgroundColor: '#0f172a',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={() => setSelectedResource(null)}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Concluir Leitura
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .prose-content h3 {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-top: 8px;
                    margin-bottom: 4px;
                }
                .prose-content ul {
                    padding-left: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .prose-content strong {
                    color: white;
                }
            `}</style>
        </>
    );
}
