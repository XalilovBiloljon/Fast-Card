import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard, type IProduct } from '../../../shared/components/ProductCard';


export const FlashSalesSection = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const getInitialTime = () => {
    const savedEndTime = localStorage.getItem('flashSalesEndTime');
    const now = Math.floor(Date.now() / 1000);

    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      if (endTime > now) {
        return endTime - now;
      }
    }

    const threeDays = 3 * 24 * 60 * 60;
    localStorage.setItem('flashSalesEndTime', (now + threeDays).toString());
    return threeDays;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
        if (response.data?.data?.products) {
          const allProducts = response.data.data.products as IProduct[];
          const discountedProducts = allProducts.filter(p => p.hasDiscount);
          setProducts(discountedProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
    Таймер обратного отсчета для распродажи (Flash Sales).
    Каждую секунду уменьшаем timeLeft на 1.
    Если prev достигает 0, вместо остановки сбрасываем таймер на 3 дня,
    чтобы он работал циклично без остановок.
    При сбросе также обновляем localStorage.
  */
  useEffect(() => {
    const RESET_SECONDS = 3 * 24 * 60 * 60;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const now = Math.floor(Date.now() / 1000);
          localStorage.setItem('flashSalesEndTime', (now + RESET_SECONDS).toString());
          return RESET_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const timerData = formatTime(timeLeft);
  /*
    isTimerExpired — true когда таймер дошёл до 1 секунды перед сбросом.
    RESET_SECONDS — 1 значит таймер только что сбросился, значит распродажа закончилась на мгновение перед сбросом.
  */
  const RESET_SECONDS = 3 * 24 * 60 * 60;
  const isTimerExpired = timeLeft === RESET_SECONDS;

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 mb-20 font-poppins mt-20 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
        <span className="text-[#DB4444] font-semibold text-base">{t("Today's")}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-0 mb-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide dark:text-white">{t("Flash Sales")}</h2>
          
          <div className="flex items-end gap-2 sm:gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1 dark:text-gray-300">{t("Days")}</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest dark:text-white">{timerData.days}</span>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-[#DB4444] pb-1 sm:pb-1">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1 dark:text-gray-300">{t("Hours")}</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest dark:text-white">{timerData.hours}</span>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-[#DB4444] pb-1 sm:pb-1">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1 dark:text-gray-300">{t("Minutes")}</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest dark:text-white">{timerData.minutes}</span>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-[#DB4444] pb-1 sm:pb-1">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1 dark:text-gray-300">{t("Seconds")}</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest dark:text-white">{timerData.seconds}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            ref={prevRef}
            className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft size={24} className="text-black dark:text-zinc-200" />
          </button>
          <button 
            ref={nextRef}
            className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowRight size={24} className="text-black dark:text-zinc-200" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Loading products...</div>
      ) : (
        <div className="relative w-full">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onBeforeInit={(swiper) => {
              // @ts-expect-error Swiper types
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-expect-error Swiper types
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="w-full pb-10"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product} 
                  hideDiscountBadge={isTimerExpired} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Link
          to="/products"
          className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-12 py-4 rounded-md font-medium transition-colors"
        >
          {t("View All Products")}
        </Link>
      </div>
      
      <div className="w-full border-b border-gray-200 dark:border-zinc-800 mt-14 transition-colors" />
    </section>
  );
};
