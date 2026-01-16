import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { activityService, type ActivityItem } from '../../../services/activityService';
import { type WatchProvider } from '../../../services/tmdbService';

import MovieForm from './forms/MovieForm';
import BibleForm from './forms/BibleForm';
import GeneralForm from './forms/GeneralForm';
import VideoForm from './forms/VideoForm';
import PodcastForm from './forms/PodcastForm';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    activeTab: 'movies' | 'music' | 'bible' | 'prayer' | 'podcast' | 'couple' | 'shopping' | 'travel' | 'prayer_video';
    initialData?: ActivityItem | null;
}

export interface ActivityFormData {
    name: string;
    meta: string; // General meta

    // Movie specific
    year: string;
    rating: string;
    posterUrl: string;
    mediaType: 'movie' | 'tv';
    selectedGenres: string[];
    providers: WatchProvider[];

    // Bible specific
    description: string; // Used for "Livro/Versículo"
    type: 'reading' | 'devotional' | 'prayer';
    link: string;
    channelName: string;
    coverUrl: string; // Shared with Movie poster? No, separate logic.

    // Shared Scheduling
    scheduledDate: string;
    scheduledTime: string;

    // Video specific
    youtubeUrl: string;
    duration: string;
    series: string;

    // Podcast specific
    episode: string;
    theme: string;
}

const INITIAL_DATA: ActivityFormData = {
    name: '',
    meta: '',
    year: new Date().getFullYear().toString(),
    rating: '',
    posterUrl: '',
    mediaType: 'movie',
    selectedGenres: [],
    providers: [],
    description: '',
    type: 'reading',
    link: '',
    channelName: '',
    coverUrl: '',
    scheduledDate: '',
    scheduledTime: '',
    youtubeUrl: '',
    duration: '',
    series: '',
    episode: '',
    theme: 'financas'
};

export default function AddActivityModal({ isOpen, onClose, onSuccess, activeTab, initialData }: AddActivityModalProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ActivityFormData>(INITIAL_DATA);

    // Reset/Load Data
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const baseData = { ...INITIAL_DATA, name: initialData.name };
                try {
                    const parsed = JSON.parse(initialData.meta || '{}');

                    if (activeTab === 'bible') {
                        setFormData({
                            ...baseData,
                            description: parsed.description || (typeof parsed === 'string' ? parsed : ''),
                            type: parsed.type || 'reading',
                            link: parsed.link || '',
                            channelName: parsed.channelName || '',
                            coverUrl: parsed.coverUrl || '',
                            scheduledDate: parsed.scheduledDate || '',
                            scheduledTime: parsed.scheduledTime || ''
                        });
                    } else if (activeTab === 'movies') {
                        setFormData({
                            ...baseData,
                            year: parsed.year || new Date().getFullYear().toString(),
                            rating: parsed.rating || '',
                            posterUrl: parsed.posterUrl || '',
                            selectedGenres: parsed.genre ? parsed.genre.split(', ') : [],
                            providers: parsed.providers || [],
                            mediaType: parsed.mediaType || 'movie',
                            scheduledDate: parsed.scheduledDate || '',
                            scheduledTime: parsed.scheduledTime || ''
                        });
                    } else if (activeTab === 'podcast') {
                        setFormData({
                            ...baseData,
                            episode: parsed.episode || '',
                            duration: parsed.duration || '',
                            theme: parsed.theme || 'financas',
                            coverUrl: parsed.coverUrl || '',
                            scheduledDate: parsed.scheduledDate || '',
                            scheduledTime: parsed.scheduledTime || '',
                            link: parsed.link || ''
                        });
                    } else if (activeTab === 'prayer_video') {
                        setFormData({
                            ...baseData,
                            youtubeUrl: parsed.youtubeUrl || '',
                            posterUrl: parsed.posterUrl || '',
                            duration: parsed.duration || '',
                            series: parsed.series || ''
                        });
                    } else {
                        setFormData({
                            ...baseData,
                            meta: initialData.meta || ''
                        });
                    }
                } catch {
                    setFormData({
                        ...baseData,
                        meta: initialData.meta || ''
                    });
                }
            } else {
                setFormData(INITIAL_DATA);
            }
        }
    }, [isOpen, activeTab, initialData]);

    const handleUpdate = (updates: Partial<ActivityFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setLoading(true);
        try {
            let finalMeta = formData.meta;

            if (activeTab === 'movies') {
                finalMeta = JSON.stringify({
                    year: formData.year,
                    genre: formData.selectedGenres.join(', '),
                    rating: formData.rating,
                    posterUrl: formData.posterUrl,
                    providers: formData.providers,
                    mediaType: formData.mediaType,
                    scheduledDate: formData.scheduledDate,
                    scheduledTime: formData.scheduledTime
                });
            } else if (activeTab === 'bible') {
                finalMeta = JSON.stringify({
                    description: formData.description,
                    type: formData.type,
                    link: formData.link,
                    channelName: formData.channelName,
                    coverUrl: formData.coverUrl,
                    scheduledDate: formData.scheduledDate,
                    scheduledTime: formData.scheduledTime
                });
            } else if (activeTab === 'podcast') {
                finalMeta = JSON.stringify({
                    episode: formData.episode,
                    duration: formData.duration,
                    theme: formData.theme,
                    coverUrl: formData.coverUrl,
                    scheduledDate: formData.scheduledDate,
                    scheduledTime: formData.scheduledTime,
                    link: formData.link
                });
            } else if (activeTab === 'prayer_video') {
                finalMeta = JSON.stringify({
                    youtubeUrl: formData.youtubeUrl,
                    posterUrl: formData.posterUrl,
                    duration: formData.duration,
                    series: formData.series
                });
            }

            if (initialData) {
                await activityService.updateItem(initialData.id, {
                    name: formData.name,
                    meta: finalMeta || undefined,
                    category: activeTab
                });
            } else {
                await activityService.addItem(activeTab, formData.name, finalMeta || undefined);
            }

            if ((activeTab === 'bible' || activeTab === 'movies') && formData.scheduledDate) {
                navigate('/app', { state: { date: formData.scheduledDate } });
            } else {
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar item');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        const prefix = initialData ? 'Editar ' : 'Adicionar ';
        switch (activeTab) {
            case 'movies': return prefix + 'Filme/Série';
            case 'music': return prefix + 'Música';
            case 'podcast': return prefix + 'Podcast';
            case 'bible': return prefix + 'Estudo Bíblico';
            case 'prayer': return prefix + 'Motivo de Oração';
            case 'couple': return prefix + 'Lazer';
            case 'shopping': return prefix + 'Item de Compra';
            case 'travel': return prefix + 'Item de Viagem';
            case 'prayer_video': return prefix + 'Vídeo';
            default: return prefix + 'Item';
        }
    };

    const getGeneralLabels = () => {
        switch (activeTab) {
            case 'music': return { name: 'Nome da Música', meta: 'Artista', placeholder: 'Ex: Música x' };
            case 'podcast': return { name: 'Nome do Podcast', meta: 'Link / Host', placeholder: 'Ex: Flow Podcast' };
            case 'prayer': return { name: 'Título da Oração', meta: 'Tema / Motivo', placeholder: 'Ex: Oração por...' };
            case 'couple': return { name: 'Lazer', meta: 'Data / Local', placeholder: 'Ex: Cinema...' };
            case 'shopping': return { name: 'Item de Compra', meta: 'Quantidade / Preço', placeholder: 'Ex: Leite...' };
            case 'travel': return { name: 'Item de Viagem', meta: 'Data / Custo', placeholder: 'Ex: Passagem...' };
            default: return { name: 'Nome do Item', meta: 'Detalhes', placeholder: 'Ex: Item...' };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{getTitle()}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {activeTab === 'movies' ? (
                        <MovieForm data={formData} onUpdate={handleUpdate} />
                    ) : activeTab === 'bible' ? (
                        <BibleForm data={formData} onUpdate={handleUpdate} />
                    ) : activeTab === 'podcast' ? (
                        <PodcastForm data={formData} onUpdate={handleUpdate} />
                    ) : activeTab === 'prayer_video' ? (
                        <VideoForm data={formData} onUpdate={handleUpdate} />
                    ) : (
                        <GeneralForm
                            data={formData}
                            onUpdate={handleUpdate}
                            labels={getGeneralLabels()}
                        />
                    )}

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Adicionar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
