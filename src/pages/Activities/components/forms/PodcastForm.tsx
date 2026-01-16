import { Mic, Clock, Hash, Image as ImageIcon, Layers, Link } from 'lucide-react';
import { type ActivityFormData } from '../AddActivityModal';

interface PodcastFormProps {
    data: ActivityFormData;
    onUpdate: (updates: Partial<ActivityFormData>) => void;
}

const THEMES = [
    { id: 'financas', label: 'Finanças', icon: '🐷' },
    { id: 'saude', label: 'Saúde e Bem-estar', icon: '🧘' },
    { id: 'comunicacao', label: 'Comunicação', icon: '💬' },
    { id: 'espiritualidade', label: 'Espiritualidade', icon: '🙏' },
    { id: 'lazer', label: 'Lazer e Hobbies', icon: '🎨' },
];

export default function PodcastForm({ data, onUpdate }: PodcastFormProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Título do Episódio
                </label>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Mic size={20} color="#64748b" />
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => onUpdate({ name: e.target.value })}
                        placeholder="Ex: O Segredo da Prosperidade"
                        style={{
                            background: 'none', border: 'none', color: 'white',
                            flex: 1, fontSize: '1rem', outline: 'none'
                        }}
                        required
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Episode Number */}
                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Nº Episódio
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Hash size={20} color="#64748b" />
                        <input
                            type="text"
                            value={data.episode}
                            onChange={e => onUpdate({ episode: e.target.value })}
                            placeholder="Ex: 14"
                            style={{
                                background: 'none', border: 'none', color: 'white',
                                flex: 1, fontSize: '1rem', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Duração
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Clock size={20} color="#64748b" />
                        <input
                            type="text"
                            value={data.duration}
                            onChange={e => onUpdate({ duration: e.target.value })}
                            placeholder="Ex: 45 min"
                            style={{
                                background: 'none', border: 'none', color: 'white',
                                flex: 1, fontSize: '1rem', outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Theme Select */}
            <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Tema
                </label>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Layers size={20} color="#64748b" />
                    <select
                        value={data.theme || 'financas'}
                        onChange={e => onUpdate({ theme: e.target.value })}
                        style={{
                            background: 'none', border: 'none', color: 'white',
                            flex: 1, fontSize: '1rem', outline: 'none', cursor: 'pointer'
                        }}
                    >
                        {THEMES.map(theme => (
                            <option key={theme.id} value={theme.id} style={{ backgroundColor: '#1e293b' }}>
                                {theme.icon} {theme.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cover URL (Optional) & Video Link */}
            <div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Link do Vídeo/Podcast
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Link size={20} color="#64748b" />
                        <input
                            type="text"
                            value={data.link || ''}
                            onChange={e => {
                                const url = e.target.value;
                                let updates: Partial<ActivityFormData> = { link: url };

                                // Auto-extract cover from YouTube
                                try {
                                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                        let videoId = '';
                                        if (url.includes('v=')) {
                                            videoId = url.split('v=')[1]?.split('&')[0];
                                        } else if (url.includes('youtu.be/')) {
                                            videoId = url.split('youtu.be/')[1]?.split('?')[0];
                                        }

                                        if (videoId && !data.coverUrl) {
                                            updates.coverUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                                        }
                                    }
                                } catch (err) {
                                    console.log('Error extracting thumbnail', err);
                                }

                                onUpdate(updates);
                            }}
                            placeholder="https://youtube.com/..."
                            style={{
                                background: 'none', border: 'none', color: 'white',
                                flex: 1, fontSize: '1rem', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                    URL da Capa (Automático ou Manual)
                </label>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <ImageIcon size={20} color="#64748b" />
                    <input
                        type="text"
                        value={data.coverUrl}
                        onChange={e => onUpdate({ coverUrl: e.target.value })}
                        placeholder="https://..."
                        style={{
                            background: 'none', border: 'none', color: 'white',
                            flex: 1, fontSize: '1rem', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Scheduling */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Data
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <input
                            type="date"
                            value={data.scheduledDate}
                            onChange={e => onUpdate({ scheduledDate: e.target.value })}
                            style={{
                                background: 'none', border: 'none', color: 'white',
                                flex: 1, fontSize: '1rem', outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Horário
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Clock size={20} color="#64748b" />
                        <input
                            type="time"
                            value={data.scheduledTime}
                            onChange={e => onUpdate({ scheduledTime: e.target.value })}
                            style={{
                                background: 'none', border: 'none', color: 'white',
                                flex: 1, fontSize: '1rem', outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
