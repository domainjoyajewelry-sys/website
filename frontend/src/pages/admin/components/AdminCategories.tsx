import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminCategories: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_he: '',
    description: '',
    description_he: '',
    slug: '',
    image: ''
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAdding(false);
      resetForm();
      toast.success(language === 'he' ? 'קטגוריה נוצרה בהצלחה' : 'Category created');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      toast.success(language === 'he' ? 'קטגוריה עודכנה בהצלחה' : 'Category updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(language === 'he' ? 'קטגוריה נמחקה בהצלחה' : 'Category deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_he: '',
      description: '',
      description_he: '',
      slug: '',
      image: ''
    });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_he: category.name_he,
      description: category.description,
      description_he: category.description_he,
      slug: category.slug,
      image: category.image
    });
  };

  const handleSave = () => {
    if (editingCategory) {
      updateMutation.mutate({ ...editingCategory, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black">
            {t('admin.categories')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            Manage product collections
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-black text-white rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 flex gap-4">
          <Plus className="w-4 h-4" />
          {language === 'he' ? 'הוסף קטגוריה חדשה' : 'Add New Category'}
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingCategory) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-50 p-10 border border-zinc-100 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.nameEn')}</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.nameHe')}</label>
                  <Input value={formData.name_he} onChange={(e) => setFormData({...formData, name_he: e.target.value})} className="rounded-none border-zinc-200 h-12 text-right" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Slug</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.imageUrl')}</label>
                  <Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Description (EN)</label>
                  <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Description (HE)</label>
                  <Input value={formData.description_he} onChange={(e) => setFormData({...formData, description_he: e.target.value})} className="rounded-none border-zinc-200 h-12 text-right" />
               </div>
            </div>
            <div className="flex justify-end gap-6 pt-6 border-t border-zinc-200">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingCategory(null); }} className="uppercase text-[10px] tracking-widest font-bold">{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-black text-white rounded-none px-12 py-6 text-[10px] uppercase tracking-widest font-bold">
                <Save className="w-4 h-4 mr-3" /> {language === 'he' ? 'שמור קטגוריה' : 'Save Category'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">{t('admin.image')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.name')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Slug</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-serif italic text-xl text-zinc-300">{t('admin.synchronizing')}</TableCell></TableRow>
            ) : categories.map((category: any) => (
              <TableRow key={category._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="w-16 h-16 bg-zinc-100 overflow-hidden border border-zinc-100"><img src={category.image} className="w-full h-full object-cover" /></div>
                </TableCell>
                <TableCell>
                   <div className="font-serif text-sm tracking-widest uppercase">{language === 'he' ? category.name_he : category.name}</div>
                </TableCell>
                <TableCell className="text-[10px] font-mono text-zinc-400">{category.slug}</TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(category)} className="text-zinc-400 hover:text-black transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(category._id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default AdminCategories;
