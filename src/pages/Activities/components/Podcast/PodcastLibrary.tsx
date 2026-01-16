

const CATEGORIES = [
    {
        id: 1, title: 'Finanças',
        icon: '🐷',
        color: '#f59e0b',
        bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 2, title: 'Saúde e Bem-estar',
        icon: '🧘',
        color: '#10b981',
        bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 3, title: 'Comunicação',
        icon: '💬',
        color: '#3b82f6',
        bg: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop'
    },
];

interface PodcastLibraryProps {
    onViewAll?: () => void;
}

export default function PodcastLibrary({ onViewAll }: PodcastLibraryProps) {
    return (
        <section style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Biblioteca</h3>
                <span
                    onClick={onViewAll}
                    style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                    Ver todos
                </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {CATEGORIES.map(category => (
                    <div key={category.id} style={{
                        minWidth: '120px',
                        height: '120px',
                        borderRadius: '20px',
                        backgroundColor: '#1e293b',
                        padding: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Background Image with Overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${category.image})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            opacity: 0.4
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(15, 23, 42, 0.4)'
                        }} />

                        {/* Icon Box */}
                        <div style={{
                            width: '48px', height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem',
                            zIndex: 1,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}>
                            {category.icon}
                        </div>
                        <span style={{
                            color: 'white', fontSize: '0.85rem', fontWeight: 600,
                            zIndex: 1, textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            {category.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
