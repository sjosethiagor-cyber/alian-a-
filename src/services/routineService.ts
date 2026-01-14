import { supabase } from '../lib/supabase';

export interface RoutineItem {
    id: string;
    group_id: string;
    title: string;
    description?: string;
    time?: string;
    icon?: string;
    priority?: 'normal' | 'high';
    frequency?: 'daily' | 'weekly' | 'specific_date';
    week_days?: number[]; // 0-6 (Sun-Sat)
    specific_date?: string; // YYYY-MM-DD
    created_at: string;
}

export interface RoutineCompletion {
    id: string;
    routine_id: string;
    user_id: string;
    completion_date: string; // YYYY-MM-DD
    created_at: string;
}

export const routineService = {
    // Fetch all routine items for a specific group
    async getGroupRoutines(groupId: string): Promise<RoutineItem[]> {
        const { data, error } = await supabase
            .from('routine_items')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Fetch completions for a list of routines on a specific date
    async getCompletions(routineIds: string[], date: string): Promise<RoutineCompletion[]> {
        if (routineIds.length === 0) return [];

        const { data, error } = await supabase
            .from('routine_completions')
            .select('*')
            .in('routine_id', routineIds)
            .eq('completion_date', date);

        if (error) throw error;
        return data || [];
    },

    // Toggle completion status
    async toggleCompletion(routineId: string, userId: string, date: string, isCompleted: boolean): Promise<void> {
        if (isCompleted) {
            // Remove completion
            const { error } = await supabase
                .from('routine_completions')
                .delete()
                .eq('routine_id', routineId)
                .eq('user_id', userId)
                .eq('completion_date', date);

            if (error) throw error;
        } else {
            // Add completion
            const { error } = await supabase
                .from('routine_completions')
                .insert({
                    routine_id: routineId,
                    user_id: userId,
                    completion_date: date
                });

            if (error) throw error;
        }
    },

    // Calculate streak (simplified version for now)
    async getStreak(userId: string): Promise<number> {
        // This is a placeholder. Real streak calculation requires complex SQL or logic
        // For now, let's return a mock or simple count of distinct days in the last 30 days
        const { count, error } = await supabase
            .from('routine_completions')
            .select('completion_date', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) return 0;
        return count || 0;
    },

    // Create a new routine item
    async createRoutine(item: Omit<RoutineItem, 'id' | 'created_at'>): Promise<RoutineItem> {
        const { data, error } = await supabase
            .from('routine_items')
            .insert(item)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
