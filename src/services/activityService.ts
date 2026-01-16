import { supabase } from '../lib/supabase';
import { groupService } from './groupService';

export interface ActivityItem {
    id: string;
    category: string;
    name: string;
    completed: boolean;
    meta?: string;
    created_at?: string;
}

export const activityService = {
    async getRecentActivity(limit: number = 5): Promise<ActivityItem[]> {
        const group = await groupService.getUserGroup();
        if (!group) return [];

        const { data, error } = await supabase
            .from('activity_items')
            .select('*')
            .eq('group_id', group.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getItems(category: string): Promise<ActivityItem[]> {
        const group = await groupService.getUserGroup();
        if (!group) return [];

        const { data, error } = await supabase
            .from('activity_items')
            .select('*')
            .eq('group_id', group.id)
            .eq('category', category)
            .order('created_at');

        if (error) throw error;
        return data || [];
    },

    async addItem(category: string, name: string, meta?: string): Promise<void> {
        const group = await groupService.getUserGroup();
        if (!group) throw new Error('No group found');

        const { error } = await supabase
            .from('activity_items')
            .insert({
                group_id: group.id,
                category,
                name,
                meta,
                completed: false
            });

        if (error) throw error;
    },

    async toggleItem(id: string, currentStatus: boolean): Promise<void> {
        const { error } = await supabase
            .from('activity_items')
            .update({ completed: !currentStatus })
            .eq('id', id);

        if (error) throw error;
    },

    async updateItem(id: string, updates: Partial<ActivityItem>): Promise<void> {
        const { error } = await supabase
            .from('activity_items')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    async deleteItem(id: string): Promise<void> {
        const { error } = await supabase
            .from('activity_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
