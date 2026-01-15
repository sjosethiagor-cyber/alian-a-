import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    CheckCircle, DollarSign, ListTodo, Plus, MapPin, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { groupService, type Member } from '../services/groupService';
import { routineService } from '../services/routineService';
import { activityService } from '../services/activityService';
import { financeService } from '../services/financeService';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [financeSummary, setFinanceSummary] = useState({ total: 0, pending: 0 });
    const [shoppingItems, setShoppingItems] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [partner, setPartner] = useState<Member | null>(null);

    // Derived State
    const partnerName = partner?.profile?.name || 'Parceiro';

    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Generate week days (centered on today or start of week)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        // Start from 3 days ago to show a window, or start from Sunday? 
        // Let's check the UI snapshot logic implied. Usually "current week".
        // Let's just do a simple window around today for now [-3, +3]
        d.setDate(today.getDate() - 3 + i);
        return {
            day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
            num: d.getDate(),
            active: d.getDate() === today.getDate() && d.getMonth() === today.getMonth()
        };
    });

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // 1. Load Group & Partner
            const userGroup = await groupService.getUserGroup();
            if (userGroup) {
                // Determine partner (anyone else in the group)
                // We need to fetch details to get members
                const fullGroup = await groupService.getGroupDetails(userGroup.id);
                if (fullGroup) {
                    const partnerMember = fullGroup.members?.find(m => m.user_id !== user.id);
                    setPartner(partnerMember || null);
                }

                // 2. Load Pending Tasks (Routine)
                const routines = await routineService.getGroupRoutines(userGroup.id);
                const todayStr = today.toISOString().split('T')[0];
                const dayOfWeek = today.getDay(); // 0 = Sun

                // Filter routines for today
                const todaysRoutines = routines.filter(r => {
                    if (r.frequency === 'daily') return true;
                    if (r.frequency === 'weekly' && r.week_days?.includes(dayOfWeek)) return true;
                    if (r.frequency === 'specific_date' && r.specific_date === todayStr) return true;
                    return false;
                });

                // Check completions
                const completions = await routineService.getCompletions(todaysRoutines.map(r => r.id), todayStr);
                const completedIds = new Set(completions.map(c => c.routine_id));
                const pendingCount = todaysRoutines.filter(r => !completedIds.has(r.id)).length;

                setPendingTasks(pendingCount);
            }

            // 3. Load Shopping Items
            const shopping = await activityService.getItems('shopping');
            setShoppingItems(shopping.filter(i => !i.completed).length);

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
                        <div key={idx} className={`date-item ${d.active ? 'active' : ''}`}>
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
                <div className="highlight-card">
                    <div className="highlight-overlay" />
                    <div className="highlight-content">
                        <div className="highlight-top">
                            <span className="time-tag">20:00</span>
                            <button className="calendar-btn">
                                <Calendar size={18} />
                            </button>
                        </div>
                        <div className="highlight-bottom">
                            <h2 className="highlight-title">Jantar Especial</h2>
                            <div className="highlight-location">
                                <MapPin size={16} />
                                <span>Casa</span>
                            </div>
                        </div>
                    </div>
                </div>
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
