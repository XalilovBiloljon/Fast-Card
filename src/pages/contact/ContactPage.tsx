import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail } from 'lucide-react';

export const ContactPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Get initial values from URL query parameters (AI can use this to fill the form)
  const initialName = searchParams.get('name') || '';
  const initialEmail = searchParams.get('email') || '';
  const initialPhone = searchParams.get('phone') || '';
  const initialMessage = searchParams.get('message') || '';

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-10 font-poppins transition-colors duration-300">
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400 mb-10 mt-10">
        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('Home')}</Link>
        <span className="mx-3">/</span>
        <span className="text-black dark:text-white">{t('Contact')}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-20">
        
        {/* Left Information Box */}
        <div className="w-full lg:w-[340px] flex-shrink-0 bg-white dark:bg-[#27272A] shadow-sm border border-gray-100 dark:border-zinc-800 rounded p-8 sm:p-10 transition-colors h-fit">
          
          {/* Call To Us */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                <Phone size={20} className="fill-white" />
              </div>
              <h3 className="text-base font-medium text-black dark:text-zinc-100">{t('Call To Us')}</h3>
            </div>
            <div className="space-y-4 text-[15px] text-black dark:text-zinc-300">
              <p>{t('We are available 24/7, 7 days a week.')}</p>
              <p>{t('Phone: +8801611112222')}</p>
            </div>
          </div>

          <div className="w-full h-px bg-black/30 dark:bg-zinc-700 my-8 transition-colors"></div>

          {/* Write To Us */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <h3 className="text-base font-medium text-black dark:text-zinc-100">{t('Write To US')}</h3>
            </div>
            <div className="space-y-4 text-[15px] text-black dark:text-zinc-300">
              <p>{t('Fill out our form and we will contact you within 24 hours.')}</p>
              <p>{t('Emails: customer@exclusive.com')}</p>
              <p>{t('Emails: support@exclusive.com')}</p>
            </div>
          </div>
          
        </div>

        {/* Right Form Box */}
        <div className="flex-1 bg-white dark:bg-[#27272A] shadow-sm border border-gray-100 dark:border-zinc-800 rounded p-8 sm:p-8 transition-colors h-[457px]">
          <form className="flex flex-col h-full gap-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input 
                type="text" 
                defaultValue={initialName}
                placeholder={t('Your Name *')} 
                className="bg-[#F5F5F5] dark:bg-[#18181B] border-none outline-none text-black dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 rounded px-4 py-3.5 text-[15px] focus:ring-1 focus:ring-[#DB4444]/50 transition-colors w-full"
                required
              />
              <input 
                type="email" 
                defaultValue={initialEmail}
                placeholder={t('Your Email *')} 
                className="bg-[#F5F5F5] dark:bg-[#18181B] border-none outline-none text-black dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 rounded px-4 py-3.5 text-[15px] focus:ring-1 focus:ring-[#DB4444]/50 transition-colors w-full"
                required
              />
              <input 
                type="tel" 
                defaultValue={initialPhone}
                placeholder={t('Your Phone *')} 
                className="bg-[#F5F5F5] dark:bg-[#18181B] border-none outline-none text-black dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 rounded px-4 py-3.5 text-[15px] focus:ring-1 focus:ring-[#DB4444]/50 transition-colors w-full"
                required
              />
            </div>
            
            <textarea 
              defaultValue={initialMessage}
              placeholder={t('Your Message')} 
              className="bg-[#F5F5F5] dark:bg-[#18181B] border-none outline-none text-black dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 rounded px-4 py-4 text-[15px] focus:ring-1 focus:ring-[#DB4444]/50 transition-colors w-full resize-none flex-1"
            ></textarea>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-12 py-4 rounded font-medium transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {t('Send Message')}
              </button>
            </div>
            
          </form>
        </div>
        
      </div>
    </div>
  );
};
