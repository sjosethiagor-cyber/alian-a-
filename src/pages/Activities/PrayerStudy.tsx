import { useState } from 'react';
import { Plus, Check, User, Trash2 } from 'lucide-react';
import { type ActivityItem } from '../../services/activityService';
import PrayerHero from './components/Prayer/PrayerHero';
import PrayerStats from './components/Prayer/PrayerStats';
import VideoCarousel from './components/Prayer/VideoCarousel';
import ResourceList from './components/Prayer/ResourceList';
import LearningJournal from './components/Prayer/LearningJournal';

interface PrayerStudyProps {
    embedded?: boolean;
    items?: ActivityItem[];
    onToggle?: (id: string, currentCompleted: boolean) => void;
    onAdd?: () => void;
    onDelete?: (id: string) => void;
    onAddVideo?: () => void;
    refreshTrigger?: number;
}

export default function PrayerStudy({ items = [], onToggle, onAdd, onAddVideo, refreshTrigger, onDelete }: PrayerStudyProps) {
    const [filter, setFilter] = useState<'todo' | 'done'>('todo');
    const completedCount = items.filter(i => i.completed).length;

    // Filter items based on active tab
    const filteredItems = items.filter(item => {
        if (filter === 'done') return item.completed;
        return !item.completed;
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
            <PrayerHero />

            <VideoCarousel onAdd={onAddVideo} refreshTrigger={refreshTrigger} />

            {/* Checklist Section */}
            <section style={{ margin: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setFilter('todo')}
                            style={{
                                background: 'none', border: 'none',
                                color: filter === 'todo' ? 'white' : '#64748b',
                                fontWeight: filter === 'todo' ? 700 : 500,
                                fontSize: '1.2rem', cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            A Fazer
                        </button>
                        <button
                            onClick={() => setFilter('done')}
                            style={{
                                background: 'none', border: 'none',
                                color: filter === 'done' ? 'white' : '#64748b',
                                fontWeight: filter === 'done' ? 700 : 500,
                                fontSize: '1.2rem', cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Concluídos
                        </button>
                    </div>

                    <div
                        onClick={() => setFilter('done')}
                        style={{
                            backgroundColor: filter === 'done' ? '#3b82f6' : '#1e293b',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            color: filter === 'done' ? 'white' : '#94a3b8',
                            border: '1px solid rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {completedCount}/{Math.max(items.length, 1)} Concluído
                    </div>
                </div>

                {/* Optional: Stats Chart requested by User, integrated near checklist */}
                {filter === 'todo' && (
                    <PrayerStats total={items.length || 1} completed={completedCount} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                            <p>{filter === 'todo' ? 'Tudo feito por hoje!' : 'Nenhuma oração concluída ainda.'}</p>
                            {filter === 'todo' && (
                                <button onClick={onAdd} style={{ marginTop: '10px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Adicionar oração
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id}
                                onClick={() => onToggle && onToggle(item.id, item.completed)}
                                style={{
                                    backgroundColor: '#1e293b',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    border: item.completed ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    opacity: item.completed ? 0.8 : 1
                                }}
                            >
                                <div style={{
                                    width: '28px', height: '28px',
                                    borderRadius: '50%',
                                    border: item.completed ? 'none' : '2px solid #475569',
                                    backgroundColor: item.completed ? '#10b981' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {item.completed && <Check size={16} color="white" strokeWidth={3} />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: item.completed ? '#94a3b8' : 'white',
                                        textDecoration: item.completed ? 'line-through' : 'none',
                                        marginBottom: '4px'
                                    }}>
                                        {item.name}
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                                        {item.meta ? (
                                            <span>{item.meta}</span>
                                        ) : (
                                            <span>{item.completed ? 'Concluído' : 'A fazer'}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Avatar/Person Indicator and Delete Button */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <User size={16} color="#3b82f6" />
                                    </div>

                                    {onDelete && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item.id);
                                            }}
                                            style={{
                                                background: 'none', border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: 0.7
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Add Button - Only show on ToDo tab */}
                    {filter === 'todo' && (
                        <button
                            onClick={onAdd}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px dashed rgba(255,255,255,0.2)',
                                backgroundColor: 'transparent',
                                color: '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer',
                                marginTop: '0'
                            }}
                        >
                            <Plus size={20} />
                            <span>Adicionar Oração</span>
                        </button>
                    )}
                </div>
            </section>

            <ResourceList />

            <LearningJournal />
        </div>
    );
}
