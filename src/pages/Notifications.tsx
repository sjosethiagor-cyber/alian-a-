import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';
import './Settings.css'; // Reusing/Creating shared settings CSS

export default function Notifications() {
    const navigate = useNavigate();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [messagesEnabled, setMessagesEnabled] = useState(true);
    const [remindersEnabled, setRemindersEnabled] = useState(true);

    return (
        <div className="settings-screen-container">
            <header className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Notificações</h1>
            </header>

            <div className="settings-content">
                <p className="settings-desc">Escolha como você quer ser notificado sobre as atividades da aliança.</p>

                <div className="settings-card">

                    {/* Push */}
                    <div className="setting-toggle-item" onClick={() => setPushEnabled(!pushEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-orange">
                                <Bell size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Push Notifications</span>
                                <span className="setting-desc">Alertas no dispositivo</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${pushEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="setting-toggle-item" onClick={() => setEmailEnabled(!emailEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Mail size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Email</span>
                                <span className="setting-desc">Novidades e resumos</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${emailEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="setting-toggle-item" onClick={() => setMessagesEnabled(!messagesEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <MessageSquare size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Mensagens</span>
                                <span className="setting-desc">Chat do grupo</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${messagesEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                    {/* Reminders */}
                    <div className="setting-toggle-item" onClick={() => setRemindersEnabled(!remindersEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-purple">
                                <Clock size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Lembretes</span>
                                <span className="setting-desc">Tarefas e rotinas</span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${remindersEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
