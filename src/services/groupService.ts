export interface Member {
    id: string;
    name: string;
    role: 'admin' | 'member';
}

export interface Group {
    id: string;
    name: string;
    code: string;
    created_at: string;
    members: Member[];
}

const STORAGE_KEY = 'alianca_groups';

export const groupService = {
    getGroups: (): Group[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    saveGroups: (groups: Group[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    },

    generateUniqueCode: (): string => {
        let code = '';
        const groups = groupService.getGroups();
        do {
            code = Math.floor(100000 + Math.random() * 900000).toString();
        } while (groups.some(g => g.code === code));
        return code;
    },

    // Updated to create Admin member
    createGroup: (name: string): Group => {
        const groups = groupService.getGroups();
        const newCode = groupService.generateUniqueCode();

        const newGroup: Group = {
            id: crypto.randomUUID(),
            name: name,
            code: newCode,
            created_at: new Date().toISOString(),
            members: [{ id: 'user_me', name: 'Você', role: 'admin' }],
        };

        groups.push(newGroup);
        groupService.saveGroups(groups);
        return newGroup;
    },

    getUserGroup: (): Group | null => {
        const groups = groupService.getGroups();
        // Check if any member has id 'user_me'
        return groups.find(g => g.members.some(m => m.id === 'user_me')) || null;
    },

    getGroupByCode: (code: string): Group | null => {
        const groups = groupService.getGroups();
        return groups.find(g => g.code === code) || null;
    },

    joinGroup: (code: string): { success: boolean, message: string, group?: Group } => {
        const groups = groupService.getGroups();
        const group = groups.find(g => g.code === code);

        if (!group) {
            return { success: false, message: 'Código inválido ou grupo não encontrado.' };
        }

        if (group.members.some(m => m.id === 'user_me')) {
            return { success: true, message: 'Você já faz parte deste grupo.', group };
        }

        if (group.members.length >= 4) {
            return { success: false, message: 'Este grupo já atingiu o limite de membros.' };
        }

        // Add as regular member
        group.members.push({ id: 'user_me', name: 'Você', role: 'member' });

        const updatedGroups = groups.map(g => g.id === group.id ? group : g);
        groupService.saveGroups(updatedGroups);

        return { success: true, message: 'Entrou no grupo com sucesso!', group };
    },

    leaveGroup: (): void => {
        const groups = groupService.getGroups();
        const updatedGroups = groups.map(g => {
            const isMember = g.members.some(m => m.id === 'user_me');
            if (isMember) {
                return { ...g, members: g.members.filter(m => m.id !== 'user_me') };
            }
            return g;
        });
        groupService.saveGroups(updatedGroups);
    },

    // NEW METHODS FOR MANAGEMENT
    updateGroupName: (groupId: string, newName: string): void => {
        const groups = groupService.getGroups();
        const updatedGroups = groups.map(g => g.id === groupId ? { ...g, name: newName } : g);
        groupService.saveGroups(updatedGroups);
    },

    updateMemberRole: (groupId: string, memberId: string, newRole: 'admin' | 'member'): void => {
        const groups = groupService.getGroups();
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    members: g.members.map(m => m.id === memberId ? { ...m, role: newRole } : m)
                };
            }
            return g;
        });
        groupService.saveGroups(updatedGroups);
    },

    removeMember: (groupId: string, memberId: string): void => {
        const groups = groupService.getGroups();
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    members: g.members.filter(m => m.id !== memberId)
                };
            }
            return g;
        });
        groupService.saveGroups(updatedGroups);
    }
};
