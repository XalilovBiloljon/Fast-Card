import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, X, Code2, Smartphone, Mail, ExternalLink } from 'lucide-react';

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer = () => {
  const { t } = useTranslation();
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isDeveloperModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDeveloperModalOpen]);

  // Allow other components (like AI Assistant) to open the modal via custom event
  useEffect(() => {
    const handleOpenModal = () => setIsDeveloperModalOpen(true);
    window.addEventListener('openDeveloperModal', handleOpenModal);
    return () => window.removeEventListener('openDeveloperModal', handleOpenModal);
  }, []);

  /*
    Используем CSS Grid для футера:
    - grid-cols-1 для мобильных устройств (колонки выстраиваются вертикально)
    - md:grid-cols-3 lg:grid-cols-5 для планшетов и десктопов (распределение на несколько колонок)
    - gap-8 и gap-y-10 для отступов между элементами сетки
    Темная тема футера используется для контраста по всем канонам e-commerce
  */
  return (
    <footer className="bg-black text-white pt-16 pb-6">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Основная сетка футера */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8 lg:gap-10 mb-12 lg:mb-16">
          
          {/* Колонка 1: Подписка / Логотип */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-wider mb-6">Exclusive</h3>
            <p className="text-lg font-medium">Subscribe</p>
            <p className="text-sm text-gray-300">Get 10% off your first order</p>
            
            {/* Поле для ввода Email */}
            <div className="relative mt-4 max-w-[250px]">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-black border border-white rounded py-2.5 pl-4 pr-10 text-sm outline-none focus:border-gray-400 transition-colors placeholder:text-gray-500"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-300 transition-colors"
                aria-label="Subscribe"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Колонка 2: Поддержка */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6">Support</h3>
            <p className="text-sm text-gray-300 max-w-[200px] leading-relaxed">
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
            </p>
            <p className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
              exclusive@gmail.com
            </p>
            <p className="text-sm text-gray-300">
              +88015-88888-9999
            </p>
          </div>

          {/* Колонка 3: Аккаунт */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-lg font-medium mb-4 lg:mb-6">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/account" className="text-sm text-gray-300 hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Login / Register</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-300 hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-300 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-300 hover:text-white transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Колонка 4: Быстрые ссылки */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-lg font-medium mb-4 lg:mb-6">Quick Link</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Terms Of Use</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Колонка 5: Социальные сети (Адаптация под макет) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6">Social</h3>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <FacebookIcon size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <TwitterIcon size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <LinkedinIcon size={24} />
              </a>
            </div>
          </div>

        </div>

        {/* Копирайт */}
        <div className="border-t border-gray-800/80 pt-6 mt-8 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
            <span className="text-base sm:text-lg">&copy;</span> Copyright FastCart {new Date().getFullYear()}. All right reserved
          </p>
          <p className="text-gray-400 text-sm font-medium">
            Designed & Developed by{' '}
            <button 
              onClick={() => setIsDeveloperModalOpen(true)}
              className="text-white font-bold tracking-wider ml-1 hover:text-[#DB4444] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#DB4444] hover:after:w-full after:transition-all after:duration-300"
            >
              Biloljon Khalilov
            </button>
          </p>
        </div>
        
      </div>

      {/* Developer Modal */}
      {isDeveloperModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsDeveloperModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-[360px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_-12px_rgba(219,68,68,0.3)] dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/40 dark:border-zinc-700/50 font-poppins">
            
            {/* Header/Cover */}
            <div className="h-24 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <button 
                onClick={() => setIsDeveloperModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md active:scale-95"
              >
                <X size={16} />
              </button>
              
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/20 dark:bg-black/40 backdrop-blur-md p-1 rounded-full shadow-[0_0_20px_rgba(219,68,68,0.4)] border border-white/20">
                <div className="w-full h-full bg-gradient-to-br from-[#DB4444] to-red-700 rounded-full flex items-center justify-center text-white shadow-inner">
                  <Code2 size={26} />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="pt-10 pb-5 px-5 text-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Biloljon Khalilov</h2>
              <p className="text-[#DB4444] font-medium text-[10px] mb-3 uppercase tracking-[0.2em]">{t('developer_role')}</p>
              
              {/* Skills Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                {['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'Vite', 'Swiper'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-gray-100/80 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 rounded-lg text-[10px] font-bold tracking-wider backdrop-blur-sm border border-gray-200/50 dark:border-zinc-700/50">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl p-3.5 mb-4 border border-gray-100 dark:border-zinc-800/50 backdrop-blur-sm">
                <p className="text-gray-600 dark:text-zinc-400 text-xs leading-relaxed italic">
                  "{t('developer_praise')}"
                </p>
              </div>
              
              {/* Contact Links */}
              <div className="flex flex-col gap-2 text-left">
                <a href="tel:+992985000986" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-md dark:hover:shadow-lg transition-all group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700/50">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Телефон / WhatsApp</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">(+992) 985-000-986</p>
                  </div>
                </a>
                
                <a href="mailto:khalilovbiloljon2009@gmail.com" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-md dark:hover:shadow-lg transition-all group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700/50">
                  <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shadow-sm">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-[11px] font-bold text-gray-800 dark:text-zinc-200 tracking-tight">khalilovbiloljon2009@gmail.com</p>
                  </div>
                </a>
                
                <a href="https://instagram.com/xalilov.oo9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-md dark:hover:shadow-lg transition-all group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700/50">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform shadow-sm">
                    <InstagramIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Instagram</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">@xalilov.oo9</p>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                
                <a href="https://github.com/XalilovBiloljon" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-md dark:hover:shadow-lg transition-all group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700/50">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">GitHub</p>
                    <p className="text-[13px] font-bold text-gray-800 dark:text-zinc-200">XalilovBiloljon</p>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
