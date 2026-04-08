import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Instagram } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black dark:text-white">{t('contact')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {t('contact_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold dark:text-white">{t('get_in_touch')}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Instagram size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">Instagram</div>
                  <a 
                    href="https://www.instagram.com/bio_supplementt?igsh=MXdhZjQ3bjh1b3Bs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold dark:text-white hover:text-primary transition-colors break-all"
                  >
                    @bio_supplementt
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t('call_us')}</div>
                  <div className="font-bold dark:text-white">(+964 7722376747)</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t('visit_us')}</div>
                  <div className="font-bold dark:text-white">iraq, Kurdistan, Sulaymaniyah</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-3xl text-white space-y-4">
            <h3 className="text-xl font-bold">{t('business_hours')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('mon_fri')}</span>
                <span className="font-bold">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{t('sat')}</span>
                <span className="font-bold">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{t('sun')}</span>
                <span className="font-bold text-primary-200">{t('closed')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-gray-300">{t('customer_name')}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                  placeholder={t('customer_name')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-gray-300">{t('email')}</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-gray-300">{t('message')}</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                placeholder={t('message_placeholder')}
              />
            </div>

            <button
              disabled={status === 'loading'}
              type="submit"
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl",
                status === 'success' ? "bg-green-500 text-white" : "bg-primary hover:bg-primary-dark text-white shadow-primary/30"
              )}
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : status === 'success' ? (
                <>
                  <CheckCircle size={20} />
                  {t('message_sent')}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t('send')}
                </>
              )}
            </button>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center font-bold"
                >
                  {t('error_message')}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
