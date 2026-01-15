import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckSquare, User, BookOpen } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
    { label: 'Agenda', path: '/app', icon: Calendar },
    { label: 'Tarefas', path: '/app/rotina', icon: CheckSquare },
    { label: 'Estudo', path: '/app/estudo', icon: BookOpen },
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
