import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Plus, Trash2,
    Film, Music, Headphones, BookOpen, Heart, BookHeart
} from 'lucide-react';
import { activityService, type ActivityItem } from '../../services/activityService';
import AddActivityModal from './components/AddActivityModal';
import './Activities.css';

type ActivityType = 'movies' | 'music' | 'bible' | 'prayer' | 'podcast' | 'couple';

export default function Activities() {
    const navigate = useNavigate();
    const { tab } = useParams<{ tab: ActivityType }>();
    const [activeTab, setActiveTab] = useState<ActivityType>(tab || 'movies');
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Configuração das Abas
    const tabs = [
        { id: 'movies', label: 'Filmes e Séries', icon: Film },
        { id: 'music', label: 'Músicas', icon: Music },
        { id: 'bible', label: 'Estudo Bíblico', icon: BookOpen },
        { id: 'prayer', label: 'Estudo para Oração', icon: BookHeart }, // New Icon needed or reuse
        { id: 'podcast', label: 'Podcast', icon: Headphones },
        { id: 'couple', label: 'Lazer', icon: Heart },
    ];

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await activityService.getItems(activeTab);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab && tab !== activeTab) {
            setActiveTab(tab as ActivityType);
        }
    }, [tab]);

    useEffect(() => {
        loadItems();
    }, [activeTab]);

    const toggleItem = async (id: string, currentCompleted: boolean) => {
        // Optimistic
        setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));

        try {
            await activityService.toggleItem(id, currentCompleted);
        } catch (error) {
            console.error(error);
            // Revert
            setItems(items.map(i => i.id === id ? { ...i, completed: currentCompleted } : i));
        }
    };

    const deleteItem = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Excluir item?')) {
            try {
                await activityService.deleteItem(id);
                loadItems(); // Reload fully to be safe
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir');
            }
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-content">
                    <h1 className="page-title">Atividades</h1>
                    <span className="page-subtitle">Listas Compartilhadas</span>
                </div>
                <button className="add-list-btn-header" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                </button>
            </header>

            {/* Scrollable Tabs */}
            <div className="tabs-strip">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => navigate(`/app/atividades/${tab.id}`)}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List Content */}
            <div className="activities-list">
                <div className="list-summary">
                    <span>
                        {items.filter(i => !i.completed).length} pendentes em {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                    <button className="add-btn-small" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} /> Adicionar Item
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Carregando...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhum item nesta lista.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="activity-card" onClick={() => toggleItem(item.id, item.completed)}>
                            <div className={`checkbox-custom ${item.completed ? 'checked' : ''}`} />
                            <div className="activity-info">
                                <span className={`activity-name ${item.completed ? 'completed-text' : ''}`}>{item.name}</span>
                                {item.meta && <span className="activity-meta">{item.meta}</span>}
                            </div>
                            <button className="delete-btn" onClick={(e) => deleteItem(item.id, e)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <AddActivityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadItems}
                activeTab={activeTab}
            />
        </div>
    );
}
