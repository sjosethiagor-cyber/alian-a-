import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ForgotPassword.css'; // Reusing styles

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check for error in hash (e.g. expired link)
        const hash = location.hash;
        if (hash && hash.includes('error_code')) {
            alert('Link inválido ou expirado. Por favor, solicite uma nova recuperação de senha.');
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) throw error;
            setSuccess(true);

            // Optional: Sign out to force re-login with new password or keep logged in
            // Usually simpler to just say "Success, please login" if the session wasn't fully established or to be safe.
            // But updateUser updates the session user. 

            // Let's redirect after a few seconds
            setTimeout(() => {
                navigate('/auth');
            }, 3000);

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Erro ao redefinir a senha.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-container">
                <div className="forgot-card">
                    <div className="icon-header">
                        <div className="icon-circle">
                            <CheckCircle size={40} className="text-primary" color="#4ade80" />
                        </div>
                    </div>
                    <div className="text-content">
                        <h2 className="title">Senha Alterada!</h2>
                        <p className="subtitle">
                            Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
                        </p>
                    </div>
                    <button className="send-btn" onClick={() => navigate('/auth')}>
                        Ir para Login agora
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <button className="back-btn-absolute" onClick={() => navigate('/auth')}>
                    <ArrowLeft size={24} />
                </button>

                <div className="icon-header">
                    <div className="icon-circle">
                        <Lock size={40} className="text-primary" color="#3b82f6" />
                    </div>
                </div>

                <div className="text-content">
                    <h2 className="title">Redefinir Senha</h2>
                    <p className="subtitle">
                        Crie uma nova senha para sua conta.
                    </p>
                </div>

                <form onSubmit={handleReset} className="forgot-form">
                    <div>
                        <label className="form-label">Nova Senha</label>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', display: 'flex', alignItems: 'center' }}
                            >
                                {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Confirmar Senha</label>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Repita a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="send-btn" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
