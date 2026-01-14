import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckSquare, Wallet, User } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
    { label: 'Início', path: '/app', icon: LayoutDashboard },
    { label: 'Rotina', path: '/app/rotina', icon: Calendar },
    { label: 'Tarefas', path: '/app/atividades', icon: CheckSquare },
    { label: 'Caixa', path: '/app/financas', icon: Wallet },
    { label: 'Perfil', path: '/app/perfil', icon: User },
];

export default function BottomNav() {
    return (
        <div className="bottom-nav">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/app'}
                    className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </div>
    );
}
