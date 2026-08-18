import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Trash2, Users, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AdminCustomers: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(language === 'he' ? 'משתמש נמחק בהצלחה' : 'User deleted');
    }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white">
            {t('admin.customers')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-4">
            {t('admin.manageCustomers')}
          </p>
        </div>
        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
           <Users className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 dark:text-zinc-400">{t('admin.customer')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.email')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.role')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 dark:text-zinc-400">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-serif italic text-xl text-zinc-300 dark:text-zinc-600">{t('admin.synchronizing')}</TableCell></TableRow>
            ) : users.map((user: any) => (
              <TableRow key={user._id} className="border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="py-6 px-8">
                   <div className="font-serif text-sm tracking-widest uppercase text-black dark:text-zinc-200">{user.full_name}</div>
                   <div className="text-[9px] text-zinc-400 dark:text-zinc-500 tracking-widest">{user.phone || t('admin.noPhone')}</div>
                </TableCell>
                <TableCell className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{user.email}</TableCell>
                <TableCell>
                   <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                     {user.role}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  {user.role !== 'admin' && (
                    <button onClick={() => { if(window.confirm(t('admin.confirmDeleteUser'))) deleteMutation.mutate(user._id) }} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
