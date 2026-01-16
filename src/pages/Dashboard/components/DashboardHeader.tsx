import { type Profile } from '../../../contexts/AuthContext';
import { type Member } from '../../../services/groupService';

interface DashboardHeaderProps {
    loading: boolean;
    profile: Profile | null;
    partner: Member | null;
    selectedDate: Date;
}

export default function DashboardHeader({ loading, profile, partner, selectedDate }: DashboardHeaderProps) {
    const partnerName = partner?.profile?.name || 'Parceiro';

    const dateString = selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <header className="home-header">
            <div>
                <span className="header-date">{dateString}</span>
                <h1 className="header-greeting">
                    {loading ? 'Carregando...' : (
                        <>
                            Bom dia,<br />
                            <span className="text-highlight">
                                {profile?.name ? profile.name.split(' ')[0] : 'Você'} & {partnerName.split(' ')[0]}
                            </span>
                        </>
                    )}
                </h1>
            </div>
            <div className="couple-avatars">
                <div className="avatar avatar-1">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        (profile?.name?.[0] || 'V').toUpperCase()
                    )}
                </div>
                <div className="avatar avatar-2">
                    {partner?.profile?.avatar_url ? (
                        <img src={partner.profile.avatar_url} alt="Partner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        (partnerName?.[0] || '?').toUpperCase()
                    )}
                </div>
            </div>
        </header>
    );
}
