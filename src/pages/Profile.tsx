import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, RefreshCw, Bell, Moon, Lock, HelpCircle, Info, ChevronRight, Pen
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { user, profile, signOut, refreshProfile } = useAuth();
    const [syncEnabled, setSyncEnabled] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Crop State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Theme initialization
    useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme !== 'light';
        setIsDarkMode(isDark);
        if (!isDark) {
            document.body.classList.add('light-theme');
        }
    });

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = async () => {
        if (confirm('Deseja realmente sair da conta?')) {
            try {
                await signOut();
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
    };

    const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result as string));
            reader.readAsDataURL(file);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    };

    const handleSaveCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedImageBlob) throw new Error('Falha ao recortar imagem');

            const fileName = `${user?.id}/${Date.now()}.jpg`;

            // Upload Blob
            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, croppedImageBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Add timestamp/random query param to bypass cache
            const publicUrlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrlWithCacheBust })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            await refreshProfile();
            setImageSrc(null); // Close modal
        } catch (error: any) {
            alert('Erro ao salvar avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const userInitials = profile?.name
        ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || 'U';

    return (
        <div className="profile-container">
            {/* Header */}
            <section className="profile-header-section">
                <div className="avatar-container">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className="profile-avatar"
                        />
                    ) : (
                        <div className="profile-avatar-placeholder">
                            {userInitials}
                        </div>
                    )}

                    <button
                        className="edit-avatar-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Pen size={14} />
                    </button>
                    <input
                        type="file"
                        id="single"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        ref={fileInputRef}
                    />
                </div>
                <h2 className="profile-name">{profile?.name || 'Usuário'}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="premium-badge">Plano Gratuito</div>
            </section>

            {/* Sua Aliança */}
            <section className="settings-section">
                <label className="section-label">Sua Aliança</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('grupo')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Users size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Gerenciar Grupo</span>
                                <span className="setting-desc">Convidar ou remover parceiro</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-sec" />
                    </div>

                    <div className="setting-item" onClick={() => setSyncEnabled(!syncEnabled)}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <RefreshCw size={20} />
                            </div>
                            <div className="setting-info">
                                <span className="setting-title">Sincronização</span>
                                <span className="setting-desc">
                                    {syncEnabled ? 'Ativa • Atualizado agora' : 'Pausada'}
                                </span>
                            </div>
                        </div>
                        <div className={`toggle-switch ${syncEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Preferências */}
            <section className="settings-section">
                <label className="section-label">Preferências</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('notificacoes')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-orange">
                                <Bell size={20} />
                            </div>
                            <span className="setting-title">Notificações</span>
                        </div>
                        <div className="setting-right">
                            <span className="notification-badge">2</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div className="setting-item" onClick={toggleTheme}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-purple">
                                <Moon size={20} />
                            </div>
                            <span className="setting-title">Aparência</span>
                        </div>
                        <div className="setting-right">
                            <span>{isDarkMode ? 'Escuro' : 'Claro'}</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div className="setting-item" onClick={() => navigate('privacidade')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-blue">
                                <Lock size={20} />
                            </div>
                            <span className="setting-title">Privacidade e Dados</span>
                        </div>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </section>

            {/* Suporte */}
            <section className="settings-section">
                <label className="section-label">Suporte</label>
                <div className="settings-card">
                    <div className="setting-item" onClick={() => navigate('suporte')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-green">
                                <HelpCircle size={20} />
                            </div>
                            <span className="setting-title">Ajuda e Suporte</span>
                        </div>
                        <ChevronRight size={20} />
                    </div>

                    <div className="setting-item" onClick={() => navigate('sobre')}>
                        <div className="setting-left">
                            <div className="setting-icon icon-bg-gray">
                                <Info size={20} />
                            </div>
                            <span className="setting-title">Sobre o Aliança</span>
                        </div>
                        <div className="setting-right">
                            <span>v2.4.0</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </section>

            <button className="logout-btn" onClick={handleLogout}>
                Sair da Conta
            </button>

            <p className="version-text">
                Aliança Inc. © 2024. Todos os direitos reservados.
            </p>
            {/* Crop Modal */}
            {imageSrc && (
                <div className="crop-modal-overlay">
                    <div className="crop-container">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape="round"
                            showGrid={false}
                        />
                    </div>
                    <div className="crop-controls">
                        <button className="crop-btn crop-cancel" onClick={() => setImageSrc(null)}>
                            Cancelar
                        </button>
                        <button className="crop-btn crop-save" onClick={handleSaveCrop} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar Foto'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
