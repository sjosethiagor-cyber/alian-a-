import { useState } from 'react';
import { BookOpen, X, Share2, Heart } from 'lucide-react';

const DAILY_PRAYER = {
    date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
    title: "Oração por Sabedoria e Direção",
    preview: "Senhor, ensina-nos a contar os nossos dias, para que alcancemos coração sábio. Guia nossos passos no caminho...",
    fullText: `
        <p>Senhor Deus, Pai de infinita bondade,</p>

        <p>Hoje me coloco diante da Tua presença buscando sabedoria. Tua Palavra diz que se alguém precisa de sabedoria, peça a Ti, que a todos dá liberalmente.</p>

        <p>Ensina-me, Senhor, a contar os meus dias, para que eu alcance um coração sábio. Ajuda-me a priorizar o que é eterno e a não me deixar levar pelas ansiedades passageiras deste mundo.</p>

        <p>Guia meus passos em cada decisão que eu precisar tomar hoje. Que eu não me desvie nem para a direita nem para a esquerda, mas que meus olhos estejam firmes em Tua vontade.</p>

        <p>Derrama Tua paz sobre minha mente e guarda meu coração. Que em tudo o que eu fizer, Teu nome seja glorificado.</p>

        <p>Em nome de Jesus, amém.</p>
    `,
    verse: "Ensina-nos a contar os nossos dias para que o nosso coração alcance sabedoria. (Salmos 90:12)"
};

export default function PrayerHero() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/10',
                maxHeight: '300px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '4px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}>
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=2070&auto=format&fit=crop"
                    alt="Sunrise"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Overlay Gradient */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.4))'
                }} />

                {/* Content */}
                <div style={{
                    position: 'absolute', inset: 0,
                    padding: '24px',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'white',
                        marginBottom: '12px',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        <span>📅</span>
                        <span style={{ textTransform: 'capitalize' }}>{DAILY_PRAYER.date}</span>
                    </div>

                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '8px',
                        fontFamily: 'serif',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                    }}>
                        Oração do Dia
                    </h2>

                    <p style={{
                        color: '#e2e8f0',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginBottom: '20px',
                        opacity: 0.9,
                        maxWidth: '90%'
                    }}>
                        "{DAILY_PRAYER.preview}"
                    </p>

                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '14px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                            transition: 'transform 0.1s',
                        }}
                    >
                        <BookOpen size={18} />
                        Ler oração completa
                    </button>
                </div>
            </div>

            {/* Prayer Modal */}
            {isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        width: '100%', maxWidth: '500px',
                        maxHeight: '90vh',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Background Decoration */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '150px',
                            background: 'linear-gradient(180deg, rgba(59,130,246,0.1) 0%, transparent 100%)',
                            pointerEvents: 'none'
                        }} />

                        {/* Header */}
                        <div style={{
                            padding: '24px', paddingBottom: '16px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            position: 'relative'
                        }}>
                            <div>
                                <span style={{
                                    textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700,
                                    color: '#3b82f6', letterSpacing: '0.05em', marginBottom: '8px', display: 'block'
                                }}>
                                    {DAILY_PRAYER.date}
                                </span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                                    {DAILY_PRAYER.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
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
                            padding: '0 24px 24px 24px',
                            overflowY: 'auto',
                            color: '#e2e8f0',
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                            fontFamily: 'serif'
                        }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: DAILY_PRAYER.fullText }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                            />

                            <div style={{
                                marginTop: '32px',
                                padding: '16px',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '12px',
                                borderLeft: '3px solid #3b82f6',
                                fontStyle: 'italic',
                                color: '#93c5fd',
                                fontSize: '0.9rem',
                                fontFamily: 'sans-serif'
                            }}>
                                {DAILY_PRAYER.verse}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            backgroundColor: '#0f172a',
                            display: 'flex', gap: '12px'
                        }}>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#1e293b',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <Share2 size={18} />
                                Compartilhar
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <Heart size={18} />
                                Amém
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}
