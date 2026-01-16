import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { groupService, type Member } from '../../../services/groupService';
import { routineService } from '../../../services/routineService';
import { activityService } from '../../../services/activityService';
import { financeService } from '../../../services/financeService';
import { BookOpen, Film } from 'lucide-react';

export interface DashboardHighlight {
    type: 'bible' | 'movie';
    title: string;
    time: string;
    location: string;
    coverUrl?: string;
    id: string;
    path: string;
    icon: any;
}

export function useDashboardData() {
    const location = useLocation();
    const { user, profile } = useAuth();

    const [loading, setLoading] = useState(true);
    const [financeSummary, setFinanceSummary] = useState({ total: 0, pending: 0 });
    const [shoppingItems, setShoppingItems] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [partner, setPartner] = useState<Member | null>(null);
    const [todayHighlight, setTodayHighlight] = useState<DashboardHighlight | null>(null);

    // Date Logic
    const [selectedDate, setSelectedDate] = useState(() => {
        if (location.state?.date) {
            const d = new Date(location.state.date);
            if (location.state.date.length === 10) {
                const [y, m, d_str] = location.state.date.split('-').map(Number);
                return new Date(y, m - 1, d_str);
            }
            return d;
        }
        return new Date();
    });

    useEffect(() => {
        if (location.state?.date) {
            const d = new Date(location.state.date);
            if (location.state.date.length === 10) {
                const [y, m, day] = location.state.date.split('-').map(Number);
                setSelectedDate(new Date(y, m - 1, day));
            } else {
                setSelectedDate(d);
            }
        }
    }, [location.state]);

    useEffect(() => {
        loadDashboardData();
    }, [user, selectedDate]);

    const loadDashboardData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // 1. Load Group & Partner
            const userGroup = await groupService.getUserGroup();
            if (userGroup) {
                const fullGroup = await groupService.getGroupDetails(userGroup.id);
                if (fullGroup) {
                    const partnerMember = fullGroup.members?.find(m => m.user_id !== user.id);
                    setPartner(partnerMember || null);
                }

                // 2. Load Pending Tasks (Routine)
                const routines = await routineService.getGroupRoutines(userGroup.id);
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                const dayOfWeek = selectedDate.getDay();

                const daysRoutines = routines.filter(r => {
                    if (r.frequency === 'daily') return true;
                    if (r.frequency === 'weekly' && r.week_days?.includes(dayOfWeek)) return true;
                    if (r.frequency === 'specific_date' && r.specific_date === selectedDateStr) return true;
                    return false;
                });

                const completions = await routineService.getCompletions(daysRoutines.map(r => r.id), selectedDateStr);
                const completedIds = new Set(completions.map(c => c.routine_id));
                const pendingCount = daysRoutines.filter(r => !completedIds.has(r.id)).length;

                setPendingTasks(pendingCount);
            }

            // 3. Load Shopping Items
            const shopping = await activityService.getItems('shopping');
            setShoppingItems(shopping.filter(i => !i.completed).length);

            // 4. Load Highlights (Bible & Movies)
            const bibleItems = await activityService.getItems('bible');
            const movieItems = await activityService.getItems('movies');
            const selectedDateStr = selectedDate.toISOString().split('T')[0];

            const filterByDate = (items: typeof bibleItems) => items.filter(item => {
                if (!item.meta) return false;
                try {
                    const meta = JSON.parse(item.meta);
                    return meta.scheduledDate === selectedDateStr;
                } catch { return false; }
            });

            const todaysStudies = filterByDate(bibleItems);
            const todaysMovies = filterByDate(movieItems);

            if (todaysStudies.length > 0) {
                const bestFit = todaysStudies.find(i => !i.completed) || todaysStudies[0];
                const meta = JSON.parse(bestFit.meta!);
                setTodayHighlight({
                    type: 'bible',
                    title: bestFit.name,
                    time: meta.scheduledTime || 'Dia todo',
                    location: 'Estudo Bíblico',
                    coverUrl: meta.coverUrl,
                    id: bestFit.id,
                    path: '/app/estudo',
                    icon: BookOpen
                });
            } else if (todaysMovies.length > 0) {
                const bestFit = todaysMovies.find(i => !i.completed) || todaysMovies[0];
                const meta = JSON.parse(bestFit.meta!);
                setTodayHighlight({
                    type: 'movie',
                    title: bestFit.name,
                    time: meta.scheduledTime || 'Horário de cinema',
                    location: 'Cinema em Casa',
                    coverUrl: meta.posterUrl,
                    id: bestFit.id,
                    path: '/app/atividades',
                    icon: Film
                });
            } else {
                setTodayHighlight(null);
            }

            // 5. Load Finance Summary
            const transactions = await financeService.getTransactions();
            const total = transactions.reduce((acc, t) => {
                return t.type === 'income' ? acc + t.amount : acc - t.amount;
            }, 0);
            setFinanceSummary({ total, pending: 0 });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        profile,
        partner,
        selectedDate,
        setSelectedDate,
        pendingTasks,
        shoppingItems,
        financeSummary,
        todayHighlight
    };
}
