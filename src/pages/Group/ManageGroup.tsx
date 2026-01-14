import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Shield, User, MoreVertical, PlusCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { groupService, type Group } from '../../services/groupService';
import { useAuth } from '../../contexts/AuthContext';
import './ManageGroup.css';

export default function ManageGroup() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [groupName, setGroupName] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const loadGroup = useCallback(async () => {
        const currentGroup = await groupService.getUserGroup();
        if (!currentGroup) {
            navigate('/app/perfil/grupo');
            return;
        }
        // Fetch full details
        const fullGroup = await groupService.getGroupDetails(currentGroup.id);
        setGroup(fullGroup);
        if (fullGroup) setGroupName(fullGroup.name);
    }, [navigate]);

    useEffect(() => {
        loadGroup();
    }, [loadGroup]);

    const handleSaveName = async () => {
        if (!group || !groupName.trim()) return;
        try {
            await groupService.updateGroup(group.id, { name: groupName });
            alert('Nome do grupo atualizado!');
            loadGroup();
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar nome.');
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
        if (!group) return;
        try {
            await groupService.updateMemberRole(group.id, userId, newRole);
            loadGroup();
            setOpenMenuId(null);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar permissão.');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!group) return;
        if (confirm('Tem certeza que deseja remover este membro?')) {
            try {
                await groupService.removeMember(group.id, userId);
                loadGroup();
                setOpenMenuId(null);
            } catch (error) {
                console.error(error);
                alert('Erro ao remover membro.');
            }
        }
    };

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Close menus on click outside
    useEffect(() => {
        const closeMenu = () => setOpenMenuId(null);
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, []);

    if (!group) return <div>Carregando...</div>;

    const isCurrentUserAdmin = group.members?.some(
        m => m.user_id === user?.id && m.role === 'admin'
    );

    return (
        <div className="group-screen-container">
            <header className="group-header">
                <button className="back-btn" onClick={() => navigate('/app/perfil/grupo')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Gerenciar Aliança</h1>
            </header>

            <div className="manage-content">

                {/* Card 1: Avatar & Name */}
                <div className="manage-card">
                    <div className="avatar-section">
                        <div className="group-avatar-large">
                            {group.avatar_url ? (
                                <img src={group.avatar_url} alt="Grupo" />
                            ) : (
                                (group.name?.[0] || 'G').toUpperCase()
                            )}
                            {isCurrentUserAdmin && (
                                <label className="edit-avatar-btn">
                                    <PlusCircle size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={async (e) => {
                                            if (!e.target.files || e.target.files.length === 0) return;
                                            try {
                                                await groupService.uploadGroupAvatar(group.id, e.target.files[0]);
                                                loadGroup();
                                            } catch (err: any) {
                                                alert('Erro: ' + err.message);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        {isCurrentUserAdmin && <span className="change-photo-text">Alterar foto do grupo</span>}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label className="section-label">Nome do Grupo</label>
                        <div className="input-row">
                            <input
                                type="text"
                                className="manage-input"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                disabled={!isCurrentUserAdmin}
                                placeholder="Digite o nome do grupo"
                            />
                            {isCurrentUserAdmin && (
                                <button className="icon-btn-primary" onClick={handleSaveName}>
                                    <Save size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 2: Members */}
                <div className="manage-card">
                    <label className="section-label">Membros ({group.members?.length || 0})</label>
                    <div className="members-list">
                        {group.members?.map((member) => (
                            <div key={member.id} className="member-row">
                                <div className="member-avatar">
                                    {member.profile?.avatar_url ? (
                                        <img src={member.profile.avatar_url} alt={member.profile.name} />
                                    ) : (
                                        (member.profile?.name?.[0] || '?').toUpperCase()
                                    )}
                                </div>
                                <div className="member-info">
                                    <span className="member-name">
                                        {member.profile?.name || 'Usuário'} {member.user_id === user?.id && '(Você)'}
                                    </span>
                                    <span className="member-role">
                                        {member.role === 'admin' ? 'Administrador' : 'Membro'}
                                    </span>
                                </div>

                                {isCurrentUserAdmin && member.user_id !== user?.id && (
                                    <div className="menu-wrapper">
                                        <button className="more-btn" onClick={(e) => toggleMenu(member.id, e)}>
                                            <MoreVertical size={20} />
                                        </button>
                                        {openMenuId === member.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => handleRoleChange(member.user_id, 'admin')}>
                                                    <Shield size={16} /> Tornar Admin
                                                </button>
                                                <button onClick={() => handleRoleChange(member.user_id, 'member')}>
                                                    <User size={16} /> Tornar Membro
                                                </button>
                                                <div className="divider"></div>
                                                <button className="danger" onClick={() => handleRemoveMember(member.user_id)}>
                                                    <Trash2 size={16} /> Remover
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 3: Danger Zone */}
                {isCurrentUserAdmin && (
                    <div className="manage-card danger-zone">
                        <label className="danger-title">Zona de Perigo</label>
                        <p className="danger-desc">
                            A ação de excluir o grupo é permanente e não pode ser desfeita. Todos os dados serão perdidos.
                        </p>
                        <button className="delete-btn" onClick={async () => {
                            if (confirm('TEM CERTEZA? O grupo será apagado para sempre.')) {
                                if (group) {
                                    try {
                                        await groupService.deleteGroup(group.id);
                                        navigate('/app/perfil');
                                    } catch (e: any) {
                                        alert('Erro: ' + e.message);
                                    }
                                }
                            }
                        }}>
                            <Trash2 size={18} /> Excluir Grupo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
