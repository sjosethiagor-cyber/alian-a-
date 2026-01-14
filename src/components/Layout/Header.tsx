import { useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/app': return 'Dashboard';
            case '/app/rotina': return 'Rotina';
            case '/app/atividades': return 'Atividades';
            case '/app/financas': return 'Finanças';
            case '/app/perfil': return 'Configurações';
            case '/app/perfil/grupo': return 'Gerenciar Grupo';
            case '/app/perfil/grupo/entrar': return 'Entrar no Grupo';
            case '/app/perfil/grupo/criar': return 'Criar Grupo';
            default: return 'Aliança';
        }
    };

    return (
        <header className="header">
            <h1 className="page-title">{getTitle()}</h1>
            <div className="header-actions">
                <div className="avatar">A</div>
            </div>
        </header>
    );
}
