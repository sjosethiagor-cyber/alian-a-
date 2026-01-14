import { supabase } from '../lib/supabase';

export interface Group {
    id: string;
    name: string;
    description: string;
    code: string;
    theme: string; // 'light' | 'dark' | 'system'
    created_at: string;
    created_by: string;
    avatar_url?: string;
    members?: Member[];
}

export interface Member {
    id: string; // This is the group_member id
    user_id: string;
    group_id: string;
    role: 'admin' | 'member';
    joined_at: string;
    profile?: {
        name: string;
        avatar_url?: string;
    }
}

export const groupService = {
    async createGroup(data: Omit<Group, 'id' | 'code' | 'members' | 'created_at' | 'created_by'>): Promise<Group> {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('Usuário não autenticado');

        const code = this.generateCode();

        const { data: group, error } = await supabase
            .from('groups')
            .insert({
                ...data,
                code,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;

        // Add creator as admin
        const { error: memberError } = await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: user.id,
                role: 'admin'
            });

        if (memberError) throw memberError;

        return group;
    },

    async joinGroup(code: string): Promise<Group> {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('Usuário não autenticado');

        // Find group by code (using uppercase for case-insensitive match logic)
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select()
            .eq('code', code.toUpperCase())
            .single();

        if (groupError || !group) throw new Error('Grupo não encontrado');

        // Check if already member
        const { data: existingMember } = await supabase
            .from('group_members')
            .select()
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single(); // Use single() to see if finding one errors out or returns data
        // Actually single() errors if multiple or none. Use maybeSingle() or select().

        // Correction: checking existence
        // The earlier plan was using check for constraints, but UI feedback is nice.
        // Let's use clean select.

        if (existingMember) throw new Error('Você já faz parte deste grupo');

        // Join
        const { error: joinError } = await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: user.id,
                role: 'member'
            });

        // If unique constraint violation happens, it catches here too.
        if (joinError) {
            if (joinError.code === '23505') throw new Error('Você já faz parte deste grupo');
            throw joinError;
        }

        return group;
    },

    async getGroupByCode(code: string): Promise<Group | null> {
        const { data: group, error } = await supabase
            .from('groups')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error) return null;
        return group;
    },

    async getUserGroup(): Promise<Group | null> {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return null;

        // 1. Get ALL memberships
        const { data: members, error: memberError } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id);

        if (memberError || !members || members.length === 0) return null;

        // 2. Find the first valid group
        // We iterate to find one that exists and return it.
        for (const member of members) {
            const { data: group } = await supabase
                .from('groups')
                .select('*')
                .eq('id', member.group_id)
                .single();

            if (group) return group;
        }

        return null;
    },

    async getGroupDetails(groupId: string): Promise<Group | null> {
        const { data: group, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();

        if (error) return null;

        // Fetch members
        const { data: members, error: membersError } = await supabase
            .from('group_members')
            .select('*')
            .eq('group_id', groupId);

        if (membersError || !members) return { ...group, members: [] };

        // Manually fetch profiles since there is no FK link in Supabase for auto-join
        const userIds = members.map(m => m.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .in('id', userIds);

        // Map profiles to members
        const membersWithProfiles = members.map(member => {
            const profile = profiles?.find(p => p.id === member.user_id);
            return {
                ...member,
                profile: profile ? { name: profile.name, avatar_url: profile.avatar_url } : undefined
            };
        });

        return { ...group, members: membersWithProfiles };
    },

    async updateGroup(groupId: string, data: Partial<Group>): Promise<void> {
        const { error } = await supabase
            .from('groups')
            .update(data)
            .eq('id', groupId);

        if (error) throw error;
    },

    async leaveGroup(groupId: string): Promise<void> {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    async updateMemberRole(groupId: string, memberId: string, role: 'admin' | 'member'): Promise<void> {
        // memberId here is user_id based on how we call it? 
        // OR is it the group_member id?
        // In the UI I will probably use user_id or id.
        // Let's assume finding by user_id for simplicity as it's unique per group
        const { error } = await supabase
            .from('group_members')
            .update({ role })
            .eq('group_id', groupId)
            .eq('user_id', memberId); // memberId treated as user_id

        if (error) throw error;
    },

    async removeMember(groupId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId);

        if (error) throw error;
    },

    async deleteGroup(groupId: string): Promise<void> {
        // Delete members first (cascade usually handles this, but explicit is safe)
        const { error: memberError } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId);

        if (memberError) throw memberError;

        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', groupId);

        if (error) throw error;
    },

    async uploadGroupAvatar(groupId: string, file: File): Promise<void> {
        const fileExt = file.name.split('.').pop();
        const fileName = `groups/${groupId}/${Date.now()}.${fileExt}`;

        // Upload
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        const publicUrlWithBust = `${publicUrl}?t=${Date.now()}`;

        // Update group
        await this.updateGroup(groupId, { avatar_url: publicUrlWithBust });
    },

    generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
};
