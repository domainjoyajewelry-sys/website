import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Save, X, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminProducts: React.FC = () => {
  const { t, getLocalizedField, language } = useLanguage();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '', name_he: '', price: 0, countInStock: 0, 
    category: '', materials: '', materials_he: '', 
    colors: '', colors_he: '', images: [''], description: '', description_he: ''
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAdding(false);
      resetForm();
      toast.success(language === 'he' ? 'מוצר נוצר בהצלחה' : 'Product created');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast.success(language === 'he' ? 'מוצר עודכן בהצלחה' : 'Product updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(language === 'he' ? 'מוצר נמחק בהצלחה' : 'Product deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '', name_he: '', price: 0, countInStock: 0, 
      category: '', materials: '', materials_he: '', 
      colors: '', colors_he: '', images: [''], description: '', description_he: ''
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      category: product.category?._id || product.category
    });
  };

  const handleSave = () => {
    if (editingProduct) {
      updateMutation.mutate({ ...editingProduct, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif uppercase tracking-widest text-black">
            {t('admin.manageProducts')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            {products.length} {t('admin.itemsInCatalog')}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-black text-white rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 flex gap-4">
          <Plus className="w-4 h-4" />
          {t('admin.addNewProduct')}
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-50 p-10 border border-zinc-100 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.nameEn')}</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.nameHe')}</label>
                  <Input value={formData.name_he} onChange={(e) => setFormData({...formData, name_he: e.target.value})} className="rounded-none border-zinc-200 h-12 text-right" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.price')} (₪)</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.stock')}</label>
                  <Input type="number" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: Number(e.target.value)})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.category')}</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-none h-12 px-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">{t('admin.selectCategory')}</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{getLocalizedField(cat, 'name')}</option>
                    ))}
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.imageUrl')}</label>
                  <Input value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.metalEn')}</label>
                  <Input value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} className="rounded-none border-zinc-200 h-12" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{t('admin.metalHe')}</label>
                  <Input value={formData.colors_he} onChange={(e) => setFormData({...formData, colors_he: e.target.value})} className="rounded-none border-zinc-200 h-12 text-right" />
               </div>
            </div>
            <div className="flex justify-end gap-6 pt-6 border-t border-zinc-200">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="uppercase text-[10px] tracking-widest font-bold">{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-black text-white rounded-none px-12 py-6 text-[10px] uppercase tracking-widest font-bold">
                <Save className="w-4 h-4 mr-3" /> {t('admin.savePiece')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">Image</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Price</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Stock</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300">Synchronizing catalog...</TableCell></TableRow>
            ) : products.map((product: any) => (
              <TableRow key={product._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="w-16 h-16 bg-zinc-100 overflow-hidden border border-zinc-100"><img src={product.images[0]} className="w-full h-full object-cover" /></div>
                </TableCell>
                <TableCell>
                   <div className="font-serif text-sm tracking-widest uppercase">{getLocalizedField(product, 'name')}</div>
                   <span className="text-[9px] text-zinc-400 tracking-widest uppercase">{getLocalizedField(product.category, 'name')}</span>
                </TableCell>
                <TableCell className="text-center font-body text-lg italic">₪{product.price.toLocaleString()}</TableCell>
                <TableCell className="text-center"><span className="text-[10px] font-bold px-3 py-1 border border-zinc-100">{product.countInStock}</span></TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(product)} className="text-zinc-400 hover:text-black transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(product._id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default AdminProducts;