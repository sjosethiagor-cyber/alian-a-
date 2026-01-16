import { useNavigate } from 'react-router-dom';
import { CheckCircle, DollarSign, ListTodo } from 'lucide-react';

interface CategoryGridProps {
    pendingTasks: number;
    shoppingItems: number;
    financeSummary: { total: number; pending: number };
}

export default function CategoryGrid({ pendingTasks, shoppingItems, financeSummary }: CategoryGridProps) {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'tasks',
            icon: CheckCircle,
            label: 'Tarefas',
            count: `${pendingTasks} pendentes`,
            sub: 'Casa & Organização',
            color: '#4169ff',
            bg: 'rgba(65, 105, 255, 0.1)',
            path: '/app/rotina'
        },
        {
            id: 'activities',
            icon: ListTodo,
            label: 'Atividades',
            count: `${shoppingItems} compras`,
            sub: 'Listas & Lazer',
            color: '#f59e0b',
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
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.1)',
            btnText: 'Acessar',
            path: '/app/financas'
        },
    ];

    return (
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
    );
}
