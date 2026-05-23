import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Smartphone, Shirt, Home, Dumbbell, Baby, LayoutGrid, Camera, Headphones, Gamepad, Watch, Laptop } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Импортируем стили Swiper, если они нужны (обычно импортируются глобально, но здесь проверим)
import 'swiper/css';
import 'swiper/css/navigation';

interface ICategory {
  id: number;
  categoryName: string;
  categoryImage: string | null;
}

/*
  Хелпер-функция для сопоставления имени категории с соответствующей иконкой Lucide.
  Так как в новом API categoryImage возвращает null, мы используем статический маппинг
  по названию категории для отображения визуально красивых современных иконок.
*/
const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes('phone') || normalized.includes('smart')) return Smartphone;
  if (normalized.includes('computer') || normalized.includes('laptop')) return Laptop;
  if (normalized.includes('watch') || normalized.includes('clock')) return Watch;
  if (normalized.includes('camera') || normalized.includes('photo')) return Camera;
  if (normalized.includes('headphone') || normalized.includes('audio')) return Headphones;
  if (normalized.includes('game') || normalized.includes('gaming') || normalized.includes('console')) return Gamepad;
  if (normalized.includes('clot') || normalized.includes('shirt') || normalized.includes('fashion')) return Shirt;
  if (normalized.includes('home') || normalized.includes('appliances')) return Home;
  if (normalized.includes('sport') || normalized.includes('gym')) return Dumbbell;
  if (normalized.includes('baby') || normalized.includes('toy')) return Baby;
  return LayoutGrid;
};

export const BrowseByCategorySection = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  /*
    Эффект загрузки категорий из API.
    Используем VITE_API_BASE_URL из .env файла.
    Так как ответ API прямой (без wrapper .products), извлекаем response.data.data.
  */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Category/get-categories`);
        if (response.data?.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 py-14 border-b border-gray-200 dark:border-zinc-800 font-poppins relative transition-colors duration-300">
      {/* Метка и Заголовок секции */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
        <span className="text-[#DB4444] font-semibold text-sm">{t('Categories')}</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-semibold text-black dark:text-white tracking-wide">{t('Browse By Category')}</h2>
        
        {/* Кнопки навигации для Swiper */}
        <div className="flex gap-2">
          <button className="swiper-prev-category w-11 h-11 bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft size={18} />
          </button>
          <button className="swiper-next-category w-11 h-11 bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 rounded-full flex items-center justify-center transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Карусель категорий с использованием Swiper */}
      {categories.length === 0 ? (
        <div className="flex justify-center py-10">
          <span className="text-gray-500">Loading categories...</span>
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.swiper-prev-category',
            nextEl: '.swiper-next-category',
          }}
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="w-full"
        >
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.categoryName);

            return (
              <SwiperSlide key={cat.id}>
                <div
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className={`w-full aspect-square border rounded flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 select-none border-gray-300 dark:border-zinc-700 hover:border-[#DB4444] dark:hover:border-[#DB4444] hover:text-[#DB4444] dark:hover:text-[#DB4444] text-black dark:text-zinc-300 hover:shadow-md`}
                >
                  <IconComponent size={40} className="stroke-[1.5]" />
                  <span className="text-sm font-medium tracking-wide text-center px-2">
                    {cat.categoryName}
                  </span>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};
