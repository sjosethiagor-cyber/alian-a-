import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    CheckCircle, DollarSign, ListTodo, Plus, Calendar, BookOpen, Film
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { groupService, type Member } from '../services/groupService';
import { routineService } from '../services/routineService';
import { activityService } from '../services/activityService';
import { financeService } from '../services/financeService';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [financeSummary, setFinanceSummary] = useState({ total: 0, pending: 0 });
    const [shoppingItems, setShoppingItems] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [partner, setPartner] = useState<Member | null>(null);
    const [todayHighlight, setTodayHighlight] = useState<any>(null);

    // Date Logic
    const [selectedDate, setSelectedDate] = useState(() => {
        if (location.state?.date) {
            // Handle YYYY-MM-DD or full date string
            const d = new Date(location.state.date);
            // Adjust for timezone offset to prevent day shifting if purely YYYY-MM-DD
            if (location.state.date.length === 10) {
                const [y, m, d_str] = location.state.date.split('-').map(Number);
                return new Date(y, m - 1, d_str);
            }
            return d;
        }
        return new Date();
    });

    // Derived State
    const partnerName = partner?.profile?.name || 'Parceiro';

    const dateString = selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Generate week days (centered on selectedDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(selectedDate);
        d.setDate(selectedDate.getDate() - 3 + i);
        return {
            day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
            num: d.getDate(),
            fullDate: d,
            active: d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth()
        };
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
                // Determine partner
                const fullGroup = await groupService.getGroupDetails(userGroup.id);
                if (fullGroup) {
                    const partnerMember = fullGroup.members?.find(m => m.user_id !== user.id);
                    setPartner(partnerMember || null);
                }

                // 2. Load Pending Tasks (Routine)
                const routines = await routineService.getGroupRoutines(userGroup.id);
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                const dayOfWeek = selectedDate.getDay(); // 0 = Sun

                // Filter routines for selectedDate
                const daysRoutines = routines.filter(r => {
                    if (r.frequency === 'daily') return true;
                    if (r.frequency === 'weekly' && r.week_days?.includes(dayOfWeek)) return true;
                    if (r.frequency === 'specific_date' && r.specific_date === selectedDateStr) return true;
                    return false;
                });

                // Check completions
                const completions = await routineService.getCompletions(daysRoutines.map(r => r.id), selectedDateStr);
                const completedIds = new Set(completions.map(c => c.routine_id));
                const pendingCount = daysRoutines.filter(r => !completedIds.has(r.id)).length;

                setPendingTasks(pendingCount);
            }

            // 3. Load Shopping Items (General, not strictly date bound yet, but keeping as is)
            const shopping = await activityService.getItems('shopping');
            setShoppingItems(shopping.filter(i => !i.completed).length);

            // 3.5 Load Highlights (Bible & Movies)
            const bibleItems = await activityService.getItems('bible');
            const movieItems = await activityService.getItems('movies');
            const selectedDateStr = selectedDate.toISOString().split('T')[0];

            // Helper to check date
            const filterByDate = (items: typeof bibleItems) => items.filter(item => {
                if (!item.meta) return false;
                try {
                    const meta = JSON.parse(item.meta);
                    return meta.scheduledDate === selectedDateStr;
                } catch { return false; }
            });

            const todaysStudies = filterByDate(bibleItems);
            const todaysMovies = filterByDate(movieItems);

            // Merge and pick one
            // Priority: Bible Study > Movie (or just first found)
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
                    coverUrl: meta.posterUrl, // Use poster for movies
                    id: bestFit.id,
                    path: '/app/atividades',
                    icon: Film
                });
            } else {
                setTodayHighlight(null);
            }


            // 4. Load Finance Summary
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

    const categories = [
        {
            id: 'tasks',
            icon: CheckCircle,
            label: 'Tarefas',
            count: `${pendingTasks} pendentes`,
            sub: 'Casa & Organização',
            color: '#4169ff', // Blue
            bg: 'rgba(65, 105, 255, 0.1)',
            path: '/app/rotina'
        },
        {
            id: 'activities', // Merged Activities
            icon: ListTodo,
            label: 'Atividades',
            count: `${shoppingItems} compras`, // Example priority
            sub: 'Listas & Lazer',
            color: '#f59e0b', // Orange
            bg: 'rgba(245, 158, 11, 0.1)',
            btnText: 'Ver',
            path: '/app/atividades'
        },
        {
            id: 'finance',
            icon: DollarSign,
            label: 'Finanças',
            count: financeSummary.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            sub: 'Saldo Atual',
            color: '#8b5cf6', // Purple
            bg: 'rgba(139, 92, 246, 0.1)',
            btnText: 'Acessar',
            path: '/app/financas'
        },
    ];

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="home-header">
                <div>
                    <span className="header-date">{dateString}</span>
                    <h1 className="header-greeting">
                        {loading ? 'Carregando...' : (
                            <>
                                Bom dia,<br />
                                <span className="text-highlight">
                                    {profile?.name ? profile.name.split(' ')[0] : 'Você'} & {partnerName.split(' ')[0]}
                                </span>
                            </>
                        )}
                    </h1>
                </div>
                <div className="couple-avatars">
                    <div className="avatar avatar-1">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            (profile?.name?.[0] || 'V').toUpperCase()
                        )}
                    </div>
                    <div className="avatar avatar-2">
                        {partner?.profile?.avatar_url ? (
                            <img src={partner.profile.avatar_url} alt="Partner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            (partnerName?.[0] || '?').toUpperCase()
                        )}
                    </div>
                </div>
            </header>

            {/* Date Strip */}
            <div className="date-strip-container">
                <div className="date-strip">
                    {weekDays.map((d, idx) => (
                        <div
                            key={idx}
                            className={`date-item ${d.active ? 'active' : ''}`}
                            onClick={() => setSelectedDate(d.fullDate)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="day-label">{d.day}</span>
                            <span className="day-number">{d.num}</span>
                            {d.active && <div className="active-dot" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlight Card */}
            <section className="section-highlight">
                <h3 className="section-title">Destaque de Hoje</h3>
                {todayHighlight ? (
                    <div className="highlight-card" onClick={() => navigate(todayHighlight.path)}>
                        <div className="highlight-overlay"
                            style={todayHighlight.coverUrl ? {
                                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent), url(${todayHighlight.coverUrl})`,
                                opacity: 1
                            } : {}}
                        />
                        <div className="highlight-content">
                            <div className="highlight-top">
                                <span className="time-tag">{todayHighlight.time}</span>
                                <button className="calendar-btn">
                                    <todayHighlight.icon size={18} />
                                </button>
                            </div>
                            <div className="highlight-bottom">
                                <h2 className="highlight-title">{todayHighlight.title}</h2>
                                <div className="highlight-location">
                                    <Calendar size={16} />
                                    <span>{todayHighlight.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="highlight-card">
                        <div className="highlight-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <span style={{ color: 'white', opacity: 0.7 }}>Nenhum destaque agendado</span>
                        </div>
                    </div>
                )}
            </section>

            {/* Categories Grid */}
            <section className="section-categories">
                <div className="section-header">
                    <h3 className="section-title">Categorias</h3>
                    <button className="view-all-btn">Ver tudo</button>
                </div>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-card" onClick={() => navigate(cat.path)}>
                            <div className="category-header">
                                <div className="category-icon" style={{ color: cat.color, backgroundColor: cat.bg }}>
                                    <cat.icon size={22} />
                                </div>
                                {cat.count ? (
                                    <span className="category-count">{cat.count}</span>
                                ) : (
                                    <span className="category-tag">{cat.btnText}</span>
                                )}
                            </div>
                            <div className="category-info">
                                <span className="category-name">{cat.label}</span>
                                <span className="category-sub">{cat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Activity Feed Placeholder */}
            <section className="section-activity">
                <h3 className="section-title">Atividade Recente</h3>
                <div className="activity-list">
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Nenhuma atividade recente encontrada.</p>
                </div>
            </section>

            {/* FAB */}
            <button className="fab-add" onClick={() => navigate('/app/atividades')}>
                <Plus size={28} />
            </button>
        </div>
    );
}
