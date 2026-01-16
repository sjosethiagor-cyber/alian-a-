import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { tmdbService, type TmdbMovie, type WatchProvider } from '../../../../services/tmdbService';

interface MovieFormData {
    name: string;
    year: string;
    rating: string;
    posterUrl: string;
    mediaType: 'movie' | 'tv';
    selectedGenres: string[];
    providers: WatchProvider[];
    scheduledDate: string;
    scheduledTime: string;
}

interface MovieFormProps {
    data: MovieFormData;
    onUpdate: (data: Partial<MovieFormData>) => void;
}

const GENRES = [
    'Ação', 'Aventura', 'Comédia', 'Drama', 'Sci-Fi',
    'Terror', 'Romance', 'Animação', 'Suspense',
    'Documentário', 'Fantasia', 'Mistério'
];

export default function MovieForm({ data, onUpdate }: MovieFormProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async () => {
        if (!data.name.trim()) return;
        setIsSearching(true);
        setShowResults(true);
        const results = await tmdbService.searchMovie(data.name);
        setSearchResults(results);
        setIsSearching(false);
    };

    const selectMovie = async (id: number, type: 'movie' | 'tv' = 'movie') => {
        setIsSearching(true);
        const details = await tmdbService.getMovieDetails(id, type);
        const watchProviders = await tmdbService.getWatchProviders(id, type);

        if (details) {
            const date = details.release_date || details.first_air_date;

            // Map genres
            const apiGenres = details.genres.map(g => g.name);
            const matchedGenres = GENRES.filter(g =>
                apiGenres.some(apiG =>
                    apiG.toLowerCase().includes(g.toLowerCase()) ||
                    g.toLowerCase().includes(apiG.toLowerCase())
                )
            );

            onUpdate({
                name: details.title || details.name || '',
                year: date ? new Date(date).getFullYear().toString() : '',
                rating: details.vote_average.toFixed(1),
                posterUrl: tmdbService.getImageUrl(details.poster_path),
                mediaType: type,
                providers: watchProviders,
                selectedGenres: matchedGenres.length > 0 ? matchedGenres : data.selectedGenres
            });
        }
        setShowResults(false);
        setIsSearching(false);
    };

    return (
        <>
            <div className="form-group" style={{ position: 'relative' }}>
                <label>Nome do Filme/Série</label>
                <input
                    type="text"
                    placeholder="Ex: Inception, Breaking Bad..."
                    value={data.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className="modal-input"
                    required
                    autoFocus
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="search-btn"
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '40px', // Adjusted for label
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

            <div className="form-column" style={{ gap: '1rem', marginTop: '1rem' }}>
                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Ano de Lançamento</label>
                        <input
                            type="number"
                            placeholder="2023"
                            value={data.year}
                            onChange={e => onUpdate({ year: e.target.value })}
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
                            value={data.rating}
                            onChange={e => onUpdate({ rating: e.target.value })}
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
                            value={data.scheduledDate}
                            onChange={e => onUpdate({ scheduledDate: e.target.value })}
                            className="modal-input"
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Hora</label>
                        <input
                            type="time"
                            value={data.scheduledTime}
                            onChange={e => onUpdate({ scheduledTime: e.target.value })}
                            className="modal-input"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Gêneros ({data.selectedGenres.length})</label>
                    <div className="genres-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {GENRES.map(g => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => {
                                    if (data.selectedGenres.includes(g)) {
                                        onUpdate({ selectedGenres: data.selectedGenres.filter(i => i !== g) });
                                    } else {
                                        onUpdate({ selectedGenres: [...data.selectedGenres, g] });
                                    }
                                }}
                                className={`genre-chip ${data.selectedGenres.includes(g) ? 'active' : ''}`}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid ' + (data.selectedGenres.includes(g) ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)'),
                                    backgroundColor: data.selectedGenres.includes(g) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: data.selectedGenres.includes(g) ? 'var(--color-primary)' : 'var(--text-sec)',
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
        </>
    );
}
