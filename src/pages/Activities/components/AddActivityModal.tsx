import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Loader2 } from 'lucide-react';
import { activityService, type ActivityItem } from '../../../services/activityService';
import { tmdbService, type TmdbMovie, type WatchProvider } from '../../../services/tmdbService';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    activeTab: 'movies' | 'music' | 'bible' | 'prayer' | 'podcast' | 'couple' | 'shopping' | 'travel';
    initialData?: ActivityItem | null;
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, activeTab, initialData }: AddActivityModalProps) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [meta, setMeta] = useState('');
    // Movie specific states
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [rating, setRating] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

    // Bible specific states
    // Bible specific states
    const [studyType, setStudyType] = useState<'reading' | 'devotional' | 'prayer'>('reading');
    const [link, setLink] = useState('');
    const [channelName, setChannelName] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    // Search states
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [providers, setProviders] = useState<WatchProvider[]>([]);

    const GENRES = [
        'Ação', 'Aventura', 'Comédia', 'Drama', 'Sci-Fi',
        'Terror', 'Romance', 'Animação', 'Suspense',
        'Documentário', 'Fantasia', 'Mistério'
    ];

    const [loading, setLoading] = useState(false);

    // Reset form when modal opens/closes or tab changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form with existing data
                setName(initialData.name);

                // Parse meta
                try {
                    const parsed = JSON.parse(initialData.meta || '{}');
                    if (activeTab === 'bible') {
                        setMeta(parsed.description || (typeof parsed === 'string' ? parsed : ''));
                        setStudyType(parsed.type || 'reading');
                        setLink(parsed.link || '');
                        setChannelName(parsed.channelName || '');
                        setCoverUrl(parsed.coverUrl || '');
                        setScheduledDate(parsed.scheduledDate || '');
                        setScheduledTime(parsed.scheduledTime || '');
                    } else if (activeTab === 'movies') {
                        setYear(parsed.year || new Date().getFullYear().toString());
                        setRating(parsed.rating || '');
                        setPosterUrl(parsed.posterUrl || '');
                        setSelectedGenres(parsed.genre ? parsed.genre.split(', ') : []);
                        setProviders(parsed.providers || []);
                        setMediaType(parsed.mediaType || 'movie');
                        setScheduledDate(parsed.scheduledDate || '');
                        setScheduledTime(parsed.scheduledTime || '');
                    } else {
                        setMeta(initialData.meta || '');
                    }
                } catch {
                    setMeta(initialData.meta || '');
                }

            } else {
                // Reset to default
                setName('');
                setMeta('');
                setYear(new Date().getFullYear().toString());
                setSelectedGenres([]);
                setRating('');
                setPosterUrl('');
                setProviders([]);
                setMediaType('movie');
                setStudyType('reading');
                setLink('');
                setChannelName('');
                setCoverUrl('');
                setScheduledDate('');
                setScheduledTime('');
                setSearchResults([]);
                setShowResults(false);
            }
        }
    }, [isOpen, activeTab, initialData]);

    // Auto-detect YouTube thumbnail
    useEffect(() => {
        if (activeTab === 'bible' && link) {
            const getYoutubeId = (url: string) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : null;
            };

            const ytId = getYoutubeId(link);
            if (ytId && !coverUrl) {
                setCoverUrl(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
            }
        }
    }, [link, activeTab]);

    if (!isOpen) return null;

    const getMetaLabel = () => {
        switch (activeTab) {
            case 'movies': return 'Onde assistir / Nota';
            case 'music': return 'Artista';
            case 'podcast': return 'Link / Host';
            case 'bible': return 'Livro / Versículo';
            case 'prayer': return 'Tema / Motivo';
            case 'couple': return 'Data / Local';
            case 'shopping': return 'Quantidade / Preço Estimado';
            case 'travel': return 'Data / Custo';
            default: return 'Detalhes';
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
            default: return prefix + 'Item';
        }
    };

    const handleSearch = async () => {
        if (!name.trim()) return;
        setIsSearching(true);
        setShowResults(true);
        const results = await tmdbService.searchMovie(name);
        setSearchResults(results);
        setIsSearching(false);
    };

    const selectMovie = async (id: number, type: 'movie' | 'tv' = 'movie') => {
        setIsSearching(true);
        const details = await tmdbService.getMovieDetails(id, type);
        const watchProviders = await tmdbService.getWatchProviders(id, type);

        if (details) {
            setName(details.title || details.name || '');
            const date = details.release_date || details.first_air_date;
            setYear(date ? new Date(date).getFullYear().toString() : '');
            setRating(details.vote_average.toFixed(1));
            setPosterUrl(tmdbService.getImageUrl(details.poster_path));
            setProviders(watchProviders);
            setMediaType(type);

            // Try to map genres
            const apiGenres = details.genres.map(g => g.name);
            const matchedGenres = GENRES.filter(g =>
                apiGenres.some(apiG =>
                    apiG.toLowerCase().includes(g.toLowerCase()) ||
                    g.toLowerCase().includes(apiG.toLowerCase())
                )
            );
            if (matchedGenres.length > 0) setSelectedGenres(matchedGenres);
        }
        setShowResults(false);
        setIsSearching(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            let finalMeta = meta;

            if (activeTab === 'movies') {
                // Construct JSON meta for movies
                finalMeta = JSON.stringify({
                    year,
                    genre: selectedGenres.join(', '),
                    rating,
                    posterUrl,
                    providers,
                    mediaType,
                    scheduledDate, // Add scheduledDate
                    scheduledTime  // Add scheduledTime
                });
            } else if (activeTab === 'bible') {
                finalMeta = JSON.stringify({
                    description: meta,
                    type: studyType,
                    link: link,
                    channelName: channelName,
                    coverUrl: coverUrl,
                    scheduledDate: scheduledDate,
                    scheduledTime: scheduledTime
                });
            }

            if (initialData) {
                await activityService.updateItem(initialData.id, {
                    name,
                    meta: finalMeta || undefined,
                    category: activeTab
                });
            } else {
                await activityService.addItem(activeTab, name, finalMeta || undefined);
            }

            // Navigate to Dashboard if item has date (Movies or Bible)
            if ((activeTab === 'bible' || activeTab === 'movies') && scheduledDate) {
                navigate('/app', { state: { date: scheduledDate } });
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

    const getNameLabel = () => {
        switch (activeTab) {
            case 'movies': return 'Nome do Filme/Série';
            case 'music': return 'Nome da Música';
            case 'bible': return 'Título do Estudo';
            case 'prayer': return 'Título da Oração';
            case 'podcast': return 'Nome do Podcast';
            default: return 'Nome do Item';
        }
    };

    const getNamePlaceholder = () => {
        switch (activeTab) {
            case 'movies': return 'Ex: Inception, Breaking Bad...';
            case 'bible': return 'Ex: João 15, Oração por Cura...';
            case 'shopping': return 'Ex: Leite, Pão...';
            default: return 'Ex: Item...';
        }
    };

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
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>{getNameLabel()}</label>
                        <input
                            type="text"
                            placeholder={getNamePlaceholder()}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="modal-input"
                            required
                            autoFocus
                        />
                        {activeTab === 'movies' && (
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="search-btn"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-primary)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                            </button>
                        )}

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="search-results-dropdown" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: '#1e293b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                zIndex: 100,
                                maxHeight: '200px',
                                overflowY: 'auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}>
                                {searchResults.map(result => (
                                    <div
                                        key={result.id}
                                        className="search-result-item"
                                        onClick={() => selectMovie(result.id, result.media_type || 'movie')}
                                        style={{
                                            padding: '8px 12px',
                                            display: 'flex',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        {result.poster_path && <img src={tmdbService.getImageUrl(result.poster_path)} alt="" style={{ width: '30px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'white', fontSize: '0.9rem' }}>
                                                {result.title || result.name}
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: result.media_type === 'tv' ? '#8b5cf6' : '#3b82f6',
                                                    color: 'white'
                                                }}>
                                                    {result.media_type === 'tv' ? 'Série' : 'Filme'}
                                                </span>
                                            </div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                                {(result.release_date || result.first_air_date || '').split('-')[0]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {activeTab === 'bible' && (
                        <>
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
                                            onClick={() => setStudyType(type.id as any)}
                                            className={`tab-pill ${studyType === type.id ? 'active' : ''}`}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                backgroundColor: studyType === type.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
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
                                    value={meta}
                                    onChange={e => setMeta(e.target.value)}
                                    className="modal-input"
                                />
                            </div>

                            {/* Date and Time Row */}
                            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={e => setScheduledDate(e.target.value)}
                                        className="modal-input"
                                        style={{ marginTop: '4px' }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Hora</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={e => setScheduledTime(e.target.value)}
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
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        className="modal-input"
                                        style={{ flex: 2 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Canal/Autor..."
                                        value={channelName}
                                        onChange={e => setChannelName(e.target.value)}
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
                                        value={coverUrl}
                                        onChange={e => setCoverUrl(e.target.value)}
                                        className="modal-input"
                                        style={{ flex: 1 }}
                                    />
                                    {coverUrl && (
                                        <img
                                            src={coverUrl}
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
                    )}
                    {activeTab !== 'movies' && activeTab !== 'bible' && (
                        <div className="form-group">
                            <label>{getMetaLabel()} (Opcional)</label>
                            <input
                                type="text"
                                placeholder="..."
                                value={meta}
                                onChange={e => setMeta(e.target.value)}
                                className="modal-input"
                            />
                        </div>
                    )}

                    {
                        activeTab === 'movies' && (
                            <div className="form-column" style={{ gap: '1rem', marginTop: '1rem' }}>
                                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Ano de Lançamento</label>
                                        <input
                                            type="number"
                                            placeholder="2023"
                                            value={year}
                                            onChange={e => setYear(e.target.value)}
                                            className="modal-input"
                                            min="1900"
                                            max="2099"
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Nota (0-10)</label>
                                        <input
                                            type="number"
                                            placeholder="8.5"
                                            value={rating}
                                            onChange={e => setRating(e.target.value)}
                                            className="modal-input"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                        />
                                    </div>
                                </div>

                                {/* Date and Time for Movies */}
                                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Data de Assistir</label>
                                        <input
                                            type="date"
                                            value={scheduledDate}
                                            onChange={e => setScheduledDate(e.target.value)}
                                            className="modal-input"
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Hora</label>
                                        <input
                                            type="time"
                                            value={scheduledTime}
                                            onChange={e => setScheduledTime(e.target.value)}
                                            className="modal-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Gêneros ({selectedGenres.length})</label>
                                    <div className="genres-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                        {GENRES.map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => {
                                                    if (selectedGenres.includes(g)) {
                                                        setSelectedGenres(selectedGenres.filter(i => i !== g));
                                                    } else {
                                                        setSelectedGenres([...selectedGenres, g]);
                                                    }
                                                }}
                                                className={`genre-chip ${selectedGenres.includes(g) ? 'active' : ''}`}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    border: '1px solid ' + (selectedGenres.includes(g) ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)'),
                                                    backgroundColor: selectedGenres.includes(g) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                                    color: selectedGenres.includes(g) ? 'var(--color-primary)' : 'var(--text-sec)',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Adicionar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
