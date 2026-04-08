import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white p-1 rounded">Bio</span>
            <span className="dark:text-white">Supplements</span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('hero_subtitle')}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/bio_supplementt?igsh=MXdhZjQ3bjh1b3Bs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 dark:text-white">{t('shop')}</h3>
          <ul className="space-y-2">
            <li><Link to="/products?category=Skin Care" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('skin_care')}</Link></li>
            <li><Link to="/products?category=Vitamins" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('vitamins')}</Link></li>
            <li><Link to="/products?category=Pre-workout" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('pre_workout')}</Link></li>
            <li><Link to="/products?category=Herbs" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('herbs')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 dark:text-white">{t('about')}</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('about')}</Link></li>
            <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('contact')}</Link></li>
            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('shipping_policy')}</a></li>
            <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">{t('privacy_policy')}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 dark:text-white">{t('contact')}</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>iraq, Kurdistan, Sulaymaniyah</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Phone size={18} className="text-primary shrink-0" />
              <span>(+964 7722376747)</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Instagram size={18} className="text-primary shrink-0" />
              <a href="https://www.instagram.com/bio_supplementt?igsh=MXdhZjQ3bjh1b3Bs" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@bio_supplementt</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Bio Supplements. {t('all_rights_reserved')}
      </div>
    </footer>
  );
};

export default Footer;
