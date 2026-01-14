import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, FileText, Globe, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './Settings.css';

export default function Privacy() {
    const navigate = useNavigate();
    const [publicProfile, setPublicProfile] = useState(false);
    const [shareProgress, setShareProgress] = useState(true);

    return (
        <div className="settings-screen-container">
            <header className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Privacidade e Dados</h1>
            </header>

            <div className="settings-content">
                <div className="settings-card">

                    {/* Public Profile */}
                    <div className="setting-toggle-item" onClick={() => setPublicProfile(!publicProfile)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Globe size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Perfil Público</span>
                                <span className="setting-desc">Permitir que outros encontrem você</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${publicProfile ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                    {/* Share Progress */}
                    <div className="setting-toggle-item" onClick={() => setShareProgress(!shareProgress)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <Eye size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Compartilhar Progresso</span>
                                <span className="setting-desc">Visível para sua aliança</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${shareProgress ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                </div>

                <label className="section-label">Legal</label>
                <div className="settings-card">
                    <div className="link-item">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <FileText size={20} className="text-sec" />
                            <span>Termos de Uso</span>
                        </div>
                    </div>
                    <div className="link-item" style={{ borderBottom: 'none' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Lock size={20} className="text-sec" />
                            <span>Política de Privacidade</span>
                        </div>
                    </div>
                </div>

                <button className="danger-btn" onClick={() => alert('Esta ação excluirá todos os seus dados permanentemente.')}>
                    <Trash2 size={20} style={{ marginRight: '8px' }} />
                    Excluir Minha Conta
                </button>
            </div>
        </div>
    );
}
