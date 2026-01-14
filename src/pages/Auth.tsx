import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Infinity } from 'lucide-react';
import './Auth.css';

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate auth
        navigate('/app');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="logo-icon-container">
                        <Infinity size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="app-name">Aliança</h2>
                    <span className="tagline">Conecte-se e sincronize.</span>

                    <h1 className="auth-title">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Sincronize sua vida a dois em tempo real.'
                            : 'Comece hoje a organizar a vida a dois.'}
                    </p>
                </div>

                {/* Toggle */}
                <div className="auth-toggle">
                    <button
                        className={`toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Entrar
                    </button>
                    <button
                        className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Cadastrar
                    </button>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">E-mail</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="auth-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Senha</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="forgot-password">
                            Esqueceu a senha?
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Entrar' : 'Criar Conta'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="divider">Ou entre com</div>

                <div className="social-buttons">
                    <button className="social-btn">
                        {/* Google Icon SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="auth-footer">
                    Ao continuar, você concorda com nossos <a href="#">Termos</a> e <a href="#">Política de Privacidade</a>.
                </p>
            </div>
        </div>
    );
}
