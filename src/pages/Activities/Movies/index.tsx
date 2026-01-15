import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clapperboard, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { activityService, type ActivityItem } from '../../../services/activityService';
import MovieCard from './components/MovieCard';
import AddActivityModal from '../components/AddActivityModal'; // Reuse existing modal, logic updated later
import './Movies.css';

interface MoviesProps {
    embedded?: boolean;
    items?: ActivityItem[];
    onRefresh?: () => void;
}

export default function Movies({ embedded = false, items: propItems, onRefresh }: MoviesProps) {
    const navigate = useNavigate();
    const [localItems, setLocalItems] = useState<ActivityItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    // Use props items if available, else local state
    const items = propItems || localItems;

    // Only fetch if NOT embedded (standalone mode)
    const shouldFetch = !embedded && !propItems;

    const loadItems = async () => {
        try {
            const data = await activityService.getItems('movies');
            setLocalItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            // Loading handled by initial state or skeleton if needed
        }
    };

    useEffect(() => {
        if (shouldFetch) {
            loadItems();
        }
    }, [shouldFetch]);

    const toggleItem = async (id: string, currentCompleted: boolean) => {
        // Optimistic update - only if local, otherwise we rely on parent refresh or careful prop update
        if (!propItems) {
            setLocalItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
        }

        try {
            await activityService.toggleItem(id, currentCompleted);
            if (onRefresh) onRefresh(); // Notify parent to reload
            if (shouldFetch) loadItems(); // Reload self
        } catch (error) {
            console.error(error);
            // Revert
            if (!propItems) {
                setLocalItems(items.map(i => i.id === id ? { ...i, completed: currentCompleted } : i));
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await activityService.deleteItem(id);
            if (onRefresh) onRefresh();
            if (shouldFetch) loadItems();

            // Optimistic update for local items
            if (!propItems) {
                setLocalItems(prev => prev.filter(i => i.id !== id));
            }
        } catch (error) {
            console.error(error);
            alert('Falha ao excluir item');
        }
    };

    const pending = items.filter(i => !i.completed);
    const completed = items.filter(i => i.completed);

    return (
        <div className={`movies-page-container ${embedded ? 'embedded' : ''}`}>
            {!embedded && (
                <header className="page-header" style={{ marginBottom: 0 }}>
                    <button className="back-btn" onClick={() => navigate('/app/atividades')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="header-content">
                        <h1 className="page-title">Filmes a Assistir</h1>
                    </div>
                    <button className="add-list-btn-header" onClick={() => setIsModalOpen(true)}>
                        <Plus size={24} />
                    </button>
                </header>
            )}

            <div className="movies-container" style={embedded ? { padding: '0', paddingBottom: '80px' } : undefined}>
                {/* Stats Row */}
                <div className="movies-stats-row">
                    <div className="stat-card">
                        <Clapperboard size={24} className="stat-icon" />
                        <span className="stat-value">{completed.length}</span>
                        <span className="stat-label">Vistos Juntos</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#60a5fa' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="stat-value">{pending.length}</span>
                        <span className="stat-label">Na Lista</span>
                    </div>
                </div>

                {/* To Watch List */}
                <div className="movies-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header-row">
                        <h3 className="section-title">Na Lista</h3>
                        <button className="view-all-link">Ver todos</button>
                    </div>

                    {pending.length === 0 ? (
                        <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>
                            Nenhum filme na lista. Adicione um!
                        </p>
                    ) : (
                        pending.map(item => (
                            <MovieCard key={item.id} item={item} onToggle={toggleItem} onDelete={handleDelete} />
                        ))
                    )}
                </div>

                {/* Recently Watched */}
                <div className="movies-section">
                    <div className="completed-toggle" onClick={() => setShowCompleted(!showCompleted)}>
                        <span className="section-title">Vistos Recentemente</span>
                        {completed.length > 0 && <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '0.9rem' }}>{completed.length}</span>}
                        <div style={{ flex: 1 }} />
                        {showCompleted ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {showCompleted && (
                        <div className="completed-list">
                            {completed.map(item => (
                                <MovieCard key={item.id} item={item} onToggle={toggleItem} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddActivityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadItems}
                activeTab="movies"
            />
        </div>
    );
}
