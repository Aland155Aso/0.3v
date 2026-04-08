import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Product } from '../../types';
import { compressImage, dataURLtoBlob } from '../../lib/imageUtils';
import { ArrowLeft, Save, Upload, X, Package, DollarSign, Tag, FileText, Box, Plus, Star, Percent, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

/**
 * NOTE ON FIREBASE STORAGE:
 * If your image uploads are failing, ensure you have enabled Firebase Storage in your console
 * and set the following Security Rules:
 * 
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /products/{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null && 
 *         (request.auth.token.email == "bawanbusiness1@gmail.com");
 *     }
 *   }
 * }
 */

const ProductForm: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categories: [] as string[],
    image: '',
    images: [] as string[],
    stock: '10',
    rating: 5,
    reviewsCount: 0,
    isBestSeller: false,
    isOnSale: false,
    discountPrice: '',
    suggestedUsage: '',
    caution: '',
    supplementFacts: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [secondaryImageFiles, setSecondaryImageFiles] = useState<File[]>([]);
  const [secondaryImagePreviews, setSecondaryImagePreviews] = useState<string[]>([]);
  const [secondaryImageUrlInput, setSecondaryImageUrlInput] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'products', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name,
              description: data.description,
              price: data.price.toString(),
              categories: data.categories || (data.category ? [data.category] : []),
              image: data.image,
              images: data.images || [],
              stock: data.stock.toString(),
              rating: data.rating || 5,
              reviewsCount: data.reviewsCount || 0,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              discountPrice: data.discountPrice?.toString() || '',
              suggestedUsage: data.suggestedUsage || '',
              caution: data.caution || '',
              supplementFacts: data.supplementFacts || ''
            });
            setImagePreview(data.image);
            setSecondaryImagePreviews(data.images || []);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          toast.error('Failed to load product data');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlBlur = () => {
    if (imageUrlInput.trim()) {
      setImagePreview(imageUrlInput.trim());
      setImageFile(null);
      setFormData(prev => ({ ...prev, image: imageUrlInput.trim() }));
    }
  };

  const handleSecondaryImageUrlAdd = () => {
    if (secondaryImageUrlInput.trim()) {
      const url = secondaryImageUrlInput.trim();
      setSecondaryImagePreviews(prev => [...prev, url]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
      setSecondaryImageUrlInput('');
    }
  };

  const handleSecondaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSecondaryImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSecondaryImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSecondaryImage = (index: number) => {
    // If it's a new file being uploaded
    const preview = secondaryImagePreviews[index];
    const isNewFile = preview.startsWith('data:');
    
    if (isNewFile) {
      // Find the file index in secondaryImageFiles
      // This is a bit tricky since we don't have a direct mapping, 
      // but we can assume order is preserved for new files
      const newFilePreviews = secondaryImagePreviews.filter(p => p.startsWith('data:'));
      const fileIndex = newFilePreviews.indexOf(preview);
      if (fileIndex !== -1) {
        setSecondaryImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
    } else {
      // It's an existing URL
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== preview)
      }));
    }
    
    setSecondaryImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Capture URL inputs if they haven't been blurred/added
    let finalMainImage = formData.image;
    if (imageUrlInput.trim()) {
      finalMainImage = imageUrlInput.trim();
    }

    const finalSecondaryImages = [...formData.images];
    if (secondaryImageUrlInput.trim()) {
      finalSecondaryImages.push(secondaryImageUrlInput.trim());
    }

    setLoading(true);

    try {
      console.log('Starting product save process...');
      let imageUrl = finalMainImage;
      const secondaryImageUrls = finalSecondaryImages;

      // Helper to upload or fallback to base64
      const processImage = async (file: File, type: 'main' | 'secondary') => {
        try {
          console.log(`Processing ${type} image:`, file.name);
          
          // 1. Compress image first
          const compressedBase64 = await compressImage(file, 1024, 1024, 0.8);
          const blob = dataURLtoBlob(compressedBase64);
          
          // 2. Try uploading to Firebase Storage
          try {
            const storageRef = ref(storage, `products/${Date.now()}_${type}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
            
            // Add a timeout to the upload
            const uploadPromise = uploadBytes(storageRef, blob);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timeout')), 15000)
            );
            
            const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as any;
            const downloadUrl = await getDownloadURL(uploadResult.ref);
            console.log(`${type} image uploaded successfully:`, downloadUrl);
            return downloadUrl;
          } catch (storageError) {
            console.warn(`Storage upload failed for ${type} image, falling back to Base64:`, storageError);
            // Fallback to compressed base64 if storage fails or times out
            // Note: Firestore has a 1MB limit per document, so we use base64 only as a last resort
            return compressedBase64;
          }
        } catch (err) {
          console.error(`Error processing ${type} image:`, err);
          throw err;
        }
      };

      // Upload main image if changed
      if (imageFile) {
        toast.loading('Uploading main image...', { id: 'upload-main' });
        imageUrl = await processImage(imageFile, 'main');
        toast.success('Main image processed', { id: 'upload-main' });
      }

      // Upload new secondary images
      if (secondaryImageFiles.length > 0) {
        toast.loading(`Uploading ${secondaryImageFiles.length} secondary images...`, { id: 'upload-sec' });
        for (const file of secondaryImageFiles) {
          const url = await processImage(file, 'secondary');
          secondaryImageUrls.push(url);
        }
        toast.success('Secondary images processed', { id: 'upload-sec' });
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        categories: formData.categories,
        image: imageUrl,
        images: secondaryImageUrls,
        stock: parseInt(formData.stock) || 0,
        rating: formData.rating,
        reviewsCount: formData.reviewsCount,
        isBestSeller: formData.isBestSeller,
        isOnSale: formData.isOnSale,
        discountPrice: (formData.isOnSale && formData.discountPrice) ? parseFloat(formData.discountPrice) : null,
        suggestedUsage: formData.suggestedUsage,
        caution: formData.caution,
        supplementFacts: formData.supplementFacts
      };

      console.log('Saving product data to Firestore:', productData);
      if (id) {
        try {
          await setDoc(doc(db, 'products', id), productData);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
        }
        toast.success('Product updated successfully');
      } else {
        try {
          await addDoc(collection(db, 'products'), productData);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'products');
        }
        toast.success('Product created successfully');
      }

      console.log('Product saved successfully, navigating back...');
      navigate('/admin');
    } catch (error: any) {
      console.error('Submit error:', error);
      // If it's a FirestoreErrorInfo (from handleFirestoreError), it will be a JSON string
      let errorMessage = 'Failed to save product';
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error) errorMessage = errorData.error;
      } catch {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Skin Care', 'Vitamins', 'Pre-workout', 'Herbs', 'Creatine', 'Accessories'];

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-xl font-black dark:text-white">
            {id ? 'Edit Product' : 'New Product'}
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image Upload */}
            <div className="md:col-span-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      Main Image
                    </label>
                  </div>
                  <div className="aspect-square bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden relative group">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setImageUrlInput('');
                            setFormData({ ...formData, image: '' });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-xs font-bold text-gray-400 uppercase">Upload Image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      onBlur={handleImageUrlBlur}
                      placeholder="Or paste image URL..."
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Secondary Images
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {secondaryImagePreviews.map((preview, index) => (
                      <div key={index} className="aspect-square bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative group">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => removeSecondaryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square flex flex-col items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Plus size={24} className="text-gray-400" />
                      <input type="file" accept="image/*" multiple onChange={handleSecondaryImagesChange} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={secondaryImageUrlInput}
                      onChange={e => setSecondaryImageUrlInput(e.target.value)}
                      placeholder="Paste secondary image URL..."
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleSecondaryImageUrlAdd}
                      className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              
              <p className="text-[10px] text-gray-400 text-center uppercase font-bold">Recommended: 800x800px</p>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} /> Product Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                    placeholder="e.g. Whey Protein Isolate"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={14} /> Price (IQD)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Box size={14} /> Stock
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Categories (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, categories: [...formData.categories, cat] });
                            } else {
                              setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat) });
                            }
                          }}
                          className="w-4 h-4 rounded border-none bg-gray-200 dark:bg-gray-700 text-primary focus:ring-primary transition-all cursor-pointer"
                        />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Description (Markdown supported)
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                    placeholder="Describe the product benefits, ingredients, etc."
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">Additional Information (Optional)</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {t('suggested_usage')}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.suggestedUsage}
                      onChange={e => setFormData({ ...formData, suggestedUsage: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                      placeholder="How to use this product..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {t('caution')}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.caution}
                      onChange={e => setFormData({ ...formData, caution: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                      placeholder="Warnings, contraindications, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {t('supplement_facts')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.supplementFacts}
                      onChange={e => setFormData({ ...formData, supplementFacts: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                      placeholder="Ingredients and nutritional information..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", formData.isBestSeller ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-200 dark:bg-gray-700 text-gray-400")}>
                        <Star size={20} fill={formData.isBestSeller ? "currentColor" : "none"} />
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white">Best Seller</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Show in home carousel</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-6 h-6 rounded-lg border-none bg-gray-200 dark:bg-gray-700 text-primary focus:ring-primary transition-all cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", formData.isOnSale ? "bg-red-500/20 text-red-500" : "bg-gray-200 dark:bg-gray-700 text-gray-400")}>
                          <Percent size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black dark:text-white">On Sale</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Apply discount price</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isOnSale}
                        onChange={e => setFormData({ ...formData, isOnSale: e.target.checked })}
                        className="w-6 h-6 rounded-lg border-none bg-gray-200 dark:bg-gray-700 text-primary focus:ring-primary transition-all cursor-pointer"
                      />
                    </div>
                    
                    <AnimatePresence>
                      {formData.isOnSale && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Price (IQD)</label>
                            <input
                              required={formData.isOnSale}
                              type="number"
                              value={formData.discountPrice}
                              onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                              placeholder="Enter sale price"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    {id ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductForm;
