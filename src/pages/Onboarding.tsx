import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Calendar, Heart } from 'lucide-react';
import './Auth.css'; // Reusing Auth styles for consistency

export default function Onboarding() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        sex: '',
        city: '',
        state: '',
        spouse_name: '',
        dating_since: '',
        married_since: ''
    });

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error('Usuário não autenticado');

            if (!formData.name || !formData.birth_date || !formData.sex || !formData.city || !formData.state) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                name: formData.name,
                age: calculateAge(formData.birth_date), // Still saving calculated age for compatibility
                birth_date: formData.birth_date,
                sex: formData.sex,
                city: formData.city,
                state: formData.state,
                spouse_name: formData.spouse_name || null,
                dating_since: formData.dating_since || null,
                married_since: formData.married_since || null,
                updated_at: new Date()
            });
            if (error) throw error;

            await refreshProfile();
            navigate('/app');
        } catch (error: any) {
            alert('Erro ao salvar perfil: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="app-name">Bem-vindo(a)!</h2>
                    <p className="auth-subtitle">
                        Vamos configurar seu perfil para começar.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Nome Completo</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Como você quer ser chamado?"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="row-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="input-label">
                                Data de Nascimento
                                {formData.birth_date && <span style={{ marginLeft: '8px', color: 'var(--primary)', fontSize: '0.9em' }}>
                                    ({calculateAge(formData.birth_date)} anos)
                                </span>}
                            </label>
                            <div className="input-wrapper">
                                <Calendar className="input-icon" size={18} />
                                <input
                                    type="date"
                                    className="auth-input"
                                    required
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Sexo</label>
                            <div className="input-wrapper">
                                <Heart className="input-icon" size={18} />
                                <select
                                    className="auth-input"
                                    required
                                    value={formData.sex}
                                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                >
                                    <option value="" disabled>Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row-inputs" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Cidade</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="Sua cidade"
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Estado</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="UF"
                                    required
                                    maxLength={2}
                                    style={{ paddingLeft: '1rem', textTransform: 'uppercase' }}
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Nome do Cônjuge (Opcional)</label>
                        <div className="input-wrapper">
                            <Heart className="input-icon" size={18} />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Nome do seu amor"
                                value={formData.spouse_name}
                                onChange={(e) => setFormData({ ...formData, spouse_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="row-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Namoro desde (Opcional)</label>
                            <div className="input-wrapper">
                                <Calendar className="input-icon" size={18} />
                                <input
                                    type="date"
                                    className="auth-input"
                                    value={formData.dating_since}
                                    onChange={(e) => setFormData({ ...formData, dating_since: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Casados desde (Opcional)</label>
                            <div className="input-wrapper">
                                <Calendar className="input-icon" size={18} />
                                <input
                                    type="date"
                                    className="auth-input"
                                    value={formData.married_since}
                                    onChange={(e) => setFormData({ ...formData, married_since: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Salvando...' : 'Começar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
