import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Truck, RefreshCw, Star, Minus, Plus } from 'lucide-react';
import { ProductCard, type IProduct } from '../../shared/components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';
import { addToWishlist, removeFromWishlist } from '../../shared/store/wishlistSlice';
import { addToCart } from '../../shared/store/cartSlice';

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/images/`;

/*
  Утилита для построения URL изображения.
  Если image уже является полным URL (начинается с http), возвращаем как есть.
  Если это просто имя файла — склеиваем с IMAGE_BASE_URL.
*/
const buildImageUrl = (image: string): string => {
  if (!image) return '/images/placeholder.avif';
  if (image.startsWith('http')) return image;
  return `${IMAGE_BASE_URL}${image}`;
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
const MOCK_COLORS = [
  { id: 1, hex: '#6B7280' },
  { id: 2, hex: '#DB4444' },
];

/*
  Структура одного элемента из массива images, который возвращает API.
  В новом API images — это массив строк (имена файлов или полные URL).
*/

interface IProductDetail extends IProduct {
  description?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  images?: string[];
}

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /*
    mainImage хранит только имя файла (например: "abc.jpg"), а не полный URL.
    Полный URL собирается в src: `${IMAGE_BASE_URL}${mainImage}`.
    Это позволяет корректно сравнивать активную миниатюру по item.images.
  */
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const isLiked = product ? wishlistItems.some((item) => item.id === product.id) : false;

  /*
    Запрос деталей конкретного товара по id из URL (useParams).
    Если сервер не вернул данные — выходим из функции.
    После получения ответа инициализируем mainImage первой картинкой с сервера.
  */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/Product/get-product-by-id?id=${id}`
        );
        const data = response.data?.data;
        if (data) {
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /*
    Инициализируем главное изображение как только product загрузился.
    Берём первый элемент из массива строк product.images.
    Отдельный useEffect нужен потому что product устанавливается асинхронно —
    к моменту первого рендера он ещё null.
  */
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  /*
    Запрос связанных товаров.
    .filter((_, idx) => idx < 4) — берём первые 4 без .sort() и spread-операторов.
  */
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
        const all: IProduct[] = response.data?.data?.products ?? [];
        setRelatedProducts(all.filter((_, idx) => idx < 4));
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };

    fetchRelated();
  }, []);

  /*
    Обработчик кнопки "Buy Now".
    Проверяем isAuthenticated: если не авторизован — редиректим на /login.
    Если авторизован — добавляем товар в корзину и переходим на страницу корзины.
  */
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) return;

    /*
      Добавляем товар в корзину quantity раз.
      addToCart каждый раз увеличивает cartQuantity на 1,
      поэтому вызываем его в цикле согласно выбранному количеству.
    */
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
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

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  /*
    Убираем старый thumbnails массив — теперь рендер миниатюр идёт
    напрямую через product.images.map() в JSX ниже.
  */

  if (isLoading) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-16 font-poppins">
        <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
          <div className="flex gap-4 flex-1">
            <div className="flex flex-col gap-3 w-[112px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-[100px] bg-gray-200 rounded-md" />
              ))}
            </div>
            <div className="flex-1 bg-gray-200 rounded-md h-[400px]" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-poppins">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <Link to="/" className="mt-4 text-[#DB4444] hover:underline">Back to Home</Link>
      </div>
    );
  }

  const displayPrice = product.hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-8 font-poppins">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="hover:text-black transition-colors cursor-pointer">Gaming</span>
        <span>/</span>
        <span className="text-black">{product.productName}</span>
      </nav>

      {/* Основная секция */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Галерея изображений */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 lg:w-[55%]">
          {/* Миниатюры — рендерим по массиву product.images из API */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
            {(product.images ?? []).map((imageStr, index) => (
              <button
                key={index}
                onClick={() => setMainImage(imageStr)}
                className={`flex-shrink-0 w-[100px] h-[100px] rounded-md bg-[#F5F5F5] flex items-center justify-center p-2 border-2 transition-colors ${
                  mainImage === imageStr ? 'border-[#DB4444]' : 'border-transparent'
                }`}
              >
                <img
                  src={buildImageUrl(imageStr)}
                  alt={`thumb-${index}`}
                  onError={(e) => { 
                    if (e.currentTarget.getAttribute('data-failed')) return;
                    e.currentTarget.setAttribute('data-failed', 'true');
                    e.currentTarget.src = '/images/placeholder.avif'; 
                  }}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Главное изображение — строим полный URL из имени файла */}
          <div className="flex-1 bg-[#F5F5F5] rounded-md flex items-center justify-center p-8 min-h-[300px] lg:min-h-[400px]">
            <img
              src={mainImage ? buildImageUrl(mainImage) : '/images/placeholder.avif'}
              alt={product.productName}
              onError={(e) => { 
                if (e.currentTarget.getAttribute('data-failed')) return;
                e.currentTarget.setAttribute('data-failed', 'true');
                e.currentTarget.src = '/images/placeholder.avif'; 
              }}
              className="max-h-[380px] w-full object-contain transition-all duration-300"
            />
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="flex-1 flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">{product.productName}</h1>

          {/* Рейтинг + статус */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex text-[#FFAD33] gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-gray-400">(150 Reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="text-green-500 font-medium">In Stock</span>
          </div>

          {/* Цена */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-medium">${displayPrice}.00</span>
            {product.hasDiscount && (
              <span className="text-gray-400 line-through text-lg">${product.price}.00</span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed border-b border-gray-200 pb-5">
            {product.description || 'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal. Pressure sensitive.'}
          </p>

          {/* Цвета */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-sm">Colours:</span>
            <div className="flex gap-2">
              {MOCK_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedColor === color.id ? 'border-black scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Размеры */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-sm">Size:</span>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                    selectedSize === size
                      ? 'bg-[#DB4444] text-white border-[#DB4444]'
                      : 'border-gray-300 hover:border-[#DB4444] text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Количество + кнопки */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium text-base border-x border-gray-300 h-11 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-11 flex items-center justify-center bg-[#DB4444] text-white hover:bg-[#c23b3b] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#DB4444] hover:bg-[#c23b3b] text-white py-3 rounded-md font-medium transition-colors"
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`w-11 h-11 rounded-md border flex items-center justify-center transition-colors ${
                isLiked ? 'bg-[#DB4444] border-[#DB4444] text-white' : 'border-gray-300 hover:border-[#DB4444]'
              }`}
            >
              <Heart size={20} className={isLiked ? 'fill-white' : ''} />
            </button>
          </div>

          {/* Доставка */}
          <div className="border border-gray-200 rounded-md overflow-hidden mt-2">
            <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-200">
              <Truck size={36} className="text-black flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-gray-500 mt-1">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-start gap-4 px-5 py-4">
              <RefreshCw size={36} className="text-black flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Return Delivery</p>
                <p className="text-xs text-gray-500 mt-1">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
          <span className="text-[#DB4444] font-semibold text-base">Related Item</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
