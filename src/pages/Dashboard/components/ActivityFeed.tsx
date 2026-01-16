import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, BookOpen, Film, Music, ShoppingCart,
    Map, Mic, Heart, ListTodo, Loader2
} from 'lucide-react';
import { activityService, type ActivityItem } from '../../../services/activityService';

export default function ActivityFeed() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentActivity();

        // Listen to focus to refresh capability if needed, 
        // but for now simple load on mount
    }, []);

    const loadRecentActivity = async () => {
        try {
            const data = await activityService.getRecentActivity(5);
            setActivities(data);
        } catch (error) {
            console.error('Error loading recent activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'movies': return Film;
            case 'bible': return BookOpen;
            case 'music': return Music;
            case 'shopping': return ShoppingCart;
            case 'travel': return Map;
            case 'podcast': return Mic;
            case 'couple': return Heart;
            default: return ListTodo;
        }
    };

    const getColors = (category: string) => {
        switch (category) {
            case 'movies': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
            case 'bible': return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
            case 'shopping': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
            default: return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        }
    };

    return (
        <>
            <section className="section-activity">
                <h3 className="section-title">Atividade Recente</h3>
                <div className="activity-list">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : activities.length > 0 ? (
                        activities.map(item => {
                            const Icon = getIcon(item.category);
                            const style = getColors(item.category);
                            return (
                                <div key={item.id} className="activity-item" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{
                                        padding: '8px',
                                        borderRadius: '10px',
                                        backgroundColor: style.bg,
                                        color: style.color
                                    }}>
                                        <Icon size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'capitalize' }}>
                                            {item.category === 'movies' ? 'Filmes' :
                                                item.category === 'bible' ? 'Devocional' :
                                                    item.category}
                                        </div>
                                    </div>
                                    {item.completed && (
                                        <div style={{
                                            padding: '4px 8px',
                                            borderRadius: '20px',
                                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#10b981',
                                            fontSize: '0.7rem'
                                        }}>
                                            Concluído
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                            Nenhuma atividade recente.
                        </p>
                    )}
                </div>
            </section>

            <button className="fab-add" onClick={() => navigate('/app/atividades')}>
                <Plus size={28} />
            </button>
        </>
    );
}
