
import { Check, ExternalLink, PlayCircle, BookOpen, Pencil, Trash2 } from 'lucide-react';

interface TaskProgress {
    user: boolean; // Current user completed?
    partner: boolean; // Partner completed?
    userName: string;
    partnerName: string;
}

interface StudyCardProps {
    type: 'reading' | 'devotional' | 'prayer';
    title: string;
    description: string;
    link?: string;
    channelName?: string;
    coverUrl?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    completed: boolean;
    progress: TaskProgress;
    onToggle: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function StudyCard({ type, title, description, link, channelName, coverUrl, scheduledDate, scheduledTime, completed, progress, onToggle, onEdit, onDelete }: StudyCardProps) {
    const getBadge = () => {
        switch (type) {
            case 'reading': return { label: 'LEITURA', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
            case 'devotional': return { label: 'DEVOCIONAL', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
            case 'prayer': return { label: 'ORAÇÃO', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        }
    };

    const badge = getBadge();
    const isYoutube = link?.includes('youtube') || link?.includes('youtu.be');
    const isSpotify = link?.includes('spotify');

    return (
        <div
            onClick={onToggle}
            style={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                marginBottom: '16px',
                border: completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
        >
            <div style={{ display: 'flex' }}>
                {/* Cover Image Section */}
                {coverUrl && (
                    <div style={{
                        width: '120px',
                        minHeight: '140px',
                        position: 'relative'
                    }}>
                        <img
                            src={coverUrl}
                            alt="Capa"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: completed ? 0.6 : 1
                            }}
                        />
                        {/* Play Overlay if video */}
                        {(isYoutube || isSpotify) && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.3)'
                            }}>
                                <PlayCircle size={32} color="white" fill="rgba(0,0,0,0.5)" />
                            </div>
                        )}
                    </div>
                )}

                {/* Content Section */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>

                    {/* Header: Badge & Title */}
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: badge.color,
                                backgroundColor: badge.bg,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                marginBottom: '6px',
                                display: 'inline-block'
                            }}>
                                {badge.label}
                            </span>

                            {/* Checkbox for visual status */}
                            <div style={{
                                width: '24px', height: '24px',
                                borderRadius: '50%',
                                border: completed ? 'none' : '2px solid rgba(255,255,255,0.2)',
                                backgroundColor: completed ? '#10b981' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {completed && <Check size={14} color="white" strokeWidth={3} />}
                            </div>
                        </div>

                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: completed ? '#94a3b8' : 'white',
                            marginBottom: '4px',
                            lineHeight: 1.3
                        }}>
                            {title}
                        </h3>

                        {/* Date and Description */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                            {description && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <BookOpen size={14} />
                                    <span>{description}</span>
                                </div>
                            )}
                            {(scheduledDate || scheduledTime) && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '0.8rem', color: '#eab308', fontWeight: 500
                                }}>
                                    <span>📅</span>
                                    <span>
                                        {scheduledDate && new Date(scheduledDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                        {scheduledDate && scheduledTime && ' às '}
                                        {scheduledTime}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info: Channel & Buttons */}
                    <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        {channelName && (
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#64748b',
                                marginBottom: '8px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <span>Por:</span>
                                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{channelName}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {/* Link Button */}
                            {link && (
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        fontSize: '0.8rem',
                                        color: isYoutube ? '#ef4444' : isSpotify ? '#1db954' : '#3b82f6',
                                        textDecoration: 'none',
                                        padding: '6px 12px',
                                        backgroundColor: isYoutube ? 'rgba(239, 68, 68, 0.1)' : isSpotify ? 'rgba(29, 185, 84, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span>{isYoutube ? 'Assistir' : isSpotify ? 'Ouvir' : 'Abrir'}</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '4px', marginLeft: link ? '0' : '0' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }}
                                    style={{
                                        background: 'transparent', border: 'none',
                                        padding: '6px', borderRadius: '6px',
                                        color: '#64748b', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    className="action-btn"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Tem certeza que deseja excluir?')) onDelete && onDelete();
                                    }}
                                    style={{
                                        background: 'transparent', border: 'none',
                                        padding: '6px', borderRadius: '6px',
                                        color: '#ef4444', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    className="action-btn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar (Subtle bottom border for progress) */}
            <div style={{
                height: '3px',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                marginTop: '0'
            }}>
                <div style={{
                    height: '100%',
                    width: completed ? '100%' : '0%', // Simplified for now
                    backgroundColor: badge.color,
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
}
