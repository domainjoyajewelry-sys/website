import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProducts: React.FC = () => {
  const { t, getLocalizedField, language } = useLanguage();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif uppercase tracking-widest text-black">
            {language === 'he' ? 'ניהול מוצרים' : 'Product Management'}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            {products.length} {language === 'he' ? 'מוצרים במלאי' : 'Items in catalog'}
          </p>
        </div>
        <Button className="bg-black text-white rounded-none px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all flex gap-4">
          <Plus className="w-4 h-4" />
          {language === 'he' ? 'הוסף מוצר חדש' : 'Add New Product'}
        </Button>
      </div>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">Image</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">Category</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Price</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">Stock</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 animate-pulse font-serif italic text-xl text-zinc-300">
                  Refining catalog data...
                </TableCell>
              </TableRow>
            ) : products.map((product: any) => (
              <TableRow key={product._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="w-16 h-16 bg-zinc-100 border border-zinc-100 overflow-hidden">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-serif text-sm tracking-widest uppercase">
                  {getLocalizedField(product, 'name')}
                  {product.isNewArrival && (
                    <span className="ml-4 bg-black text-white text-[8px] px-2 py-1 tracking-tighter">NEW</span>
                  )}
                </TableCell>
                <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {getLocalizedField(product.category, 'name')}
                </TableCell>
                <TableCell className="text-center font-body text-lg italic">
                  ₪{product.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                   <span className={`text-[10px] font-bold px-3 py-1 border ${product.countInStock > 5 ? 'border-zinc-200 text-zinc-400' : 'border-red-100 text-red-500 bg-red-50'}`}>
                     {product.countInStock}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button className="text-zinc-400 hover:text-black transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-zinc-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
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