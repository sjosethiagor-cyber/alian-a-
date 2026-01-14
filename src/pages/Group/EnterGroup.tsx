import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { groupService, type Group } from '../../services/groupService'; // Added type import
import JoinConfirmationModal from '../../components/UI/JoinConfirmationModal';
import './EnterGroup.css';

export default function EnterGroup() {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [foundGroup, setFoundGroup] = useState<Group | null>(null); // State for modal
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Paste handling simplistic
            value = value[0];
        }
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleJoin = () => {
        const fullCode = code.join('');

        if (fullCode.length < 6) {
            alert("Por favor, digite o código completo de 6 dígitos.");
            return;
        }

        // 1. Verify existence first (Preview)
        const validGroup = groupService.getGroupByCode(fullCode);

        if (validGroup) {
            setFoundGroup(validGroup); // TRIGGERS MODAL
        } else {
            alert("Código inválido ou grupo não encontrado.");
            setCode(['', '', '', '', '', '']);
        }
    };

    const confirmJoin = () => {
        if (!foundGroup) return;

        const result = groupService.joinGroup(foundGroup.code);
        if (result.success) {
            navigate('/app/perfil/grupo');
        } else {
            alert(result.message);
        }
        setFoundGroup(null);
    };


    return (
        <div className="group-screen-container">
            {foundGroup && (
                <JoinConfirmationModal
                    groupName={foundGroup.name || "Nova Aliança"}
                    inviterName="Parceiro(a)"
                    onConfirm={confirmJoin}
                    onCancel={() => setFoundGroup(null)}
                />
            )}

            {/* Header */}
            <header className="group-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
            </header>

            <div className="group-content">
                <div className="icon-badge">
                    <LinkIcon size={32} />
                </div>

                <h1 className="group-title">Entrar na Aliança</h1>
                <p className="group-subtitle">
                    Insira o código de 6 dígitos compartilhado pelo seu parceiro(a).
                </p>

                <div className="otp-container">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputsRef.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            placeholder="-"
                        />
                    ))}
                </div>

                <button className="primary-action-btn" onClick={handleJoin}>
                    Entrar no Grupo <ArrowRight size={20} />
                </button>

                <div className="help-link">
                    <HelpCircle size={16} />
                    <span>Onde encontro meu código?</span>
                </div>

                <div className="footer-link">
                    <span>Não tem um código?</span>
                    <button className="text-btn" onClick={() => navigate('/app/perfil/grupo/criar')}>
                        Criar novo grupo
                    </button>
                </div>
            </div>
        </div>
    );
}
