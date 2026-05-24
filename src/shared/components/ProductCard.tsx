import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/images/`;

/*
  Утилита для построения URL изображения.
  Если image уже является полным URL (начинается с http), возвращаем как есть.
  Если это просто имя файла — склеиваем с IMAGE_BASE_URL.
*/
const buildImageUrl = (image: string): string => {
  if (!image || image.trim() === '') return 'https://placehold.co/400x400/EAEAEA/999999?text=No+Image';
  if (image.startsWith('http') || image.startsWith('data:')) return image;
  return `${IMAGE_BASE_URL}${image}`;
};

export interface IProduct {
  id: number;
  productName: string;
  image: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  quantity: number;
}

interface ProductCardProps {
  product: IProduct;
  hideDiscountBadge?: boolean;
}

export const ProductCard = ({ product, hideDiscountBadge = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [isAdded, setIsAdded] = useState(false);
  const { t } = useTranslation();

  const isLiked = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isLiked) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  /*
    Проверка прав доступа при клике на добавление в корзину:
    Проверяем состояние isAuthenticated (из store авторизации).
    Если пользователь не авторизован (!isAuthenticated), вызываем navigate('/login') 
    для редиректа на страницу входа.
    Если авторизован, добавляем товар в стейт корзины и временно меняем текст 
    кнопки на "Added!" на 2 секунды.
  */
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart(product));
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const discountPercent = product.hasDiscount && product.price > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = buildImageUrl(product.image);

  return (
    <div className="flex flex-col gap-4 font-poppins group cursor-pointer w-full">
      {/* Контейнер изображения и бейджей */}
      <div className="relative bg-[#F5F5F5] dark:bg-[#27272A] rounded-md h-[250px] w-full flex items-center justify-center p-8 overflow-hidden transition-colors">
        {/* Бейдж скидки */}
        {product.hasDiscount && !hideDiscountBadge && discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs px-3 py-1 rounded-sm z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Иконки действий */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={handleWishlistClick}
            className="bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-sm hover:text-[#DB4444] dark:hover:text-[#DB4444] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-zinc-700"
          >
            <Heart size={20} className={isLiked ? 'fill-[#DB4444] text-[#DB4444]' : 'text-black dark:text-zinc-200'} />
          </button>
          
          <Link to={`/product/${product.id}`} className="bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-sm hover:text-[#DB4444] dark:hover:text-[#DB4444] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center border border-transparent dark:border-zinc-700">
            <Eye size={20} className="text-black dark:text-zinc-200 hover:text-[#DB4444]" />
          </Link>
        </div>

        {/* Изображение товара */}
        {/*
          Обработчик ошибки загрузки изображения:
          Если полное составное имя картинки по целевому URL недоступно (вернет ошибку 404),
          сработает onError. Мы автоматически переключаем src элемента на резервную картинку (placeholder).
        */}
        <img 
          src={imageUrl} 
          alt={product.productName} 
          onError={(e) => { 
            if (e.currentTarget.getAttribute('data-failed')) return;
            e.currentTarget.setAttribute('data-failed', 'true');
            e.currentTarget.src = 'https://placehold.co/400x400/EAEAEA/999999?text=No+Image'; 
          }}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Кнопка добавления в корзину (появляется при ховере) */}
        <button 
          onClick={handleAddToCartClick}
          className="absolute bottom-0 left-0 right-0 bg-black dark:bg-[#DB4444] text-white py-3 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-md z-20"
        >
          {isAdded ? t("Added!") : t("Add To Cart")}
        </button>
      </div>

      {/* Информация о товаре */}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium text-black dark:text-zinc-100 line-clamp-1 transition-colors">
          {product.productName}
        </h3>
        
        <div className="flex gap-3 text-base">
          <span className="text-[#DB4444] font-medium">
            ${product.hasDiscount ? product.discountPrice : product.price}
          </span>
          {product.hasDiscount && (
            <span className="text-gray-500 dark:text-zinc-500 line-through font-medium">
              ${product.price}
            </span>
          )}
        </div>
        
        {/* Рейтинг (заглушка 5 звезд) */}
        <div className="flex items-center gap-2">
          <div className="flex text-[#FFAD33] gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <span className="text-gray-500 text-sm font-semibold">({product.quantity || 88})</span>
        </div>
      </div>
    </div>
  );
};
