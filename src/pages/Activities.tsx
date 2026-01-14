import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ShoppingCart, Plane, Plus, Trash2,
    Film, Music, Headphones, BookOpen, Heart
} from 'lucide-react';
import { activityService, type ActivityItem } from '../services/activityService';
import './Activities.css';

type ActivityType = 'shopping' | 'travel' | 'movies' | 'music' | 'podcast' | 'bible' | 'couple';

export default function Activities() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActivityType>('shopping');
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Configuração das Abas
    const tabs = [
        { id: 'shopping', label: 'Compras', icon: ShoppingCart },
        { id: 'travel', label: 'Viagem', icon: Plane },
        { id: 'movies', label: 'Filmes/Séries', icon: Film },
        { id: 'music', label: 'Músicas', icon: Music },
        { id: 'podcast', label: 'Podcasts', icon: Headphones },
        { id: 'bible', label: 'Estudo Bíblico', icon: BookOpen },
        { id: 'couple', label: 'Lazer a Dois', icon: Heart },
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

    const addItem = async () => {
        const itemName = window.prompt(`Adicionar item em ${tabs.find(t => t.id === activeTab)?.label}:`);
        if (!itemName) return;

        const meta = window.prompt('Algum detalhe extra? (Quantidade, Autor, etc) - Opcional');

        try {
            await activityService.addItem(activeTab, itemName, meta || undefined);
            loadItems();
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar');
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
                <button className="add-list-btn-header" onClick={addItem}>
                    <Plus size={20} />
                </button>
            </header>

            {/* Scrollable Tabs */}
            <div className="tabs-strip">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as ActivityType)}
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
                    <button className="add-btn-small" onClick={addItem}>
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
        </div>
    );
}
