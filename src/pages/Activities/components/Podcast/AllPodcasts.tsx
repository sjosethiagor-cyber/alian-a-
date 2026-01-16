import { useState } from 'react';
import { ArrowLeft, Clock, PlayCircle, Search, Filter } from 'lucide-react';
import { type ActivityItem } from '../../../../services/activityService';

interface AllPodcastsProps {
    items: ActivityItem[];
    onBack: () => void;
}

const THEMES = [
    { id: 'all', label: 'Todos' },
    { id: 'financas', label: 'Finanças' },
    { id: 'saude', label: 'Saúde' },
    { id: 'comunicacao', label: 'Comunicação' },
    { id: 'espiritualidade', label: 'Espiritualidade' },
    { id: 'lazer', label: 'Lazer' },
];

export default function AllPodcasts({ items, onBack }: AllPodcastsProps) {
    const [search, setSearch] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('all');

    const filteredItems = items.filter(item => {
        const meta = item.meta ? JSON.parse(item.meta) : {};
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesTheme = selectedTheme === 'all' || meta.theme === selectedTheme;
        return matchesSearch && matchesTheme;
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none', border: 'none', color: 'white', cursor: 'pointer',
                        padding: '8px', marginLeft: '-8px'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Todos os Episódios</h2>
            </div>

            {/* Search Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px'
            }}>
                <Search size={20} color="#64748b" />
                <input
                    type="text"
                    placeholder="Buscar episódios..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        background: 'none', border: 'none', color: 'white',
                        flex: 1, fontSize: '1rem', outline: 'none'
                    }}
                />
            </div>

            {/* Theme Filters */}
            <div style={{
                display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '24px',
                scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
                {THEMES.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${selectedTheme === theme.id ? '#3b82f6' : 'rgba(255,255,255,0.1)'} `,
                            backgroundColor: selectedTheme === theme.id ? 'rgba(59, 130, 246, 0.1)' : '#1e293b',
                            color: selectedTheme === theme.id ? '#60a5fa' : '#94a3b8',
                            fontSize: '0.9rem', fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    >
                        {theme.label}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#94a3b8' }}>
                {filteredItems.length} {filteredItems.length === 1 ? 'episódio encontrado' : 'episódios encontrados'}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                {filteredItems.map(item => {
                    const meta = item.meta ? JSON.parse(item.meta) : {};

                    return (
                        <div key={item.id} style={{
                            backgroundColor: '#1e293b',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            {/* Cover - Changed to Video Aspect Ratio if needed, or stick to square but better */}
                            {/* Using 16:9 for better video thumbnail support */}
                            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                                <img
                                    src={meta.coverUrl || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80'}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop';
                                    }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, // Hover effect could go here, but for mobile stick to visible play button
                                }}>

                                </div>
                                <div style={{
                                    position: 'absolute', bottom: '8px', right: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px',
                                    fontSize: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    <Clock size={12} />
                                    <span>{meta.duration || '0min'}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{
                                        backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa',
                                        fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        EP. {meta.episode || '01'}
                                    </span>
                                    {meta.theme && (
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                                            {THEMES.find(t => t.id === meta.theme)?.label || meta.theme}
                                        </span>
                                    )}
                                </div>

                                <h3 style={{
                                    fontSize: '0.95rem', fontWeight: 600, color: 'white', margin: 0,
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    lineHeight: '1.4'
                                }}>
                                    {item.name}
                                </h3>

                                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                    <button style={{
                                        width: '100%',
                                        padding: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        color: '#3b82f6',
                                        fontSize: '0.85rem', fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}>
                                        <PlayCircle size={16} />
                                        Ouvir Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <Filter size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nenhum episódio encontrado</p>
                    <p style={{ fontSize: '0.9rem' }}>Tente buscar por outro termo ou categoria.</p>
                </div>
            )}
        </div>
    );
}
