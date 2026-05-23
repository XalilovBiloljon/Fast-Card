import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';
import { removeFromWishlist, clearWishlist } from '../../shared/store/wishlistSlice';
import { addToCart } from '../../shared/store/cartSlice';
import { ProductCard, type IProduct } from '../../shared/components/ProductCard';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const [forYouProducts, setForYouProducts] = useState<IProduct[]>([]);

  /*
    Загружаем товары для секции "Just For You".
    Берём первые 4 товара из общего каталога.
    slice(0, 4) гарантирует что выведем ровно 4 карточки.
  */
  useEffect(() => {
    const fetchForYou = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
        const all: IProduct[] = response.data?.data?.products ?? [];
        setForYouProducts(all.slice(0, 4));
      } catch (error) {
        console.error('Failed to load "Just For You" products:', error);
      }
    };
    fetchForYou();
  }, []);

  /*
    "Move All To Bag":
    1. Проходим по всем товарам в вишлисте через forEach.
    2. Добавляем каждый в корзину через addToCart.
    3. Очищаем вишлист — clearWishlist() сбрасывает items: [].
  */
  const handleMoveAllToBag = () => {
    items.forEach((product) => dispatch(addToCart(product)));
    dispatch(clearWishlist());
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-8 font-poppins">

      {/* ─── Заголовок ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-medium">Wishlist ({items.length})</h1>
        <button
          onClick={handleMoveAllToBag}
          disabled={items.length === 0}
          className="border border-gray-400 hover:border-black text-sm font-medium px-8 py-3 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Move All To Bag
        </button>
      </div>

      {/* ─── Список товаров в вишлисте ─── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <Link
            to="/"
            className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {items.map((product) => (
            /*
              Оборачиваем ProductCard в relative-контейнер,
              чтобы кнопка удаления (Trash2) позиционировалась поверх карточки.
              z-30 гарантирует что trash-кнопка перекрывает кнопки внутри ProductCard.
            */
            <div key={product.id} className="relative">
              <button
                onClick={() => dispatch(removeFromWishlist(product.id))}
                title="Remove from wishlist"
                className="absolute top-3 right-3 z-30 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} className="text-gray-500 hover:text-[#DB4444] transition-colors" />
              </button>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* ─── Just For You ─── */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
          <span className="text-lg font-semibold">Just For You</span>
        </div>
        <Link
          to="/products"
          className="border border-gray-400 hover:border-black text-sm font-medium px-8 py-3 rounded-md transition-colors"
        >
          See All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {forYouProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
