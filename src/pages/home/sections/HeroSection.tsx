import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';


export interface ISubCategory {
  id: number;
  subCategoryName: string;
}

export interface ICategory {
  id: number;
  categoryName: string;
  categoryImage: string;
  subCategories: ISubCategory[];
}

const mockBanners = [
  {
    id: 1,
    title: 'Up to 10% off Voucher',
    subtitle: 'iPhone 17 Series',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png', 
  },
  {
    id: 2,
    title: 'Up to 20% off Voucher',
    subtitle: 'MacBook Pro',
    image: 'https://www.apple.com/newsroom/images/2025/10/apple-unveils-new-14-inch-macbook-pro-powered-by-the-m5-chip/tile/Apple-MacBook-Pro-14-in-hero-251015-lp.jpg.landing-big_2x.jpg',
  },
  {
    id: 3,
    title: 'Up to 15% off Voucher',
    subtitle: 'Apple Watch Series 8',
    image: 'https://tse1.mm.bing.net/th/id/OIP.kbTdHfnQg0e8O_BtkODOagHaEK?rs=1&pid=ImgDetMain',
  },
  {
    id: 4,
    title: 'Up to 5% off Voucher',
    subtitle: 'AirPods Pro',
    image: 'https://tse4.mm.bing.net/th/id/OIP.yWYTqo5TgY8iaaIgxoyn0AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: 5,
    title: 'Up to 25% off Voucher',
    subtitle: 'iPad Air',
    image: 'https://tse3.mm.bing.net/th/id/OIP.C0QSwpDaeiI63SE8ZcF8QQHaHm?rs=1&pid=ImgDetMain&o=7&rm=3',
  }
];

export const HeroSection = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
    Хук эффекта для получения списка категорий с сервера при монтировании компонента.
    Используем axios для GET-запроса на /get-categories.
    Устанавливаем состояние загрузки (isLoading) перед отправкой запроса,
    чтобы показать индикатор, и сбрасываем его в блоке finally, когда запрос завершен
    (успешно или с ошибкой). В случае ошибки устанавливаем сообщение в состояние error.
  */
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: ICategory[] }>(`${import.meta.env.VITE_API_BASE_URL}/Category/get-categories`);
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8 mb-10 pt-4 lg:pt-10 font-poppins">
      {/* Sidebar - Категории */}
      <aside className="w-full lg:w-64 flex-shrink-0 lg:border-r lg:border-gray-200 dark:lg:border-neutral-800 lg:pr-6 transition-colors duration-300">
        {isLoading && <div className="text-sm text-gray-500 py-2">Loading categories...</div>}
        {error && <div className="text-sm text-red-500 py-2">{error}</div>}
        
        {!isLoading && !error && (
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 lg:gap-4 pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {categories.slice(0, 9).map((category) => (
              <Link 
                to={`/products?category=${category.id}`} 
                key={category.id} 
                className="flex items-center justify-between px-5 py-2.5 lg:px-0 lg:py-0 bg-gray-100 lg:bg-transparent dark:bg-zinc-800/80 lg:dark:bg-transparent rounded-full lg:rounded-none text-sm lg:text-base whitespace-nowrap lg:whitespace-normal text-gray-700 dark:text-gray-300 hover:bg-gray-200 lg:hover:bg-transparent dark:hover:bg-zinc-700 lg:dark:hover:bg-transparent lg:hover:text-black lg:dark:hover:text-white font-medium lg:font-normal lg:hover:font-medium transition-all leading-tight border border-transparent dark:border-zinc-700/50 lg:dark:border-transparent"
              >
                <span>{category.categoryName}</span>
                {category.subCategories && category.subCategories.length > 0 && (
                  <ChevronRight size={16} className="hidden lg:block text-gray-800 dark:text-gray-300 ml-2" />
                )}
              </Link>
            ))}
          </nav>
        )}
      </aside>

      {/* Banner - Swiper */}
      <div className="flex-grow w-full max-w-full overflow-hidden">
        {/*
          Конфигурация Swiper:
          - modules: подключаем Autoplay для автоматического перелистывания и Pagination для точек внизу.
          - autoplay: delay - время между слайдами (3 секунды), disableOnInteraction - продолжаем автоплей после свайпа пользователем.
          - pagination: clickable: true позволяет кликать по точкам для перехода к конкретному слайду.
          - loop: true для бесконечной прокрутки.
        */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full bg-black text-white h-[200px] sm:h-[300px] md:h-[344px] rounded-sm relative"
        >
          {mockBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="flex items-center justify-between h-full px-6 md:px-16 w-full">
                <div className="flex flex-col z-10 w-[50%] pt-4 lg:pt-8 pb-4 lg:pb-8">
                  <div className="flex items-center gap-3 md:gap-5 mb-4 max-w-full">
                    {/* Apple Logo Icon placeholder */}
                    <svg className="w-8 h-8 md:w-10 md:h-10 shrink-0" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    <span className="text-sm md:text-base text-gray-200 lg:mt-1 truncate">{banner.subtitle}</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold leading-tight md:leading-[60px] tracking-wide mb-5 md:mb-8 font-inter">
                    {banner.title.split(' ').map((word, i, arr) => 
                      i === arr.length - 1 ? <span key={i}><br className="hidden md:block"/>{word}</span> : word + ' '
                    )}
                  </h2>
                  
                  <a href="#" className="flex items-center gap-2 w-fit group text-base md:text-lg border-b border-white pb-1 font-medium">
                    Shop Now
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                
                <div className="absolute right-0 bottom-0 h-[80%] md:h-[90%] w-[50%] md:w-[45%] lg:w-[50%] max-w-[400px]">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-100 h-70 object-contain pt-4 md:pt-0"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #ffffff;
            opacity: 0.5;
            width: 12px;
            height: 12px;
            margin: 0 6px !important;
          }
          .swiper-pagination-bullet-active {
            background-color: #DB4444;
            opacity: 1;
            border: 2px solid white;
          }
        `}
      </style>
    </section>
  );
};
