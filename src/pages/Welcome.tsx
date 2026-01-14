import { useNavigate } from 'react-router-dom';
import { ArrowRight, Infinity } from 'lucide-react';
import heroImg from '../assets/hero-rings.png';
import './Welcome.css';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            {/* Hero Section */}
            <div
                className="welcome-hero"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="brand-logo">
                    <Infinity size={24} />
                    <span>ALIANÇA</span>
                </div>
            </div>

            {/* Content Card */}
            <div className="welcome-content">
                <div className="handle-bar"></div>

                <h1 className="welcome-title">União, parceria e fé</h1>

                <div className="quote-container">
                    <p className="quote-text">
                        "Assim já não são dois, mas uma só carne. Portanto, o que Deus uniu, ninguém separe."
                    </p>
                    <span className="quote-reference">Mateus 19:6</span>
                </div>

                <div className="pagination">
                    <div className="dot active"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>

                <div className="button-group">
                    <button className="btn btn-primary" onClick={() => navigate('/auth')}>
                        Criar Conta <ArrowRight size={20} style={{ marginLeft: 8 }} />
                    </button>

                    <button className="btn btn-secondary" onClick={() => navigate('/auth')}>
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
}
