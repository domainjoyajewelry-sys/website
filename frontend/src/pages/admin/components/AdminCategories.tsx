import React, { useState, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminCategories: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_he: '',
    description: '',
    description_he: '',
    slug: '',
    image: '',
    parent: ''
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
      image: '',
      parent: ''
    });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_he: category.name_he,
      description: category.description || '',
      description_he: category.description_he || '',
      slug: category.slug,
      image: category.image || '',
      parent: category.parent?._id || category.parent || ''
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
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white">
            {t('admin.categories')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-4">
            {t('admin.manageCategories')}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-black text-white dark:bg-white dark:text-black rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 flex gap-4">
          <Plus className="w-4 h-4" />
          {t('admin.addNewCategory')}
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingCategory) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-50 dark:bg-zinc-900 p-10 border border-zinc-100 dark:border-zinc-800 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.nameEn')}</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.nameHe')}</label>
                  <Input value={formData.name_he} onChange={(e) => setFormData({...formData, name_he: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12 text-right" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.parentCategory')}</label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({...formData, parent: e.target.value})}
                    className="w-full bg-white dark:bg-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-none h-12 px-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  >
                    <option value="">{t('admin.mainCategory')}</option>
                    {categories
                      .filter((c: any) => !editingCategory || c._id !== editingCategory._id)
                      .map((c: any) => (
                        <option key={c._id} value={c._id}>
                          {language === 'he' ? c.name_he : c.name}
                        </option>
                      ))}
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.slug')}</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12" />
               </div>
               <div className="space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.imageUrl')}</label>
                    <label className="text-[9px] uppercase font-bold tracking-widest cursor-pointer text-black dark:text-white hover:underline">
                      {uploading ? (language === 'he' ? 'מעלה...' : 'Uploading...') : (language === 'he' ? '📤 העלה קובץ' : '📤 Upload File')}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={uploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const data = new FormData();
                          data.append('image', file);
                          setUploading(true);
                          try {
                            const res = await axios.post('/api/upload', data);
                            if (res.data?.url) {
                              setFormData({ ...formData, image: res.data.url });
                              toast.success(language === 'he' ? 'תמונה הועלתה בהצלחה!' : 'Image uploaded successfully!');
                            }
                          } catch (err) {
                            toast.error(language === 'he' ? 'שגיאה בהעלאה' : 'Upload failed');
                          } finally {
                            setUploading(false);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12" placeholder="https://..." />
               </div>
               <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.descriptionEn')}</label>
                  <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12" />
               </div>
               <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-400">{t('admin.descriptionHe')}</label>
                  <Input value={formData.description_he} onChange={(e) => setFormData({...formData, description_he: e.target.value})} className="rounded-none border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white h-12 text-right" />
               </div>
            </div>
            <div className="flex justify-end gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingCategory(null); }} className="uppercase text-[10px] tracking-widest font-bold dark:text-zinc-400 dark:hover:text-white">{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-black text-white dark:bg-white dark:text-black rounded-none px-12 py-6 text-[10px] uppercase tracking-widest font-bold flex gap-3">
                <Save className="w-4 h-4" /> {t('admin.saveCategory')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 dark:text-zinc-400">{t('admin.image')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.name')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.parentCategory')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.slug')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 dark:text-zinc-400">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300 dark:text-zinc-600">{t('admin.synchronizing')}</TableCell></TableRow>
            ) : categories.map((category: any) => (
              <TableRow key={category._id} className="border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-100 dark:border-zinc-800"><img src={category.image} className="w-full h-full object-cover" /></div>
                </TableCell>
                <TableCell>
                   <div className="font-serif text-sm tracking-widest uppercase dark:text-zinc-200">{language === 'he' ? category.name_he : category.name}</div>
                </TableCell>
                <TableCell>
                   {category.parent ? (
                     <span className="inline-block bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[10px] uppercase font-bold tracking-widest dark:text-zinc-300">
                       ↳ {language === 'he' ? (category.parent.name_he || category.parent.name) : (category.parent.name || category.parent.name_he)}
                     </span>
                   ) : (
                     <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{language === 'he' ? 'ראשית' : 'Main'}</span>
                   )}
                </TableCell>
                <TableCell className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">{category.slug}</TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(category)} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
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
