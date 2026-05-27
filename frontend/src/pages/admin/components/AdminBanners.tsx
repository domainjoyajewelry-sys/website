import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdBanners, createAdBanner, updateAdBanner, deleteAdBanner } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminBanners: React.FC = () => {
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    title_he: '', 
    image: '', 
    video: '', 
    videoActive: true,
    backgroundType: 'image', 
    link: '', 
    isActive: true 
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['adbanners'],
    queryFn: getAdBanners,
  });

  const createMutation = useMutation({
    mutationFn: createAdBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adbanners'] });
      setIsAdding(false);
      resetForm();
      toast.success(language === 'he' ? 'עיצוב נוצר בהצלחה' : 'Hero design created');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateAdBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adbanners'] });
      setEditingBanner(null);
      toast.success(language === 'he' ? 'עיצוב עודכן בהצלחה' : 'Hero design updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adbanners'] });
      toast.success(language === 'he' ? 'עיצוב נמחק בהצלחה' : 'Hero design deleted');
    }
  });

  const resetForm = () => {
    setFormData({ 
      title: '', 
      title_he: '', 
      image: '', 
      video: '', 
      videoActive: true,
      backgroundType: 'image', 
      link: '', 
      isActive: true 
    });
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({ 
      title: banner.title, 
      title_he: banner.title_he || banner.title,
      image: banner.image, 
      video: banner.video || '', 
      videoActive: banner.videoActive !== undefined ? banner.videoActive : true,
      backgroundType: banner.backgroundType || 'image',
      link: banner.link, 
      isActive: banner.isActive 
    });
  };

  const handleSave = () => {
    if (editingBanner) {
      updateMutation.mutate({ ...editingBanner, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif uppercase tracking-widest text-black font-medium">
            {t('admin.manageBanners')}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400 mt-4 font-bold max-w-2xl">
            {t('admin.bannerDescription')}
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="bg-[#f5f5dc] text-black border border-zinc-200 rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#e8e8c8] transition-all flex gap-4"
        >
          <Plus className="w-4 h-4" />
          {t('admin.addNewBanner')}
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingBanner) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}

            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-50 p-10 border border-zinc-100 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">{t('admin.bannerTitle')} (EN)</label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-none border-zinc-300 h-12 focus-visible:ring-black" 
                  placeholder="e.g. Winter Collection"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">{t('admin.bannerTitle')} (HE)</label>
                <Input 
                  value={formData.title_he} 
                  onChange={(e) => setFormData({...formData, title_he: e.target.value})}
                  className="rounded-none border-zinc-300 h-12 text-right focus-visible:ring-black" 
                  placeholder="לדוגמה: קולקציית חורף"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">Background Type</label>
                <select 
                  value={formData.backgroundType} 
                  onChange={(e) => setFormData({...formData, backgroundType: e.target.value})}
                  className="w-full bg-white border border-zinc-300 rounded-none h-12 px-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-black font-bold uppercase tracking-widest"
                >
                  <option value="image">Static Image</option>
                  <option value="video">Background Video</option>
                  <option value="solid">Solid Black Color</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">Main Image / Video Poster</label>
                <Input 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="rounded-none border-zinc-300 h-12 focus-visible:ring-black" 
                  placeholder="/images/hero.jpg"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">Video URL (MP4)</label>
                <div className="flex gap-4 items-center">
                  <Input 
                    value={formData.video} 
                    onChange={(e) => setFormData({...formData, video: e.target.value})}
                    className="rounded-none border-zinc-300 h-12 focus-visible:ring-black flex-grow" 
                    placeholder="/videos/hero-bg.mp4"
                    disabled={formData.backgroundType !== 'video'}
                  />
                  {formData.backgroundType === 'video' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200">
                       <input 
                         type="checkbox" 
                         checked={formData.videoActive} 
                         onChange={(e) => setFormData({...formData, videoActive: e.target.checked})}
                         className="w-4 h-4 accent-black"
                       />
                       <span className="text-[9px] font-bold uppercase tracking-widest">Active</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold font-serif text-black">Target Link</label>
                <Input 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="rounded-none border-zinc-300 h-12 focus-visible:ring-black" 
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="flex justify-end gap-6 pt-6 border-t border-zinc-200">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingBanner(null); }} className="uppercase text-[10px] tracking-widest font-bold">{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-black text-white rounded-none px-12 py-6 text-[10px] uppercase tracking-widest font-bold">
                <Save className="w-4 h-4 mr-3" /> {t('admin.saveChanges')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 w-40">{t('admin.preview')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.name')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Type</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center w-32">{t('admin.status')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 w-40">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300">{t('admin.syncVisuals')}</TableCell></TableRow>
            ) : banners.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300 uppercase tracking-widest">{t('admin.noBanners')}</TableCell></TableRow>
            ) : banners.map((banner: any) => (
              <TableRow key={banner._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="w-24 h-12 bg-zinc-100 border border-zinc-100 overflow-hidden relative flex items-center justify-center">
                    {banner.backgroundType === 'video' ? (
                       <Video className="w-5 h-5 text-zinc-400" />
                    ) : banner.backgroundType === 'solid' ? (
                       <div className="w-full h-full bg-black"></div>
                    ) : (
                       <img src={banner.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-serif text-sm tracking-widest uppercase text-black font-medium">{language === 'he' ? banner.title_he : banner.title}</TableCell>
                <TableCell className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">{banner.backgroundType}</TableCell>
                <TableCell className="text-center">
                  <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${banner.isActive ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    {banner.isActive ? t('admin.active') : t('admin.inactive')}
                  </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => handleEdit(banner)} className="text-zinc-400 hover:text-black transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(banner._id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default AdminBanners;
