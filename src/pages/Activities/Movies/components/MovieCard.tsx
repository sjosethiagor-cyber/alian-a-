import { User, Star, Trash2 } from 'lucide-react';
import { type ActivityItem } from '../../../../services/activityService';

interface MovieMeta {
    year?: string;
    genre?: string;
    rating?: string;
    posterUrl?: string; // Optional: URL to an image
    providers?: { provider_name: string; logo_path: string }[];
    mediaType?: 'movie' | 'tv';
}

interface MovieCardProps {
    item: ActivityItem;
    onToggle: (id: string, current: boolean) => void;
    onDelete?: (id: string) => void;
}

export default function MovieCard({ item, onToggle, onDelete }: MovieCardProps) {
    let meta: MovieMeta = {};
    try {
        meta = item.meta ? JSON.parse(item.meta) : {};
    } catch {
        // Fallback if meta is just a string or invalid JSON
        meta = { genre: item.meta };
    }

    return (
        <div className={`movie-card ${item.completed ? 'completed' : ''}`}>
            {/* Poster or Placeholder */}
            {meta.posterUrl ? (
                <img src={meta.posterUrl} alt={item.name} className="movie-poster" />
            ) : (
                <div className="movie-poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' }}>
                    <span style={{ fontSize: '2rem' }}>🎬</span>
                </div>
            )}

            <div className="movie-info">
                <span className="movie-title">{item.name}</span>

                <div className="movie-meta">
                    {meta.mediaType && (
                        <span style={{
                            fontSize: '0.6rem',
                            padding: '1px 4px',
                            borderRadius: '3px',
                            backgroundColor: meta.mediaType === 'tv' ? '#8b5cf6' : '#3b82f6',
                            color: 'white',
                            marginRight: '6px'
                        }}>
                            {meta.mediaType === 'tv' ? 'Série' : 'Filme'}
                        </span>
                    )}
                    {meta.rating && (
                        <span className="rating-badge">{meta.rating}</span>
                    )}
                    {meta.year && <span>{meta.year}</span>}
                    {meta.year && meta.genre && <span>•</span>}
                    {meta.genre && <span>{meta.genre}</span>}
                </div>

                {meta.providers && meta.providers.length > 0 && (
                    <div className="movie-providers" style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {meta.providers.slice(0, 3).map((p, i) => (
                            <img
                                key={i}
                                src={`https://image.tmdb.org/t/p/w500${p.logo_path}`}
                                alt={p.provider_name}
                                title={p.provider_name}
                                style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                            />
                        ))}
                        {meta.providers.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', alignSelf: 'center' }}>+{meta.providers.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="added-by">
                    <User size={12} />
                    <span>Adicionado por...</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div
                    className={`movie-check ${item.completed ? 'checked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(item.id, item.completed);
                    }}
                >
                    {item.completed && <Star size={14} fill="white" />}
                </div>

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Tem certeza que deseja excluir?')) {
                                onDelete(item.id);
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            opacity: 0.6,
                            padding: '4px'
                        }}
                        className="delete-btn-hover"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
