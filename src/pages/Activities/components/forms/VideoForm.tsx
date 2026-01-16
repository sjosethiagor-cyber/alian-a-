// import { useState, useEffect } from 'react';

export interface VideoFormData {
    name: string;
    youtubeUrl: string;
    duration: string;
    series: string;
    posterUrl?: string;
}

interface VideoFormProps {
    data: any;
    onUpdate: (data: any) => void;
}

export default function VideoForm({ data, onUpdate }: VideoFormProps) {
    const extractThumbnail = (url: string) => {
        // Regex abrangente para YouTube (suporta shorts, live, embed, watch, youtu.be)
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const handleUrlChange = (url: string) => {
        const videoId = extractThumbnail(url);
        let updates: any = { youtubeUrl: url };

        if (videoId) {
            updates.posterUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // hqdefault is usually safer than maxresdefault
        }
        onUpdate(updates);
    };

    return (
        <>
            <div className="form-group">
                <label>Título do Vídeo</label>
                <input
                    type="text"
                    placeholder="Ex: Como orar em casal"
                    value={data.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className="modal-input"
                    required
                    autoFocus
                />
            </div>

            <div className="form-group">
                <label>Link do YouTube</label>
                <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={data.youtubeUrl || ''}
                    onChange={e => handleUrlChange(e.target.value)}
                    className="modal-input"
                />
            </div>

            <div className="form-group">
                <label>Capa do Vídeo (Gerada automaticamente)</label>
                <input
                    type="url"
                    placeholder="URL da imagem..."
                    value={data.posterUrl || ''}
                    onChange={e => onUpdate({ posterUrl: e.target.value })}
                    className="modal-input"
                    style={{ fontSize: '0.8rem', color: '#94a3b8' }}
                />
                {data.posterUrl && (
                    <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', height: '100px', backgroundColor: '#0f172a' }}>
                        <img
                            src={data.posterUrl}
                            alt="Thumbnail preview"
                            style={{ height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Duração</label>
                    <input
                        type="text"
                        placeholder="Ex: 10:00"
                        value={data.duration || ''}
                        onChange={e => onUpdate({ duration: e.target.value })}
                        className="modal-input"
                    />
                </div>
                <div className="form-group">
                    <label>Série / Tema</label>
                    <input
                        type="text"
                        placeholder="Ex: Fundamentos"
                        value={data.series || ''}
                        onChange={e => onUpdate({ series: e.target.value })}
                        className="modal-input"
                    />
                </div>
            </div>
        </>
    );
}
