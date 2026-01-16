import { useState } from 'react';
import { Send } from 'lucide-react';

export default function SharedInsights() {
    const [insight, setInsight] = useState('');

    return (
        <section style={{ marginBottom: '80px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>
                Insights Compartilhados
            </h3>

            <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {/* Existing Message Mock */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: '#3b82f6', overflow: 'hidden', flexShrink: 0
                    }}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julia" alt="Julia" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Julia</span>
                        <div style={{
                            backgroundColor: '#0f172a',
                            padding: '12px',
                            borderRadius: '0 16px 16px 16px',
                            color: '#e2e8f0',
                            fontSize: '0.9rem',
                            lineHeight: 1.5
                        }}>
                            Achei muito boa a ideia dos 3 potes (Lazer, Contas, Futuro). Vamos tentar?
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '24px',
                    padding: '8px 8px 8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <input
                        type="text"
                        placeholder="Escreva seu insight..."
                        value={insight}
                        onChange={(e) => setInsight(e.target.value)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                    <button style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
