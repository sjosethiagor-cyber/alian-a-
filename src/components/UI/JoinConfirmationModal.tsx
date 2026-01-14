import { X, CheckCircle2, Calendar, Heart, Lock } from 'lucide-react';
import './JoinConfirmationModal.css';

interface JoinConfirmationModalProps {
    groupName: string;
    inviterName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function JoinConfirmationModal({ groupName, inviterName, onConfirm, onCancel }: JoinConfirmationModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onCancel}>
                    <X size={24} />
                </button>

                <div className="modal-header-image">
                    <img
                        src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&h=150&fit=crop"
                        alt="Group"
                        className="modal-avatar"
                    />
                    <div className="heart-badge">
                        <Heart size={14} fill="white" />
                    </div>
                </div>

                <h2 className="modal-title">{groupName}</h2>
                <div className="inviter-badge">
                    Convidado por <strong>{inviterName}</strong>
                </div>

                <p className="modal-desc">
                    Ao entrar, você terá acesso às listas de tarefas e agenda compartilhada.
                    <br /><br />
                    <strong>Deseja entrar neste grupo?</strong>
                </p>

                <div className="features-grid">
                    <div className="feature-item">
                        <CheckCircle2 size={20} className="feature-icon" />
                        <span>TAREFAS</span>
                    </div>
                    <div className="feature-item">
                        <Calendar size={20} className="feature-icon" />
                        <span>AGENDA</span>
                    </div>
                </div>

                <button className="confirm-join-btn" onClick={onConfirm}>
                    Entrar no Grupo
                </button>

                <button className="cancel-join-btn" onClick={onCancel}>
                    Não, voltar
                </button>

                <div className="security-note">
                    <Lock size={12} /> Seus dados são sincronizados com criptografia
                </div>

            </div>
        </div>
    );
}
