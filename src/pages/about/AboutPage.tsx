import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, DollarSign, ShoppingBag, CircleDollarSign } from 'lucide-react';
import { FeaturesSection } from '../home/sections/FeaturesSection';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const stats = [
  {
    id: 1,
    icon: Store,
    value: '10.5k',
    label: 'Sellers active our site',
    isActive: false,
  },
  {
    id: 2,
    icon: DollarSign,
    value: '33k',
    label: 'Monthly Product Sale',
    isActive: true,
  },
  {
    id: 3,
    icon: ShoppingBag,
    value: '45.5k',
    label: 'Customer active in our site',
    isActive: false,
  },
  {
    id: 4,
    icon: CircleDollarSign, 
    value: '25k',
    label: 'Annual gross sale in our site',
    isActive: false,
  },
];

const team = [
  {
    id: 1,
    name: 'Tom Cruise',
    role: 'Founder & Chairman',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Emma Watson',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Will Smith',
    role: 'Product Designer',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Tom Cruise',
    role: 'Founder & Chairman',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Emma Watson',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full font-poppins transition-colors duration-300 dark:bg-[#18181B]">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1250px] mx-auto px-4 lg:px-8 pt-10 pb-10">
        <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('Home')}</Link>
          <span className="mx-3">/</span>
          <span className="text-black dark:text-white">{t('About')}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1250px] mx-auto px-4 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:pr-10">
            <h1 className="text-4xl md:text-[54px] font-semibold text-black dark:text-zinc-100 tracking-wider mb-2">
              {t('Our Story')}
            </h1>
            <p className="text-[16px] leading-relaxed text-black dark:text-zinc-300">
              {t("Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.")}
            </p>
            <p className="text-[16px] leading-relaxed text-black dark:text-zinc-300">
              {t("Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.")}
            </p>
          </div>
          <div className="w-full lg:w-1/2 rounded overflow-hidden">
            <img 
              src="/images/Side Image.png" 
              alt="Our Story" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1250px] mx-auto px-4 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className={`flex flex-col items-center justify-center py-10 px-4 rounded border transition-colors duration-300 shadow-sm
                ${stat.isActive 
                  ? 'bg-[#DB4444] border-[#DB4444] text-white' 
                  : 'bg-white dark:bg-[#27272A] border-gray-200 dark:border-zinc-800 text-black dark:text-zinc-100 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] dark:hover:bg-[#DB4444] dark:hover:border-[#DB4444] group cursor-pointer'
                }`}
            >
              <div className={`w-[70px] h-[70px] rounded-full flex items-center justify-center p-1.5 mb-5 transition-colors
                ${stat.isActive 
                  ? 'bg-white/30' 
                  : 'bg-gray-200 dark:bg-zinc-700 group-hover:bg-white/30'
                }`}
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors
                  ${stat.isActive 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white dark:bg-zinc-900 group-hover:bg-white group-hover:text-black'
                  }`}
                >
                  <stat.icon size={26} className={stat.isActive ? "stroke-[1.5]" : "stroke-[1.5]"} />
                </div>
              </div>
              <h2 className="text-[32px] font-bold mb-1 tracking-wider">{stat.value}</h2>
              <p className={`text-[15px] ${stat.isActive ? 'text-white/90' : 'text-black dark:text-zinc-300 group-hover:text-white/90'}`}>
                {t(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-[1250px] mx-auto px-4 lg:px-8 pb-24 relative about-team-swiper">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, el: '.custom-about-pagination' }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {team.map((member) => (
            <SwiperSlide key={member.id}>
              <div className="flex flex-col">
                <div className="bg-[#F5F5F5] dark:bg-zinc-800 pt-8 px-8 rounded flex items-end justify-center h-[400px] mb-6 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-[80%] h-auto object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
                <h3 className="text-3xl font-medium text-black dark:text-zinc-100 tracking-wide mb-2">{member.name}</h3>
                <p className="text-[15px] text-gray-800 dark:text-zinc-300 mb-4">{t(member.role)}</p>
                <div className="flex gap-4">
                  <a href="#" className="text-black dark:text-zinc-100 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="#" className="text-black dark:text-zinc-100 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="text-black dark:text-zinc-100 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Pagination Dots container */}
        <div className="custom-about-pagination flex items-center justify-center gap-3 mt-12"></div>
      </div>

      {/* Features Section */}
      <div className="pb-10 pt-10">
        <FeaturesSection />
      </div>

    </div>
  );
};
