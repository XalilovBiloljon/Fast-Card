import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, RefreshCw, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';
import { updateQuantity, removeFromCart, clearCart } from '../../shared/store/cartSlice';

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

const PROMO_CODE = 'Ma botm';
const DISCOUNT_RATE = 0.05;

export const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Гарантируем, что cartItems всегда массив для избежания ошибок рендеринга
  const safeCartItems = useMemo(() => cartItems ?? [], [cartItems]);

  /*
    Подсчет промежуточного итога корзины:
    Суммируем стоимость каждого товара (с учетом скидки, если она есть)
    умноженную на количество этого товара в корзине.
  */
  const subtotal = safeCartItems.reduce((acc, item) => {
    const price = item.hasDiscount ? item.discountPrice : item.price;
    return acc + price * item.cartQuantity;
  }, 0);

  /*
    Применение промокода:
    Проверяем соответствие введенного кода эталонному 'Ma botm'.
    Если код верный — устанавливаем скидку 5%, сбрасываем ошибки и выводим успех.
    Если неверный — выводим ошибку.
  */
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (couponCode.trim() === PROMO_CODE) {
      setAppliedDiscount(subtotal * DISCOUNT_RATE);
      setCouponSuccess('Купон успешно применен! Скидка 5%');
    } else {
      setCouponError('Неверный купон. Попробуйте еще раз');
      setAppliedDiscount(0);
    }
  };

  const discountAmount = appliedDiscount > 0 ? appliedDiscount : 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-10 font-poppins">
      <div className="flex gap-2 text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Cart</span>
      </div>

      {safeCartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
          <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
          <p className="text-gray-500 max-w-md">
            Looks like you haven't added any products to your cart yet. Browse our categories and find something special!
          </p>
          <Link
            to="/"
            className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-10 py-3.5 rounded-md font-medium transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div>
          <div className="hidden md:block mb-8">
            <div className="grid grid-cols-12 gap-4 border border-gray-100 shadow-sm rounded-sm py-6 px-10 font-medium text-black mb-6">
              <span className="col-span-5">Product</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-3">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            <div className="flex flex-col gap-6">
              {safeCartItems.map((item) => {
                const unitPrice = item.hasDiscount ? item.discountPrice : item.price;
                const lineTotal = unitPrice * item.cartQuantity;
                const imageUrl = buildImageUrl(item.image);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center border border-gray-100 shadow-sm rounded-sm py-6 px-10 relative group"
                  >
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="absolute top-1/2 left-3 -translate-y-1/2 bg-[#DB4444] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                      title="Remove product"
                    >
                      <X size={14} />
                    </button>

                    <div className="col-span-5 flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 flex items-center justify-center p-1 rounded">
                        <img
                          src={imageUrl}
                          alt={item.productName}
                          onError={(e) => {
                            if (e.currentTarget.getAttribute('data-failed')) return;
                            e.currentTarget.setAttribute('data-failed', 'true');
                            e.currentTarget.src = '/images/placeholder.avif';
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-black line-clamp-1">{item.productName}</span>
                    </div>

                    <span className="col-span-2 font-medium text-black">${unitPrice.toFixed(2)}</span>

                    <div className="col-span-3">
                      <div className="w-20 h-11 border border-gray-300 rounded flex items-center justify-between px-3">
                        <span className="font-medium">{item.cartQuantity}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.cartQuantity + 1 }))}
                            className="hover:text-[#DB4444]"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.cartQuantity - 1 }))}
                            disabled={item.cartQuantity <= 1}
                            className="hover:text-[#DB4444] disabled:opacity-30"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className="col-span-2 text-right font-medium text-black">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-6 mb-8">
            {safeCartItems.map((item) => {
              const unitPrice = item.hasDiscount ? item.discountPrice : item.price;
              const lineTotal = unitPrice * item.cartQuantity;
              const imageUrl = buildImageUrl(item.image);

              return (
                <div
                  key={item.id}
                  className="flex flex-col border border-gray-100 shadow-sm rounded-sm p-5 relative"
                >
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#DB4444]"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center p-1 rounded flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        onError={(e) => {
                          if (e.currentTarget.getAttribute('data-failed')) return;
                          e.currentTarget.setAttribute('data-failed', 'true');
                          e.currentTarget.src = '/images/placeholder.avif';
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black line-clamp-1">{item.productName}</h3>
                      <p className="text-gray-500 text-sm">${unitPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50">
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.cartQuantity - 1 }))}
                        disabled={item.cartQuantity <= 1}
                        className="p-1 disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <span className="px-4 font-semibold">{item.cartQuantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.cartQuantity + 1 }))}
                        className="p-1"
                      >
                        <ChevronUp size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-black">${lineTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-16">
            <Link
              to="/"
              className="border border-gray-400 hover:border-black text-black px-10 py-4 rounded-md font-medium transition-colors text-center"
            >
              Return To Shop
            </Link>
            <button
              onClick={() => dispatch(clearCart())}
              className="border border-gray-400 hover:border-black text-black px-10 py-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Clear Cart
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <form onSubmit={handleApplyCoupon} className="w-full lg:w-1/2">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-black rounded px-6 py-4 outline-none focus:border-[#DB4444] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-10 py-4 rounded font-medium transition-colors"
                >
                  Apply Coupon
                </button>
              </div>
              {couponError && <p className="text-[#DB4444] font-medium text-sm">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 font-medium text-sm">{couponSuccess}</p>}
            </form>

            <div className="w-full lg:w-[470px] border-2 border-black rounded-md p-8 font-poppins">
              <h3 className="text-xl font-medium mb-6">Cart Total</h3>

              <div className="flex justify-between pb-4 border-b border-gray-200 mb-4 font-medium">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between pb-4 border-b border-gray-200 mb-4 text-[#DB4444] font-medium">
                  <span>Discount (5%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pb-4 border-b border-gray-200 mb-4 font-medium">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="block text-center bg-[#DB4444] hover:bg-[#c23b3b] text-white py-4 rounded font-medium transition-colors w-full"
              >
                Procces to checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
