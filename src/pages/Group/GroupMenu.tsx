import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Link as LinkIcon, ChevronRight, LogOut, Copy, Home, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { groupService, type Group } from '../../services/groupService';
import './GroupMenu.css';
import './GroupInfo.css';
import './DetailActions.css';

export default function GroupMenu() {
    const navigate = useNavigate();
    const [activeGroup, setActiveGroup] = useState<Group | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showCode, setShowCode] = useState(false);

    const loadGroup = useCallback(async () => {
        const group = await groupService.getUserGroup();
        if (group) {
            // Fetch full details including members
            const fullGroup = await groupService.getGroupDetails(group.id);
            setActiveGroup(fullGroup);
            setShowDetails(true); // Auto-show details
        } else {
            setActiveGroup(null);
        }
    }, []);

    useEffect(() => {
        loadGroup();
    }, [loadGroup]);

    const handleLeave = async () => {
        if (confirm('Tem certeza que deseja sair do grupo?')) {
            if (activeGroup) {
                await groupService.leaveGroup(activeGroup.id);
            }
            setShowDetails(false);
            loadGroup();
        }
    };

    const handleMyGroup = () => {
        if (activeGroup) {
            setShowDetails(true);
        } else {
            alert('Você ainda não está em um grupo.');
        }
    };

    const handleJoinPartner = async () => {
        if (activeGroup) {
            if (!confirm('Você já está em um grupo. Deseja sair para entrar em outro?')) {
                return;
            }
            await groupService.leaveGroup(activeGroup.id);
            loadGroup();
            setShowDetails(false);
        }
        navigate('entrar');
    };

    const handleCreate = async () => {
        if (activeGroup) {
            if (!confirm('Você já está em um grupo. Deseja sair para criar um novo?')) {
                return;
            }
            await groupService.leaveGroup(activeGroup.id);
            loadGroup();
            setShowDetails(false);
        }
        navigate('criar');
    };

    if (showDetails && activeGroup) {
        return (
            <div className="group-screen-container">
                <header className="group-header">
                    <button className="back-btn" onClick={() => setShowDetails(false)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="header-title">Minha Aliança</h1>
                </header>

                <div className="group-menu-content">
                    {/* Action Buttons */}
                    <div className="action-buttons-grid">
                        <button className="action-btn-primary" onClick={() => navigate('/app')}>
                            <div className="btn-icon-wrapper">
                                <Home size={24} />
                            </div>
                            <div className="btn-text">
                                <span className="btn-title">Acessar Aliança</span>
                                <span className="btn-desc">Ir para painel</span>
                            </div>
                            <ChevronRight className="btn-arrow" />
                        </button>

                        <button className="action-btn-secondary" onClick={() => navigate('gerenciar')}>
                            <div className="btn-icon-wrapper secondary-wrapper">
                                <PlusCircle size={24} />
                            </div>
                            <div className="btn-text">
                                <span className="btn-title">Gerenciar Aliança</span>
                                <span className="btn-desc">Editar e configurar</span>
                            </div>
                        </button>
                    </div>

                    <div className="active-group-card">
                        <div className="group-info-header">
                            <div className="group-name-large">{activeGroup.name || 'Aliança'}</div>
                            <span className="label">Código do Grupo</span>
                            <div className="code-display">
                                <span className="code-text" style={{ fontFamily: showCode ? 'monospace' : 'inherit', letterSpacing: showCode ? '2px' : '4px' }}>
                                    {showCode ? activeGroup.code : '••••••'}
                                </span>
                                <div className="code-actions">
                                    <button className="icon-btn-small" onClick={() => setShowCode(!showCode)}>
                                        {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button className="icon-btn-small" onClick={() => {
                                        navigator.clipboard.writeText(activeGroup.code);
                                        alert('Código copiado!');
                                    }}>
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="members-list">
                            <span className="label">Membros</span>
                            {activeGroup.members?.map((member, i) => (
                                <div key={i} className="member-item">
                                    <div className="member-avatar">
                                        {(member.profile?.name?.[0] || '?').toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>{member.profile?.name || 'Membro'}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-sec)' }}>
                                            {member.role === 'admin' ? 'Admin' : 'Membro'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="menu-list" style={{ marginTop: '2rem' }}>
                            <button className="menu-item" onClick={handleLeave} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                <div className="menu-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                                    <LogOut size={24} />
                                </div>
                                <div className="menu-info">
                                    <span className="menu-title" style={{ color: '#ef4444' }}>Sair do Grupo</span>
                                    <span className="menu-desc">Desconectar deste grupo</span>
                                </div>
                                <ChevronRight className="menu-arrow" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group-screen-container">
            <header className="group-header">
                <button className="back-btn" onClick={() => navigate('/app/perfil')}>
                    <ArrowLeft size={24} />
                </button>
            </header>

            <div className="group-menu-content">
                <h1 className="group-title">Gerenciar Aliança</h1>
                <p className="group-subtitle">
                    Configure sua conexão com seu parceiro(a).
                </p>

                <div className="menu-list">

                    {/* Button 1: My Group - Only visible if in a group */}
                    {activeGroup && (
                        <button className="menu-item" onClick={handleMyGroup}>
                            <div className="menu-icon icon-purple">
                                <Home size={24} />
                            </div>
                            <div className="menu-info">
                                <span className="menu-title">Minha Aliança Atual</span>
                                <span className="menu-desc">Ver detalhes do grupo ativo</span>
                            </div>
                            <ChevronRight className="menu-arrow" />
                        </button>
                    )}

                    {/* Button 2: Join Partner */}
                    <button className="menu-item" onClick={handleJoinPartner}>
                        <div className="menu-icon icon-blue">
                            <LinkIcon size={24} />
                        </div>
                        <div className="menu-info">
                            <span className="menu-title">Entrar em Grupo</span>
                            <span className="menu-desc">Usar código de parceiro</span>
                        </div>
                        <ChevronRight className="menu-arrow" />
                    </button>

                    {/* Button 3: Create New */}
                    <button className="menu-item" onClick={handleCreate}>
                        <div className="menu-icon icon-green">
                            <PlusCircle size={24} />
                        </div>
                        <div className="menu-info">
                            <span className="menu-title">Criar Novo Grupo</span>
                            <span className="menu-desc">Gerar um novo código</span>
                        </div>
                        <ChevronRight className="menu-arrow" />
                    </button>
                </div>
            </div>
        </div>
    );
}
