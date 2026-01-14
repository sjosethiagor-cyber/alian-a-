import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, CheckSquare, Wallet, User,
    Film, Music, BookOpen, BookHeart, Headphones, Heart
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Rotina', path: '/app/rotina', icon: Calendar },
    { label: 'Atividades', path: '/app/atividades', icon: CheckSquare },
    { label: 'Finanças', path: '/app/financas', icon: Wallet },

    // Sub-items (Flatted for direct access)
    { label: 'Filmes e Séries', path: '/app/atividades/movies', icon: Film },
    { label: 'Músicas', path: '/app/atividades/music', icon: Music },
    { label: 'Estudo Bíblico', path: '/app/atividades/bible', icon: BookOpen },
    { label: 'Estudo para Oração', path: '/app/atividades/prayer', icon: BookHeart },
    { label: 'Podcast', path: '/app/atividades/podcast', icon: Headphones },
    { label: 'Lazer', path: '/app/atividades/couple', icon: Heart },

    { label: 'Perfil', path: '/app/perfil', icon: User },
];

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <h2 className="logo-text">ALIANÇA</h2>
            </div>
            <nav>
                <ul className="nav-list">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/app'} // Exact match for dashboard root
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
