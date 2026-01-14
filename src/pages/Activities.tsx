import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ShoppingCart, Plane, Plus, Trash2,
    Film, Music, Headphones, BookOpen, Heart
} from 'lucide-react';
import './Activities.css';

type ActivityType = 'shopping' | 'travel' | 'movies' | 'music' | 'podcast' | 'bible' | 'couple';

interface ActivityItem {
    id: number;
    name: string;
    completed: boolean;
    meta?: string; // Quantity, Author, Platform, etc.
}

export default function Activities() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActivityType>('shopping');

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

    // Dados Mockados
    const [lists, setLists] = useState<Record<ActivityType, ActivityItem[]>>({
        shopping: [
            { id: 1, name: 'Leite Desnatado', completed: false, meta: '2L' },
            { id: 2, name: 'Pão Integral', completed: true, meta: '1 pct' },
            { id: 3, name: 'Maçãs', completed: false, meta: '6 un' },
            { id: 4, name: 'Café Premium', completed: false, meta: '500g' },
        ],
        travel: [
            { id: 1, name: 'Passaportes', completed: true, meta: 'Docs' },
            { id: 2, name: 'Roupas de Frio', completed: false, meta: 'Mala' },
            { id: 3, name: 'Carregadores', completed: false, meta: 'Eletrônicos' },
        ],
        movies: [
            { id: 1, name: 'Interestelar', completed: false, meta: 'Netflix' },
            { id: 2, name: 'Breaking Bad', completed: true, meta: 'S05E14' },
            { id: 3, name: 'O Dilema das Redes', completed: false, meta: 'Doc' },
        ],
        music: [
            { id: 1, name: 'Worship Mix 2024', completed: false, meta: 'Spotify' },
            { id: 2, name: 'Lofi Study', completed: false, meta: 'Youtube' },
        ],
        podcast: [
            { id: 1, name: 'Primocast - Finanças', completed: false, meta: 'Ep. 142' },
            { id: 2, name: 'DevNaEstrada', completed: true, meta: 'Ep. 300' },
        ],
        bible: [
            { id: 1, name: 'João 3:16', completed: true, meta: 'Memorizar' },
            { id: 2, name: 'Salmos 91', completed: false, meta: 'Devocional' },
            { id: 3, name: 'Romanos 8', completed: false, meta: 'Estudo' },
        ],
        couple: [
            { id: 1, name: 'Jantar no Terraço', completed: false, meta: 'Sábado' },
            { id: 2, name: 'Cinema VIP', completed: false, meta: 'Domingo' },
            { id: 3, name: 'Piquenique no Parque', completed: true, meta: 'Feito' },
        ]
    });

    const toggleItem = (type: ActivityType, id: number) => {
        setLists({
            ...lists,
            [type]: lists[type].map(i => i.id === id ? { ...i, completed: !i.completed } : i)
        });
    };

    const deleteItem = (type: ActivityType, id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLists({
            ...lists,
            [type]: lists[type].filter(i => i.id !== id)
        });
    };

    const getActiveList = () => lists[activeTab];

    const addItem = () => {
        const itemName = window.prompt(`Adicionar item em ${tabs.find(t => t.id === activeTab)?.label}:`);
        if (!itemName) return;

        const newItem: ActivityItem = {
            id: Date.now(),
            name: itemName,
            completed: false,
            meta: '' // Optional logic for meta later
        };

        setLists({
            ...lists,
            [activeTab]: [...lists[activeTab], newItem]
        });
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
                        {getActiveList().filter(i => !i.completed).length} pendentes em {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                    <button className="add-btn-small" onClick={addItem}>
                        <Plus size={16} /> Adicionar Item
                    </button>
                </div>

                {getActiveList().length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhum item nesta lista.</p>
                    </div>
                ) : (
                    getActiveList().map(item => (
                        <div key={item.id} className="activity-card" onClick={() => toggleItem(activeTab, item.id)}>
                            <div className={`checkbox-custom ${item.completed ? 'checked' : ''}`} />
                            <div className="activity-info">
                                <span className={`activity-name ${item.completed ? 'completed-text' : ''}`}>{item.name}</span>
                                {item.meta && <span className="activity-meta">{item.meta}</span>}
                            </div>
                            <button className="delete-btn" onClick={(e) => deleteItem(activeTab, item.id, e)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
