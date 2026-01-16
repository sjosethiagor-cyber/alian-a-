import { useEffect } from 'react';

interface BibleFormData {
    name: string;
    description: string;
    type: 'reading' | 'devotional' | 'prayer';
    link: string;
    channelName: string;
    coverUrl: string;
    scheduledDate: string;
    scheduledTime: string;
}

interface BibleFormProps {
    data: BibleFormData;
    onUpdate: (data: Partial<BibleFormData>) => void;
}

export default function BibleForm({ data, onUpdate }: BibleFormProps) {
    // Auto-detect YouTube thumbnail
    useEffect(() => {
        if (data.link && !data.coverUrl) {
            const getYoutubeId = (url: string) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : null;
            };

            const ytId = getYoutubeId(data.link);
            if (ytId) {
                onUpdate({ coverUrl: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` });
            }
        }
    }, [data.link]);

    return (
        <>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Título do Estudo</label>
                <input
                    type="text"
                    placeholder="Ex: João 15, Oração por Cura..."
                    value={data.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className="modal-input"
                    required
                    autoFocus
                />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Tipo de Item</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[
                        { id: 'reading', label: 'Leitura' },
                        { id: 'devotional', label: 'Devocional' },
                        { id: 'prayer', label: 'Oração' }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => onUpdate({ type: type.id as any })}
                            className={`tab-pill ${data.type === type.id ? 'active' : ''}`}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: data.type === type.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                border: 'none'
                            }}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Livro / Versículo / Tema</label>
                <input
                    type="text"
                    placeholder="Ex: João 15, Salmos 23..."
                    value={data.description}
                    onChange={e => onUpdate({ description: e.target.value })}
                    className="modal-input"
                />
            </div>

            {/* Date and Time Row */}
            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Data</label>
                    <input
                        type="date"
                        value={data.scheduledDate}
                        onChange={e => onUpdate({ scheduledDate: e.target.value })}
                        className="modal-input"
                        style={{ marginTop: '4px' }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Hora</label>
                    <input
                        type="time"
                        value={data.scheduledTime}
                        onChange={e => onUpdate({ scheduledTime: e.target.value })}
                        className="modal-input"
                        style={{ marginTop: '4px' }}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Link de Apoio (Opcional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="url"
                        placeholder="YouTube, Spotify..."
                        value={data.link}
                        onChange={e => onUpdate({ link: e.target.value })}
                        className="modal-input"
                        style={{ flex: 2 }}
                    />
                    <input
                        type="text"
                        placeholder="Canal/Autor..."
                        value={data.channelName}
                        onChange={e => onUpdate({ channelName: e.target.value })}
                        className="modal-input"
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Capa (Automático se YouTube)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={data.coverUrl}
                        onChange={e => onUpdate({ coverUrl: e.target.value })}
                        className="modal-input"
                        style={{ flex: 1 }}
                    />
                    {data.coverUrl && (
                        <img
                            src={data.coverUrl}
                            alt="Preview"
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
