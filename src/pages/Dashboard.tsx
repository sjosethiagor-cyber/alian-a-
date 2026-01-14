import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, ShoppingCart, DollarSign, ListTodo, Plus, MapPin, Calendar
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();

    const days = [
        { day: 'SEG', num: '21' },
        { day: 'TER', num: '22' },
        { day: 'QUA', num: '23' },
        { day: 'QUI', num: '24', active: true },
        { day: 'SEX', num: '25' },
        { day: 'SÁB', num: '26' },
        { day: 'DOM', num: '27' },
    ];

    const categories = [
        {
            id: 'tasks',
            icon: CheckCircle,
            label: 'Tarefas',
            count: '3 pendentes',
            sub: 'Casa & Organização',
            color: '#4169ff', // Blue
            bg: 'rgba(65, 105, 255, 0.1)',
            path: 'rotina'
        },
        {
            id: 'shopping',
            icon: ShoppingCart,
            label: 'Compras',
            count: '12 itens',
            sub: 'Mercado Semanal',
            color: '#10b981', // Green
            bg: 'rgba(16, 185, 129, 0.1)',
            path: 'atividades'
        },
        {
            id: 'finance',
            icon: DollarSign,
            label: 'Finanças',
            count: '',
            sub: 'Contas & Metas',
            color: '#8b5cf6', // Purple
            bg: 'rgba(139, 92, 246, 0.1)',
            btnText: 'Viagem', // Tag instead of count
            path: 'financas' // assuming route
        },
        {
            id: 'checklists',
            icon: ListTodo,
            label: 'Checklists',
            count: '',
            sub: 'Listas Rápidas',
            color: '#f59e0b', // Orange
            bg: 'rgba(245, 158, 11, 0.1)',
            btnText: 'Viagem',
            path: 'atividades'
        },
    ];

    const activities = [
        {
            user: 'Ana',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            action: 'completou',
            target: 'Pagar conta de luz',
            time: '10min'
        },
        {
            user: 'Ana',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            action: 'adicionou',
            target: 'Comprar leite à lista',
            time: '2h'
        },
        {
            user: 'Você',
            avatar: 'user_me',
            action: 'pagou',
            target: 'Aluguel',
            time: '1d'
        },
    ];

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="home-header">
                <div>
                    <span className="header-date">QUINTA-FEIRA, 24 OUT</span>
                    <h1 className="header-greeting">
                        Bom dia,<br />
                        <span className="text-highlight">Lucas & Ana</span>
                    </h1>
                </div>
                <div className="couple-avatars">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Ana" className="avatar avatar-1" />
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="Lucas" className="avatar avatar-2" />
                </div>
            </header>

            {/* Date Strip */}
            <div className="date-strip-container">
                <div className="date-strip">
                    {days.map((d) => (
                        <div key={d.day} className={`date-item ${d.active ? 'active' : ''}`}>
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
                            <h2 className="highlight-title">Jantar de Aniversário</h2>
                            <div className="highlight-location">
                                <MapPin size={16} />
                                <span>Restaurante Le Jardin</span>
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
                                {cat.id === 'finance' || cat.id === 'checklists' ? (
                                    <span className="category-tag">Viagem</span>
                                ) : (
                                    <span className="category-count">{cat.count}</span>
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

            {/* Recent Activity */}
            <section className="section-activity">
                <h3 className="section-title">Atividade Recente</h3>
                <div className="activity-list">
                    {activities.map((act, idx) => (
                        <div key={idx} className="activity-row">
                            <div className="activity-avatar-container">
                                {act.user === 'Você' ? (
                                    <div className="avatar-placeholder">L</div>
                                ) : (
                                    <img src={act.avatar} alt={act.user} className="activity-avatar" />
                                )}
                            </div>
                            <div className="activity-details">
                                <p className="activity-text">
                                    <span className="activity-user">{act.user}</span> {act.action} <span className="activity-target">{act.target}</span>
                                </p>
                            </div>
                            <span className="activity-time">{act.time}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAB */}
            <button className="fab-add">
                <Plus size={28} />
            </button>
        </div>
    );
}
