import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    CheckCircle, ShoppingCart, DollarSign, ListTodo, Plus, MapPin, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { groupService, type Group } from '../services/groupService';
import { routineService } from '../services/routineService';
import { activityService } from '../services/activityService';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [shoppingItems, setShoppingItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            // 1. Load Group Details (for partner name)
            const currentGroup = await groupService.getUserGroup();
            if (currentGroup) {
                const details = await groupService.getGroupDetails(currentGroup.id);
                setGroup(details);
            }

            // 2. Load Pending Tasks
            if (currentGroup) {
                const tasks = await routineService.getGroupRoutines(currentGroup.id);
                // Calculate pending for today
                const todayStr = new Date().toISOString().split('T')[0];
                const completions = await routineService.getCompletions(tasks.map(t => t.id), todayStr);
                const userCompletions = completions.filter(c => c.user_id === user?.id);
                const completedSet = new Set(userCompletions.map(c => c.routine_id));
                setPendingTasks(tasks.length - completedSet.size);
            }

            // 3. Load Shopping Items
            const items = await activityService.getItems('shopping');
            setShoppingItems(items.filter(i => !i.completed).length);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Date Logic
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const dateString = today.toLocaleDateString('pt-BR', dateOptions).toUpperCase();

    // Generate week days
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + i); // Start from Sunday? Or Monday? Let's center around today or just show current week
        // Let's just show -3 to +3 days
        return d;
    }).map((_, i) => {
        // const isToday = d.toDateString() === today.toDateString(); // Removed unused
        const start = new Date(today);
        start.setDate(today.getDate() - 3 + i);
        return {
            day: start.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
            num: start.getDate(),
            active: i === 3
        };
    });

    // Partner Name Logic
    const partner = group?.members?.find(m => m.user_id !== user?.id);
    const partnerName = partner?.profile?.name || 'Seu Amor';

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
            id: 'shopping',
            icon: ShoppingCart,
            label: 'Compras',
            count: `${shoppingItems} itens`,
            sub: 'Mercado Semanal',
            color: '#10b981', // Green
            bg: 'rgba(16, 185, 129, 0.1)',
            path: '/app/atividades'
        },
        {
            id: 'finance',
            icon: DollarSign,
            label: 'Finanças',
            count: '',
            sub: 'Contas & Metas',
            color: '#8b5cf6', // Purple
            bg: 'rgba(139, 92, 246, 0.1)',
            btnText: 'Acessar',
            path: '/app/financas'
        },
        {
            id: 'checklists',
            icon: ListTodo,
            label: 'Atividades',
            count: '',
            sub: 'Listas Gerais',
            color: '#f59e0b', // Orange
            bg: 'rgba(245, 158, 11, 0.1)',
            btnText: 'Ver',
            path: '/app/atividades'
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

            {/* Activity Feed Placeholder - can be real later */}
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
