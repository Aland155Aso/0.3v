import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Blog } from '../../types';
import { compressImage, dataURLtoBlob } from '../../lib/imageUtils';
import { ArrowLeft, Save, Upload, X, FileText, Tag, Loader2, Calendar, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const BlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Nutrition',
    image: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'blogs', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              title: data.title,
              excerpt: data.excerpt,
              content: data.content,
              category: data.category,
              image: data.image,
              date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            });
            setImagePreview(data.image);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          toast.error('Failed to load blog data');
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    let finalImage = formData.image;
    if (imageUrlInput.trim()) {
      finalImage = imageUrlInput.trim();
    }

    if (!finalImage && !imageFile) {
      toast.error('Please provide a cover image');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = finalImage;

      if (imageFile) {
        toast.loading('Uploading cover image...', { id: 'upload-blog' });
        const compressedBase64 = await compressImage(imageFile, 1200, 800, 0.8);
        const blob = dataURLtoBlob(compressedBase64);
        
        try {
          const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
          const uploadResult = await uploadBytes(storageRef, blob);
          imageUrl = await getDownloadURL(uploadResult.ref);
          toast.success('Image uploaded', { id: 'upload-blog' });
        } catch (storageError) {
          console.warn('Storage upload failed, using base64:', storageError);
          imageUrl = compressedBase64;
          toast.success('Image processed', { id: 'upload-blog' });
        }
      }

      const blogData = {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString()
      };

      if (id) {
        await setDoc(doc(db, 'blogs', id), blogData);
        toast.success('Blog updated successfully');
      } else {
        await addDoc(collection(db, 'blogs'), blogData);
        toast.success('Blog created successfully');
      }

      navigate('/admin', { state: { tab: 'blogs' } });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Nutrition', 'Wellness', 'Supplements', 'Health', 'Fitness', 'Lifestyle'];

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
            onClick={() => navigate('/admin', { state: { tab: 'blogs' } })}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-xl font-black dark:text-white">
            {id ? 'Edit Blog' : 'New Blog'}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="md:col-span-1 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cover Image</label>
                <div className="aspect-[3/2] bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden relative group">
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
                      <span className="text-xs font-bold text-gray-400 uppercase">Upload Cover</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
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

            {/* Content Fields */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={14} /> Heading / Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                    placeholder="e.g. The Benefits of Vitamin D"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={14} /> Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Display Date
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                      placeholder="e.g. April 7, 2026"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Excerpt (Short Summary)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                    placeholder="A short summary for the home page widget..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Main Context / Content (Markdown supported)
                  </label>
                  <textarea
                    required
                    rows={12}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                    placeholder="Write your full article here..."
                  />
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
                    {id ? 'Update Blog' : 'Publish Blog'}
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

export default BlogForm;
