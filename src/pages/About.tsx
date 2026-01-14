import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Star, Twitter, Instagram } from 'lucide-react';
import './Settings.css';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="settings-screen-container">
            <header className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Sobre o Aliança</h1>
            </header>

            <div className="settings-content" style={{ alignItems: 'center', textAlign: 'center', marginTop: '1rem' }}>

                <img
                    src="https://images.unsplash.com/photo-1517263904808-5dc8b43b1c3f?w=100&h=100&fit=crop"
                    alt="Logo"
                    style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '1rem' }}
                />

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Aliança</h2>
                <p style={{ color: 'var(--text-sec)', fontSize: '0.9rem', marginBottom: '2rem' }}>Versão 2.4.0 (Build 2024.10)</p>

                <div className="settings-card" style={{ width: '100%', textAlign: 'left' }}>
                    <div className="link-item">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Globe size={20} className="text-sec" />
                            <span>Website Oficial</span>
                        </div>
                    </div>
                    <div className="link-item" style={{ borderBottom: 'none' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Star size={20} className="text-sec" />
                            <span>Avalie na App Store</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: '50%' }}>
                        <Instagram size={20} />
                    </button>
                    <button style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: '50%' }}>
                        <Twitter size={20} />
                    </button>
                </div>

                <p className="settings-desc" style={{ marginTop: '2rem', fontSize: '0.8rem' }}>
                    Feito com ❤️ por Aliança Inc.<br />
                    São Paulo, Brasil
                </p>

            </div>
        </div>
    );
}
