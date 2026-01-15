import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, Info, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'input' | 'success'>('input');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setStep('success');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Erro ao enviar email de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        // Just logic to "resend" - in practice, users can just try again.
        // We can revert to step 'input' or call the API again here with debounce.
        // For UI simplicity, let's just alert or go back.
        alert('Reenviando e-mail...');
        // In a real app we would trigger the API again.
        supabase.auth.resetPasswordForEmail(email);
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <button className="back-btn-absolute" onClick={() => navigate('/auth')}>
                    <ArrowLeft size={24} />
                </button>

                {step === 'input' && (
                    <>
                        <div className="icon-header">
                            <div className="icon-circle">
                                <RefreshCw size={40} className="text-primary" color="#3b82f6" />
                                <div className="icon-badge">
                                    <Mail size={16} color="#4ade80" fill="#4ade80" />
                                </div>
                            </div>
                        </div>

                        <div className="text-content">
                            <h2 className="title">Esqueceu a senha?</h2>
                            <p className="subtitle">
                                Digite seu e-mail abaixo para receber o link de recuperação.
                            </p>
                        </div>

                        <form onSubmit={handleSendLink} className="forgot-form">
                            <div>
                                <label className="form-label">E-mail</label>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Mail size={18} className="input-right-icon" />
                                </div>
                            </div>

                            <button type="submit" className="send-btn" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                                <Send size={18} />
                            </button>
                        </form>

                        <div className="info-card">
                            <Info size={20} className="info-icon" />
                            <div className="info-text">
                                <span className="info-title">Dica de Segurança</span>
                                <span className="info-desc">
                                    O link expira em 30 minutos por segurança. Verifique sua pasta de Spam caso não encontre o e-mail.
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <>
                        <div className="icon-header">
                            <div className="icon-circle">
                                <Mail size={40} className="text-primary" color="#3b82f6" />
                                <div className="icon-badge">
                                    <CheckCircle size={20} color="#4ade80" fill="#4ade80" />
                                </div>
                            </div>
                        </div>

                        <div className="text-content">
                            <h2 className="title">Verifique seu e-mail</h2>
                            <p className="subtitle">
                                Enviamos as instruções de recuperação de senha para <span className="email-highlight">{email}</span>.
                            </p>
                            <p className="subtitle" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                O link expira em 30 minutos. Verifique sua caixa de entrada e a pasta de Spam.
                            </p>
                        </div>

                        <button className="send-btn" onClick={() => navigate('/auth')}>
                            Voltar ao Login
                        </button>

                        <div className="resend-link" onClick={handleResend}>
                            Não recebeu? Reenviar e-mail
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
