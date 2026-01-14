import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Shield, User, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { groupService, type Group } from '../../services/groupService';
import './ManageGroup.css';

export default function ManageGroup() {
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | null>(null);
    const [groupName, setGroupName] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        loadGroup();
    }, []);

    const loadGroup = () => {
        const currentGroup = groupService.getUserGroup();
        if (!currentGroup) {
            navigate('/app/perfil/grupo');
            return;
        }
        setGroup(currentGroup);
        setGroupName(currentGroup.name);
    };

    const handleSaveName = () => {
        if (!group || !groupName.trim()) return;
        groupService.updateGroupName(group.id, groupName);
        loadGroup();
        alert('Nome do grupo atualizado!');
    };

    const handleRoleChange = (memberId: string, newRole: 'admin' | 'member') => {
        if (!group) return;
        groupService.updateMemberRole(group.id, memberId, newRole);
        loadGroup();
        setOpenMenuId(null);
    };

    const handleRemoveMember = (memberId: string) => {
        if (!group) return;
        if (confirm('Tem certeza que deseja remover este membro?')) {
            groupService.removeMember(group.id, memberId);
            loadGroup();
            setOpenMenuId(null);
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

    if (!group) return null;

    return (
        <div className="group-screen-container">
            <header className="group-header">
                <button className="back-btn" onClick={() => navigate('/app/perfil/grupo')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Gerenciar Aliança</h1>
            </header>

            <div className="manage-content">

                {/* Edit Name Section */}
                <div className="manage-section">
                    <label className="section-label">Nome do Grupo</label>
                    <div className="input-row">
                        <input
                            type="text"
                            className="manage-input"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button className="icon-btn-primary" onClick={handleSaveName}>
                            <Save size={20} />
                        </button>
                    </div>
                </div>

                {/* Manage Members Section */}
                <div className="manage-section">
                    <label className="section-label">Membros ({group.members.length})</label>
                    <div className="members-list-card">
                        {group.members.map((member) => (
                            <div key={member.id} className="member-manage-row">
                                <div className="member-avatar-small">
                                    {member.name[0].toUpperCase()}
                                </div>
                                <div className="member-info-col">
                                    <span className="member-name-text">
                                        {member.name} {member.id === 'user_me' && '(Você)'}
                                    </span>
                                    <span className="member-role-badge">
                                        {member.role === 'admin' ? 'Administrador' : 'Membro'}
                                    </span>
                                </div>

                                {/* Actions Menu Trigger */}
                                {member.id !== 'user_me' && (
                                    <div className="menu-wrapper">
                                        <button className="more-btn" onClick={(e) => toggleMenu(member.id, e)}>
                                            <MoreVertical size={20} />
                                        </button>

                                        {openMenuId === member.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => handleRoleChange(member.id, 'admin')}>
                                                    <Shield size={16} /> Tornar Admin
                                                </button>
                                                <button onClick={() => handleRoleChange(member.id, 'member')}>
                                                    <User size={16} /> Tornar Membro
                                                </button>
                                                <div className="divider"></div>
                                                <button className="danger" onClick={() => handleRemoveMember(member.id)}>
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

            </div>
        </div>
    );
}
