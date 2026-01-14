import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { groupService, type Group } from '../../services/groupService';
import { routineService, type RoutineItem } from '../../services/routineService';
import { Bell, MoreVertical, Check, TrendingUp, Eye, Plus, Dumbbell, BookOpen, Droplet, Brain, Clock, Film, Headphones, Scroll } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Routine.css';
import AddRoutineModal from './components/AddRoutineModal';

// Mapping local icon names to Lucide components for display
const iconMap: Record<string, React.ElementType> = {
    'dumbbell': Dumbbell,
    'book-open': BookOpen,
    'droplet': Droplet,
    'brain': Brain,
    'clock': Clock,
    'film': Film,
    'headphones': Headphones,
    'scroll': Scroll
};

export default function RoutinePage() {
    const { user, profile } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [routines, setRoutines] = useState<RoutineItem[]>([]);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [group, setGroup] = useState<Group | null>(null);

    // Generate calendar days (current week)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const currentGroup = await groupService.getUserGroup();
            if (!currentGroup) return;
            setGroup(currentGroup);

            // Load routines
            const items = await routineService.getGroupRoutines(currentGroup.id);
            setRoutines(items);

            // Load completions for selected date
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const completions = await routineService.getCompletions(items.map(i => i.id), dateStr);
            const userCompletions = completions.filter(c => c.user_id === user?.id);
            setCompletedIds(new Set(userCompletions.map(c => c.routine_id)));

            // Load Streak (Mock for now, or simple count)
            const streakCount = await routineService.getStreak(user!.id);
            setStreak(streakCount);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (routineId: string) => {
        const isCompleted = completedIds.has(routineId);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // Optimistic UI update
        const newSet = new Set(completedIds);
        if (isCompleted) newSet.delete(routineId);
        else newSet.add(routineId);
        setCompletedIds(newSet);

        try {
            await routineService.toggleCompletion(routineId, user!.id, dateStr, isCompleted);
        } catch (error) {
            console.error('Failed to toggle', error);
            // Revert on error
            setCompletedIds(completedIds);
        }
    };

    if (loading) {
        return (
            <div className="routine-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ color: 'var(--text-sec)' }}>Carregando rotina...</div>
            </div>
        );
    }

    return (
        <div className="routine-container">
            {/* Header */}
            <header className="routine-header">
                <div className="routine-user-info">
                    <div className="routine-user-avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="User" />
                        ) : (
                            <span style={{ color: 'white', fontWeight: 'bold' }}>{profile?.name?.[0]}</span>
                        )}
                    </div>
                    <div className="routine-greeting">
                        <h1>Minha Rotina</h1>
                        <span className="routine-date">
                            {format(new Date(), "eeee, d 'de' MMMM", { locale: ptBR })}
                        </span>
                    </div>
                </div>
                <div className="routine-actions">
                    <button className="icon-btn"><Bell size={20} /></button>
                    <button className="icon-btn"><MoreVertical size={20} /></button>
                </div>
            </header>

            {/* Streak Card */}
            <div className="streak-card">
                <div className="streak-info">
                    <h3>Constância Atual</h3>
                    <div className="streak-count">
                        <span className="streak-icon">🔥</span>
                        <span>{streak} Dias</span>
                    </div>
                    <div className="visibility-tag">
                        <Eye size={14} /> Visível para todos do grupo
                    </div>
                </div>
                <div className="streak-graph">
                    <TrendingUp size={24} />
                </div>
            </div>

            {/* Calendar Strip */}
            <div className="calendar-strip">
                {calendarDays.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <div
                            key={date.toISOString()}
                            className={`calendar-day ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="day-name">
                                {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                            </span>
                            <span className="day-number">{format(date, 'd')}</span>
                        </div>
                    );
                })}
            </div>

            {/* Tasks List */}
            <div className="tasks-section">
                <div className="tasks-header">
                    <span className="tasks-title">Tarefas de Hoje</span>
                    <span className="tasks-count">
                        {routines.filter(item => {
                            if (item.frequency === 'specific_date' && item.specific_date) {
                                return isSameDay(new Date(item.specific_date + 'T00:00:00'), selectedDate);
                            }
                            if (item.frequency === 'weekly' && item.week_days) {
                                return item.week_days.includes(selectedDate.getDay());
                            }
                            return true;
                        }).filter(i => completedIds.has(i.id)).length}
                        /
                        {routines.filter(item => {
                            if (item.frequency === 'specific_date' && item.specific_date) {
                                return isSameDay(new Date(item.specific_date + 'T00:00:00'), selectedDate);
                            }
                            if (item.frequency === 'weekly' && item.week_days) {
                                return item.week_days.includes(selectedDate.getDay());
                            }
                            return true;
                        }).length} feitas
                    </span>
                </div>

                <div className="tasks-list">
                    {routines.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-sec)', padding: '2rem' }}>
                            Nenhuma rotina cadastrada ainda.
                        </div>
                    )}

                    {routines
                        .filter(item => {
                            // Filter logic
                            if (item.frequency === 'specific_date' && item.specific_date) {
                                return isSameDay(new Date(item.specific_date + 'T00:00:00'), selectedDate);
                            }
                            if (item.frequency === 'weekly' && item.week_days) {
                                return item.week_days.includes(selectedDate.getDay());
                            }
                            return true;
                        })
                        .sort((a, b) => {
                            if (a.time && b.time) return a.time.localeCompare(b.time);
                            if (a.time) return -1;
                            if (b.time) return 1;
                            return 0;
                        })
                        .map((item) => {
                            const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : BookOpen;
                            const isDone = completedIds.has(item.id);

                            return (
                                <div key={item.id} className="task-card">
                                    <div className="task-icon-box">
                                        <IconComponent size={24} />
                                    </div>
                                    <div className="task-info">
                                        <span className="task-title">{item.title}</span>
                                        {item.description && (
                                            <span className="task-desc">{item.description}</span>
                                        )}
                                        {item.priority === 'high' && (
                                            <div className="priority-tag">ALTA PRIORIDADE</div>
                                        )}
                                    </div>
                                    <button
                                        className={`task-check ${isDone ? 'completed' : ''}`}
                                        onClick={() => toggleTask(item.id)}
                                    >
                                        {isDone && <Check size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* FAB */}
            <button className="fab-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={28} />
            </button>

            {group && (
                <AddRoutineModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        loadData(); // Refresh list
                    }}
                    groupId={group.id}
                />
            )}
        </div>
    );
}
