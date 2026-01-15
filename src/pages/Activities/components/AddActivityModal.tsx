import { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { activityService } from '../../../services/activityService';
import { tmdbService, type TmdbMovie, type WatchProvider } from '../../../services/tmdbService';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    activeTab: 'movies' | 'music' | 'bible' | 'prayer' | 'podcast' | 'couple' | 'shopping' | 'travel';
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, activeTab }: AddActivityModalProps) {
    const [name, setName] = useState('');
    const [meta, setMeta] = useState('');
    // Movie specific states
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [rating, setRating] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

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
            setName('');
            setMeta('');
            setYear(new Date().getFullYear().toString());
            setSelectedGenres([]);
            setRating('');
            setRating('');
            setPosterUrl('');
            setProviders([]);
            setMediaType('movie');
            setSearchResults([]);
            setShowResults(false);
        }
    }, [isOpen, activeTab]);

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
        switch (activeTab) {
            case 'movies': return 'Adicionar Filme/Série';
            case 'music': return 'Adicionar Música';
            case 'podcast': return 'Adicionar Podcast';
            case 'bible': return 'Adicionar Estudo Bíblico';
            case 'prayer': return 'Adicionar Motivo de Oração';
            case 'couple': return 'Adicionar Lazer';
            case 'shopping': return 'Adicionar Item de Compra';
            case 'travel': return 'Adicionar Item de Viagem';
            default: return 'Adicionar Item';
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
                    providers, // storing providers array
                    mediaType // storing media type
                });
            }

            await activityService.addItem(activeTab, name, finalMeta || undefined);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar item');
        } finally {
            setLoading(false);
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
                        <label>Nome do Item</label>
                        <input
                            type="text"
                            placeholder="Ex: Leite, Inception, Salmo 23..."
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
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-primary)'
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

                    {activeTab !== 'movies' && (
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

                    {activeTab === 'movies' && (
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
                    )}

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
