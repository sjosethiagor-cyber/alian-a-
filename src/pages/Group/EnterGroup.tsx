import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { groupService, type Group } from '../../services/groupService';
import JoinConfirmationModal from '../../components/UI/JoinConfirmationModal';
import './EnterGroup.css';

export default function EnterGroup() {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [foundGroup, setFoundGroup] = useState<Group | null>(null);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const checkGroup = async () => {
            const group = await groupService.getUserGroup();
            if (group) {
                navigate('/app/perfil/grupo');
            }
        };
        checkGroup();
    }, [navigate]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value[0];
        }
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleJoin = async () => {
        const fullCode = code.join('');

        if (fullCode.length < 6) {
            alert("Por favor, digite o código completo de 6 dígitos.");
            return;
        }

        try {
            const validGroup = await groupService.getGroupByCode(fullCode);
            if (validGroup) {
                setFoundGroup(validGroup);
            } else {
                alert("Código inválido ou grupo não encontrado.");
                setCode(['', '', '', '', '', '']);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar grupo.");
        }
    };

    const confirmJoin = async () => {
        if (!foundGroup) return;

        try {
            await groupService.joinGroup(foundGroup.code);
            navigate('/app/perfil/grupo');
        } catch (error: any) {
            alert(error.message || "Erro ao entrar no grupo.");
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
