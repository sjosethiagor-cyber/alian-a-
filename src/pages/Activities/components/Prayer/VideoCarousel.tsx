import { useState, useEffect } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { activityService } from '../../../../services/activityService';

interface VideoCarouselProps {
    onAdd?: () => void;
    refreshTrigger?: number;
}

export default function VideoCarousel({ onAdd, refreshTrigger = 0 }: VideoCarouselProps) {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVideos();
    }, [refreshTrigger]);

    const loadVideos = async () => {
        try {
            const items = await activityService.getItems('prayer_video');
            const formatted = items.map(item => {
                let meta: any = {};
                try {
                    meta = JSON.parse(item.meta || '{}');
                } catch { }

                return {
                    id: item.id,
                    title: item.name,
                    duration: meta.duration || '??:??',
                    series: meta.series || 'Geral',
                    link: meta.youtubeUrl || '',
                    thumb: meta.posterUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' // fallback
                };
            });
            setVideos(formatted);
        } catch (error) {
            console.error('Failed to load videos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (link: string) => {
        if (link) window.open(link, '_blank');
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Remover este vídeo?')) {
            try {
                await activityService.deleteItem(id);
                loadVideos(); // Refresh list
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir');
            }
        }
    };

    return (
        <section style={{ margin: '24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Vídeos de Ensino</h3>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            style={{
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                color: '#3b82f6',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px', height: '24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Plus size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                margin: '0 -20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {loading ? (
                    <span style={{ color: '#64748b', fontSize: '0.9rem', padding: '10px' }}>Carregando vídeos...</span>
                ) : videos.length === 0 ? (
                    <div
                        onClick={onAdd}
                        style={{
                            minWidth: '240px',
                            height: '135px',
                            borderRadius: '12px',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#94a3b8', gap: '8px'
                        }}
                    >
                        <Plus size={24} />
                        <span style={{ fontSize: '0.9rem' }}>Adicionar Vídeo</span>
                    </div>
                ) : (
                    videos.map(video => (
                        <div key={video.id}
                            onClick={() => handleVideoClick(video.link)}
                            style={{
                                minWidth: '240px',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                backgroundColor: '#1e293b'
                            }}>
                                <img src={video.thumb} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(4px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Play size={20} fill="white" color="white" />
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDelete(video.id, e)}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                                        color: 'white',
                                        width: '24px', height: '24px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>

                                <span style={{
                                    position: 'absolute', bottom: '8px', right: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}>{video.duration}</span>
                            </div>
                            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px', lineHeight: 1.3 }}>{video.title}</h4>
                            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Série: {video.series}</span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
