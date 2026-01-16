import { Play, Plus } from 'lucide-react';
import { type ActivityItem } from '../../../../services/activityService';

interface PodcastPlayerProps {
    podcast?: ActivityItem | null;
    onAdd?: () => void;
}

export default function PodcastPlayer({ podcast, onAdd }: PodcastPlayerProps) {
    const meta = podcast?.meta ? JSON.parse(podcast.meta) : {};

    return (
        <section style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                    Ouvindo Agora
                </h3>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#60a5fa',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '0.85rem', fontWeight: 600
                        }}
                    >
                        <Plus size={16} /> Adicionar
                    </button>
                )}
            </div>

            <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {podcast ? (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {/* Info */}
                        <div style={{ flex: 1, zIndex: 1 }}>
                            <span style={{
                                color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block'
                            }}>
                                Episódio {meta.episode || '1'}
                            </span>
                            <h2 style={{
                                color: 'white', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px',
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                            }}>
                                {podcast.name}
                            </h2>
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                {meta.duration || '0 min'} • {meta.theme || 'Geral'}
                            </span>

                            {/* Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
                                <button style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    backgroundColor: '#3b82f6', border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                                }}>
                                    <Play size={24} fill="white" />
                                </button>

                                {/* Progress Bar Mock */}
                                <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                                    <div style={{
                                        width: '10%', height: '100%',
                                        backgroundColor: '#3b82f6', borderRadius: '2px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)',
                                            width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cover Art */}
                        <div style={{
                            width: '100px', height: '140px',
                            borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                            backgroundColor: '#0f172a'
                        }}>
                            <img
                                src={meta.coverUrl || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2070&auto=format&fit=crop"}
                                alt="Cover"
                                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2070&auto=format&fit=crop" }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                        <p>Nenhum podcast adicionado ainda.</p>
                        {onAdd && <button onClick={onAdd} style={{ marginTop: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clique para adicionar</button>}
                    </div>
                )}
            </div>
        </section>
    );
}
