import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { type DashboardHighlight } from '../hooks/useDashboardData';

interface HighlightCardProps {
    highlight: DashboardHighlight | null;
}

export default function HighlightCard({ highlight }: HighlightCardProps) {
    const navigate = useNavigate();

    return (
        <section className="section-highlight">
            <h3 className="section-title">Destaque de Hoje</h3>
            {highlight ? (
                <div className="highlight-card" onClick={() => navigate(highlight.path)}>
                    <div className="highlight-overlay"
                        style={highlight.coverUrl ? {
                            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent), url(${highlight.coverUrl})`,
                            opacity: 1
                        } : {}}
                    />
                    <div className="highlight-content">
                        <div className="highlight-top">
                            <span className="time-tag">{highlight.time}</span>
                            <button className="calendar-btn">
                                <highlight.icon size={18} />
                            </button>
                        </div>
                        <div className="highlight-bottom">
                            <h2 className="highlight-title">{highlight.title}</h2>
                            <div className="highlight-location">
                                <Calendar size={16} />
                                <span>{highlight.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="highlight-card">
                    <div className="highlight-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <span style={{ color: 'white', opacity: 0.7 }}>Nenhum destaque agendado</span>
                    </div>
                </div>
            )}
        </section>
    );
}
