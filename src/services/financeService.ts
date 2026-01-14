import { supabase } from '../lib/supabase';
import { groupService } from './groupService';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    date: string;
}

export const financeService = {
    async getTransactions(): Promise<Transaction[]> {
        const group = await groupService.getUserGroup();
        if (!group) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('group_id', group.id)
            .order('date', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data || [];
    },

    async addTransaction(title: string, amount: number, type: 'income' | 'expense', category?: string): Promise<void> {
        const group = await groupService.getUserGroup();
        if (!group) throw new Error('No group found');
        const user = (await supabase.auth.getUser()).data.user;

        const { error } = await supabase
            .from('transactions')
            .insert({
                group_id: group.id,
                title,
                amount,
                type,
                category,
                created_by: user?.id
            });

        if (error) throw error;
    }
};
