import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ChevronDown, Mail } from 'lucide-react';
import { useState } from 'react';
import './Settings.css';

export default function HelpSupport() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { id: 1, q: "Como crio uma Aliança?", a: "Vá para a aba 'Sua Aliança', clique em 'Gerenciar Grupo' e siga as instruções para criar uma nova." },
        { id: 2, q: "Posso alterar meu nome de usuário?", a: "Sim, através da tela de Perfil você pode editar suas informações pessoais." },
        { id: 3, q: "O aplicativo é gratuito?", a: "Temos um plano gratuito e um plano Premium com recursos exclusivos." },
    ];

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="settings-screen-container">
            <header className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Ajuda e Suporte</h1>
            </header>

            <div className="settings-content">
                <div className="settings-card">
                    <div className="link-item" onClick={() => window.open('mailto:suporte@alianca.app')}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="setting-icon icon-bg-blue">
                                <Mail size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Entrar em Contato</span>
                                <span className="setting-desc">Fale com nosso time</span>
                            </div>
                        </div>
                    </div>

                    <div className="link-item" style={{ borderBottom: 'none' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="setting-icon icon-bg-green">
                                <MessageCircle size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Chat em Tempo Real</span>
                                <span className="setting-desc">Disponível 9h às 18h</span>
                            </div>
                        </div>
                    </div>
                </div>

                <label className="section-label">Perguntas Frequentes</label>
                <div className="settings-card">
                    {faqs.map((faq) => (
                        <div key={faq.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem', cursor: 'pointer' }} onClick={() => toggleFaq(faq.id)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: openFaq === faq.id ? '0.5rem' : '0' }}>
                                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{faq.q}</span>
                                <ChevronDown size={16} style={{ transform: openFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                            </div>
                            {openFaq === faq.id && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-sec)', lineHeight: '1.4' }}>
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
