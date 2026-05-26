import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminPrizes, createPrize, updatePrize, deletePrize } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Save, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminPrizes: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [editingPrize, setEditingPrize] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ label: '', label_he: '', value: '', chance: 1, isActive: true });

  const { data: prizes = [], isLoading } = useQuery({
    queryKey: ['prizes-admin'],
    queryFn: getAdminPrizes,
  });

  const createMutation = useMutation({
    mutationFn: createPrize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes-admin'] });
      setIsAdding(false);
      setFormData({ label: '', label_he: '', value: '', chance: 1, isActive: true });
      toast.success('Prize created');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updatePrize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes-admin'] });
      setEditingPrize(null);
      toast.success('Prize updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes-admin'] });
      toast.success('Prize deleted');
    }
  });

  const handleEdit = (prize: any) => {
    setEditingPrize(prize);
    setFormData({ label: prize.label, label_he: prize.label_he, value: prize.value, chance: prize.chance, isActive: prize.isActive });
  };

  const handleSave = () => {
    if (editingPrize) {
      updateMutation.mutate({ ...editingPrize, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif uppercase tracking-widest text-black">
            {language === 'he' ? 'ניהול פרסים' : 'Lucky Wheel Prizes'}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            Manage the rewards for your boutique's lucky wheel
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-black text-white rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 flex gap-4">
          <Plus className="w-4 h-4" />
          {language === 'he' ? 'הוסף פרס חדש' : 'Add New Prize'}
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingPrize) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-50 p-10 border border-zinc-100 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Label (EN)</label>
                  <Input value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Label (HE)</label>
                  <Input value={formData.label_he} onChange={(e) => setFormData({...formData, label_he: e.target.value})} className="rounded-none border-zinc-200 h-12 text-right" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Coupon Value/Code</label>
                  <Input value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Weight/Chance</label>
                  <Input type="number" value={formData.chance} onChange={(e) => setFormData({...formData, chance: Number(e.target.value)})} className="rounded-none border-zinc-200 h-12" />
               </div>
            </div>
            <div className="flex justify-end gap-6 pt-6 border-t border-zinc-200">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingPrize(null); }} className="uppercase text-[10px] tracking-widest font-bold">{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-black text-white rounded-none px-12 py-6 text-[10px] uppercase tracking-widest font-bold">
                <Save className="w-4 h-4 mr-3" /> Save Prize
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">Label</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Value</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Weight</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300">{t('global.loadingPrizes')}</TableCell></TableRow>
            ) : prizes.map((prize: any) => (
              <TableRow key={prize._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-6 px-8 font-serif text-sm tracking-widest uppercase">
                  {language === 'he' ? prize.label_he : prize.label}
                </TableCell>
                <TableCell className="text-[11px] font-mono">{prize.value}</TableCell>
                <TableCell className="text-center font-bold">{prize.chance}</TableCell>
                <TableCell className="text-center">
                   <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${prize.isActive ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                     {prize.isActive ? 'Active' : 'Inactive'}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(prize)} className="text-zinc-400 hover:text-black transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(prize._id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPrizes;
