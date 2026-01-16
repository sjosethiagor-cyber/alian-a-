import { BookOpen } from 'lucide-react';

export default function PrayerHero() {
    return (
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
                    <span>Hoje</span>
                </div>

                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px',
                    fontFamily: 'serif',
                    letterSpacing: '-0.02em'
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
                    "Senhor, ensina-nos a contar os nossos dias, para que alcancemos coração sábio. Guia nossos passos no caminho..."
                </p>

                <button style={{
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
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
                }}>
                    <BookOpen size={18} />
                    Ler oração completa
                </button>
            </div>
        </div>
    );
}
