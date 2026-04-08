import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Target, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1920"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="About Bio Supplements"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center space-y-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            {t('about')} Bio Supplements
          </motion.h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black dark:text-white">{t('our_story')}</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('about_desc1')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('about_desc2')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-primary/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-2">
            <Users size={32} className="text-primary" />
            <div className="text-2xl font-black dark:text-white">50k+</div>
            <div className="text-xs font-bold text-gray-500 uppercase">{t('happy_clients')}</div>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-2">
            <Award size={32} className="text-primary" />
            <div className="text-2xl font-black dark:text-white">100%</div>
            <div className="text-xs font-bold text-gray-500 uppercase">{t('authentic')}</div>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-2">
            <Target size={32} className="text-primary" />
            <div className="text-2xl font-black dark:text-white">10+</div>
            <div className="text-xs font-bold text-gray-500 uppercase">{t('top_brands')}</div>
          </div>
          <div className="aspect-square bg-primary/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-2">
            <Shield size={32} className="text-primary" />
            <div className="text-2xl font-black dark:text-white">Lab</div>
            <div className="text-xs font-bold text-gray-500 uppercase">{t('lab_tested')}</div>
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-2xl font-black text-white">{t('mission')}</h3>
            <p className="text-primary-50">
              {t('mission_desc')}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-2xl font-black text-white">{t('vision')}</h3>
            <p className="text-primary-50">
              {t('vision_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
