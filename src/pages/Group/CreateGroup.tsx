import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Edit2, Mail, Plus, Link as LinkIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { groupService } from '../../services/groupService';
import './CreateGroup.css';

export default function CreateGroup() {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    // Check if already in group
    useEffect(() => {
        if (groupService.getUserGroup()) {
            navigate('/app/perfil/grupo');
        }
    }, []);

    const handleCreate = () => {
        if (!groupName.trim()) {
            alert('Por favor, dê um nome ao grupo.');
            return;
        }

        groupService.createGroup(groupName);
        // Redirect to menu to see the created group and code
        navigate('/app/perfil/grupo');
    };

    return (
        <div className="group-screen-container">
            <header className="group-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Nova Aliança</h1>
            </header>

            <div className="create-group-content">
                {/* Photo Upload */}
                <div className="photo-upload-section">
                    <div className="photo-circle">
                        <Camera size={32} className="camera-icon" />
                        <button className="edit-photo-btn">
                            <Edit2 size={14} />
                        </button>
                    </div>
                    <p className="photo-hint">Toque para adicionar foto</p>
                </div>

                {/* Group Name Input */}
                <div className="form-section">
                    <label className="section-label-lg">Nome do Grupo</label>
                    <input
                        type="text"
                        className="group-name-input"
                        placeholder="Ex: Nossa Casa, Viagem 2024"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <p className="field-hint">Dê um nome especial para o seu espaço compartilhado.</p>
                </div>

                <div className="divider-line"></div>

                {/* Member Invite Section */}
                <div className="form-section">
                    <div className="section-header-row">
                        <label className="section-label-lg">Quem faz parte?</label>
                        <span className="member-count-badge">1/4 Membros</span>
                    </div>
                    <p className="field-hint">Convide seu parceiro(a) ou amigos para se juntarem a esta aliança. Máximo de 4 pessoas.</p>

                    <div className="members-list-card">
                        <div className="member-row">
                            <div className="member-avatar-circle">EU</div>
                            <div className="member-details">
                                <span className="member-name">Você (Admin)</span>
                                <span className="member-role">Organizador</span>
                            </div>
                            <CheckCircle2 size={20} className="status-check" />
                        </div>
                    </div>

                    <div className="invite-row">
                        <div className="input-wrapper-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                className="invite-input"
                                placeholder="Digite o e-mail do membro"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <button className="add-invite-btn">
                            <Plus size={24} />
                        </button>
                    </div>

                    <button className="copy-link-btn">
                        <LinkIcon size={18} /> Copiar link de convite
                    </button>
                </div>
            </div>

            <div className="bottom-action-container">
                <button className="create-action-btn" onClick={handleCreate}>
                    Criar Aliança <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
