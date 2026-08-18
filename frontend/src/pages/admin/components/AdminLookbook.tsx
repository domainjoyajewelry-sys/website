import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLookbook, saveLookbook, getProducts, uploadImage } from '../../../services/api';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Sparkles, Plus, Trash2, Save, Upload, Eye, Check, X, MousePointerClick } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { toast } from 'sonner';

const AdminLookbook: React.FC = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: lookbooks = [] } = useQuery({
    queryKey: ['admin-lookbooks'],
    queryFn: getLookbook,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products-select'],
    queryFn: getProducts,
  });

  const currentLookbook = lookbooks[0] || {
    title: 'Earring & Ear Piercing Style Guide',
    title_he: 'מדריך סטיילינג עגילים ופירסינג',
    subtitle: 'Click on markers to shop the look',
    subtitle_he: 'לחצו על הנקודות לצפייה בתכשיטים',
    image: '/images/lookbook_model.jpg',
    hotspots: []
  };

  const [formData, setFormData] = useState({
    _id: currentLookbook._id || '',
    title: currentLookbook.title || 'Earring Style Guide',
    title_he: currentLookbook.title_he || 'מדריך סטיילינג עגילים',
    subtitle: currentLookbook.subtitle || 'Click markers to shop',
    subtitle_he: currentLookbook.subtitle_he || 'לחצו לצפייה',
    image: currentLookbook.image || '/images/lookbook_model.jpg',
    hotspots: currentLookbook.hotspots || []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(null);
  const [pendingSpot, setPendingSpot] = useState<{ x: number; y: number } | null>(null);

  const [spotForm, setSpotForm] = useState({
    productId: '',
    label: '',
    label_he: '',
    price: 0,
    image: ''
  });

  const saveMutation = useMutation({
    mutationFn: saveLookbook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lookbooks'] });
      queryClient.invalidateQueries({ queryKey: ['lookbooks'] });
      toast.success(language === 'he' ? 'הגדרות המדריך והנקודות נשמרו בהצלחה!' : 'Lookbook saved successfully!');
    },
    onError: () => {
      toast.error(language === 'he' ? 'שגיאה בשמירת הגדרות' : 'Failed to save lookbook');
    }
  });

  // Click on image to place new hotspot
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPendingSpot({ x, y });
    setSpotForm({
      productId: '',
      label: '',
      label_he: '',
      price: 0,
      image: ''
    });
  };

  // Add hotspot to list
  const handleAddHotspot = () => {
    if (!pendingSpot) return;

    const selectedProduct = products.find((p: any) => p._id === spotForm.productId);

    const newHotspot = {
      x: pendingSpot.x,
      y: pendingSpot.y,
      product: selectedProduct?._id || undefined,
      label: spotForm.label || selectedProduct?.name || 'Earring Hotspot',
      label_he: spotForm.label_he || selectedProduct?.name_he || 'עגיל מעוצב',
      price: spotForm.price || selectedProduct?.price || 0,
      image: spotForm.image || selectedProduct?.images?.[0] || '/images/new/p1.jpeg'
    };

    setFormData(prev => ({
      ...prev,
      hotspots: [...prev.hotspots, newHotspot]
    }));

    setPendingSpot(null);
    toast.success(language === 'he' ? 'נקודת תכשיט נוספה! לחץ שמור לעדכון מסד הנתונים' : 'Hotspot added!');
  };

  const handleDeleteSpot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hotspots: prev.hotspots.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await uploadImage(data);
      if (res?.url) {
        setFormData(prev => ({ ...prev, image: res.url }));
        toast.success(language === 'he' ? 'תמונת דוגמנית הועלתה בהצלחה!' : 'Model image uploaded!');
      }
    } catch (err) {
      toast.error(language === 'he' ? 'שגיאה בהעלאה' : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white">
            {language === 'he' ? 'ניהול מדריך סטיילינג עגילים (Lookbook)' : 'Shoppable Earring Lookbook'}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-2">
            {language === 'he' ? 'לחץ על תמונת הדוגמנית להוספת נקודות תכשיטים מנצנצות' : 'Click directly on model photo to place product hotspot markers'}
          </p>
        </div>

        <Button 
          onClick={() => saveMutation.mutate(formData)} 
          disabled={saveMutation.isPending}
          className="bg-black text-white dark:bg-white dark:text-black rounded-none px-8 py-6 text-xs uppercase tracking-widest font-bold flex gap-3"
        >
          <Save className="w-4 h-4" />
          <span>{saveMutation.isPending ? 'שומר...' : (language === 'he' ? 'שמור שינויים' : 'Save Lookbook')}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Interactive Image Click Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold font-serif uppercase text-zinc-400">
            <span className="flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-amber-500" /> {language === 'he' ? 'לחץ על התמונה להוספת נקודת תכשיט' : 'Click image to place hotspot marker'}</span>
            <span>{formData.hotspots.length} {language === 'he' ? 'נקודות פעילות' : 'hotspots'}</span>
          </div>

          <div 
            onClick={handleImageClick}
            className="relative border border-zinc-200 dark:border-zinc-800 bg-black cursor-crosshair overflow-hidden group shadow-2xl"
          >
            <img 
              src={formData.image || '/images/lookbook_model.jpg'} 
              alt="Model Profile" 
              className="w-full h-auto object-cover select-none"
            />

            {/* Existing Markers */}
            {formData.hotspots.map((spot: any, index: number) => (
              <div 
                key={index} 
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }} 
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot"
              >
                <div className="w-7 h-7 bg-amber-400 text-black rounded-full flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white">
                  {index + 1}
                </div>
                <div className="absolute start-1/2 -translate-x-1/2 top-8 hidden group-hover/spot:block bg-black text-white text-[10px] py-1 px-3 whitespace-nowrap z-30 font-serif border border-zinc-800 shadow-xl">
                  {spot.label} (₪{spot.price})
                </div>
              </div>
            ))}

            {/* Instruction Banner overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm p-3 text-center text-white text-[11px] font-serif tracking-widest pointer-events-none">
              {language === 'he' ? 'לחץ במיקום העגיל על אוזן הדוגמנית' : 'Click on the model ear to mark earring spot'}
            </div>
          </div>

          {/* Change Model Photo Input */}
          <div className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800">
            <Input 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Model image URL..." 
              className="flex-1 text-xs rounded-none bg-white dark:bg-zinc-950"
            />
            <label className="cursor-pointer bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'מעלה...' : 'העלה תמונה'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Right Side: Texts & Hotspots List */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="font-serif uppercase text-sm font-bold text-zinc-400 tracking-widest">
              {language === 'he' ? 'כותרות הסקשן' : 'Section Titles'}
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{language === 'he' ? 'כותרת ראשית (עברית)' : 'Title (Hebrew)'}</label>
              <Input 
                value={formData.title_he} 
                onChange={(e) => setFormData({...formData, title_he: e.target.value})}
                className="bg-white dark:bg-zinc-950 rounded-none text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{language === 'he' ? 'כותרת משנה (עברית)' : 'Subtitle (Hebrew)'}</label>
              <Input 
                value={formData.subtitle_he} 
                onChange={(e) => setFormData({...formData, subtitle_he: e.target.value})}
                className="bg-white dark:bg-zinc-950 rounded-none text-right"
              />
            </div>
          </div>

          {/* Hotspots List Table */}
          <div className="space-y-4">
            <h3 className="font-serif uppercase text-sm font-bold text-zinc-400 tracking-widest">
              {language === 'he' ? 'רשימת הנקודות המסומנות' : 'Marked Hotspots List'}
            </h3>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                  <TableRow className="text-[10px] uppercase font-bold text-zinc-400">
                    <TableHead>#</TableHead>
                    <TableHead>{language === 'he' ? 'תכשיט' : 'Jewelry'}</TableHead>
                    <TableHead className="text-right">{language === 'he' ? 'מחיר' : 'Price'}</TableHead>
                    <TableHead className="text-center">{language === 'he' ? 'מיקום' : 'Pos'}</TableHead>
                    <TableHead className="text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.hotspots.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 font-serif italic text-zinc-400 text-xs">טרם סומנו נקודות. לחץ על תמונת הדוגמנית להוספה</TableCell></TableRow>
                  ) : (
                    formData.hotspots.map((spot: any, idx: number) => (
                      <TableRow key={idx} className="border-zinc-50 dark:border-zinc-800">
                        <TableCell className="font-bold text-amber-500 font-mono text-xs">{idx + 1}</TableCell>
                        <TableCell className="font-serif text-xs font-bold">{spot.label_he || spot.label}</TableCell>
                        <TableCell className="text-right font-mono text-xs">₪{spot.price}</TableCell>
                        <TableCell className="text-center font-mono text-[10px] text-zinc-400">X:{spot.x}% Y:{spot.y}%</TableCell>
                        <TableCell className="text-center">
                          <Button onClick={() => handleDeleteSpot(idx)} size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      </div>

      {/* Add Hotspot Modal */}
      {pendingSpot && (
        <Dialog open={!!pendingSpot} onOpenChange={() => setPendingSpot(null)}>
          <DialogContent className="max-w-md bg-white dark:bg-zinc-950 text-black dark:text-white rounded-none border-zinc-200 dark:border-zinc-800 p-8">
            <DialogHeader>
              <DialogTitle className="font-serif uppercase tracking-widest text-lg">
                {language === 'he' ? 'הוספת נקודת תכשיט חדשה' : 'Add New Hotspot Marker'}
              </DialogTitle>
              <p className="text-[10px] text-zinc-400 font-mono">
                Position: X: {pendingSpot.x}% | Y: {pendingSpot.y}%
              </p>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-400">{language === 'he' ? 'בחר תכשיט מהקטלוג' : 'Select Product from Catalog'}</label>
                <select 
                  value={spotForm.productId}
                  onChange={(e) => {
                    const prod = products.find((p: any) => p._id === e.target.value);
                    if (prod) {
                      setSpotForm({
                        productId: prod._id,
                        label: prod.name,
                        label_he: prod.name_he,
                        price: prod.price,
                        image: prod.images?.[0] || ''
                      });
                    }
                  }}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-12 px-4 text-xs font-serif text-black dark:text-white rounded-none"
                >
                  <option value="">-- {language === 'he' ? 'בחר מוצר' : 'Select Product'} --</option>
                  {products.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.name_he || p.name} (₪{p.price})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-400">{language === 'he' ? 'שם עגיל (עברית)' : 'Earring Title (Hebrew)'}</label>
                <Input 
                  value={spotForm.label_he} 
                  onChange={(e) => setSpotForm({...spotForm, label_he: e.target.value})}
                  className="rounded-none text-right" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-400">{language === 'he' ? 'מחיר (₪)' : 'Price (₪)'}</label>
                <Input 
                  type="number"
                  value={spotForm.price} 
                  onChange={(e) => setSpotForm({...spotForm, price: Number(e.target.value)})}
                  className="rounded-none font-mono" 
                />
              </div>

              <Button onClick={handleAddHotspot} className="w-full bg-black text-white dark:bg-white dark:text-black rounded-none py-6 font-serif uppercase tracking-widest text-xs font-bold">
                {language === 'he' ? 'אישור והוספת הנקודה' : 'Confirm & Add Hotspot'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminLookbook;
