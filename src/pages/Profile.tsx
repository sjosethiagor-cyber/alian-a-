import {
    Users, RefreshCw, Bell, Moon, Lock, HelpCircle, Info, ChevronRight, Pen
} from 'lucide-react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [syncEnabled, setSyncEnabled] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Theme initialization
    useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme !== 'light';
        setIsDarkMode(isDark);
        if (!isDark) {
            document.body.classList.add('light-theme');
        }
    });

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        if (confirm('Deseja realmente sair da conta?')) {
            localStorage.removeItem('user_token');
            navigate('/');
        }
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <section className="profile-header-section">
                <div className="avatar-container">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <button className="edit-avatar-btn">
                        <Pen size={14} />
                    </button>
                </div>
                <h2 className="profile-name">Ana Silva</h2>
                <p className="profile-email">ana.silva@email.com</p>
                <div className="premium-badge">Plano Premium</div>
            </section>

            {/* Sua Aliança */}
            <section className="settings-section">
                <label className="section-label">Sua Aliança</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('grupo')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Users size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Gerenciar Grupo</span>
                                <span className="setting-desc">Convidar ou remover parceiro</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-sec" />
                    </div>

                    <div className="setting-item" onClick={() => setSyncEnabled(!syncEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <RefreshCw size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Sincronização</span>
                                <span className="setting-desc">
                                    {syncEnabled ? 'Ativa • Atualizado agora' : 'Pausada'}
                                </span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${syncEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Preferências */}
            <section className="settings-section">
                <label className="section-label">Preferências</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('notificacoes')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-orange">
                                <Bell size={20} />
                            </div>
                            <span className="setting-title">Notificações</span>
                        </div>
                        <div className="setting-right">
                            <span className="notification-badge">2</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div className="setting-item" onClick={toggleTheme}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-purple">
                                <Moon size={20} />
                            </div>
                            <span className="setting-title">Aparência</span>
                        </div>
                        <div className="setting-right">
                            <span>{isDarkMode ? 'Escuro' : 'Claro'}</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div className="setting-item" onClick={() => navigate('privacidade')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Lock size={20} />
                            </div>
                            <span className="setting-title">Privacidade e Dados</span>
                        </div>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </section>

            {/* Suporte */}
            <section className="settings-section">
                <label className="section-label">Suporte</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('suporte')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <HelpCircle size={20} />
                            </div>
                            <span className="setting-title">Ajuda e Suporte</span>
                        </div>
                        <ChevronRight size={20} />
                    </div>

                    <div className="setting-item" onClick={() => navigate('sobre')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-gray">
                                <Info size={20} />
                            </div>
                            <span className="setting-title">Sobre o Aliança</span>
                        </div>
                        <div className="setting-right">
                            <span>v2.4.0</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </section>

            <button className="logout-btn" onClick={handleLogout}>
                Sair da Conta
            </button>

            <p className="version-text">
                Aliança Inc. © 2024. Todos os direitos reservados.
            </p>
        </div>
    );
}
