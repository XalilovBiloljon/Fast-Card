import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';
import { clearCart } from '../../shared/store/cartSlice';

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

const DISCOUNT_CODE = 'Bot+';
const DISCOUNT_PERCENT = 5.55;

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const navigate = useNavigate();

  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('cash');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Реф для фокуса при открытии модального окна успеха
  const modalRef = useRef<HTMLDivElement>(null);

  const safeCartItems = useMemo(() => cartItems ?? [], [cartItems]);

  // Переадресация на главную, если корзина пуста при входе
  useEffect(() => {
    if (safeCartItems.length === 0 && !showSuccessModal) {
      navigate('/cart');
    }
  }, [safeCartItems, navigate, showSuccessModal]);

  /*
    Подсчет промежуточного итога заказа.
  */
  const subtotal = safeCartItems.reduce((acc, item) => {
    const price = item.hasDiscount ? item.discountPrice : item.price;
    return acc + price * item.cartQuantity;
  }, 0);

  /*
    Применение купона для чекаута:
    Проверяем промокод 'Bot+'.
    Если верный — скидка 5.55%.
  */
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (couponCode.trim() === DISCOUNT_CODE) {
      setAppliedDiscountPercent(DISCOUNT_PERCENT);
      setCouponSuccess('Промокод применен! Скидка 5.55%');
    } else {
      setCouponError('Неверный промокод');
      setAppliedDiscountPercent(0);
    }
  };

  const discountAmount = subtotal * (appliedDiscountPercent / 100);
  const total = Math.max(0, subtotal - discountAmount);

  /*
    Инициализация Formik для валидации формы заказа.
    Схема валидации включает обязательные поля, формат телефона и почты.
  */
  const formik = useFormik({
    initialValues: {
      firstName: '',
      companyName: '',
      streetAddress: '',
      apartmentInfo: '',
      city: '',
      phoneNumber: '',
      emailAddress: '',
      saveInfo: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      streetAddress: Yup.string().required('Street Address is required'),
      city: Yup.string().required('Town/City is required'),
      phoneNumber: Yup.string()
        .matches(/^[+0-9\s-]{8,20}$/, 'Invalid phone number format')
        .required('Phone Number is required'),
      emailAddress: Yup.string()
        .email('Invalid email address')
        .required('Email Address is required'),
    }),
    onSubmit: (values) => {
      console.log('Order submitted:', {
        billingDetails: values,
        items: safeCartItems,
        paymentMethod,
        discountAmount,
        total,
      });

      // Открываем модальное окно успешного оформления
      setShowSuccessModal(true);

      // Очищаем корзину через Redux
      dispatch(clearCart());
    },
  });

  // Эффект для автоматической прокрутки и фокуса модалки при её открытии
  useEffect(() => {
    if (showSuccessModal && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      modalRef.current.focus();
    }
  }, [showSuccessModal]);

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-10 font-poppins relative">
      <div className="flex gap-2 text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <span>/</span>
        <span className="text-black font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-wide mb-10">Billing Details</h1>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <form onSubmit={formik.handleSubmit} className="w-full lg:w-[50%] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-gray-500 text-sm">
              First Name<span className="text-[#DB4444]">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              {...formik.getFieldProps('firstName')}
              className={`bg-[#F5F5F5] border rounded px-4 py-3 outline-none transition-colors ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-[#DB4444] focus:border-[#DB4444]'
                  : 'border-transparent focus:border-[#DB4444]'
              }`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <span className="text-[#DB4444] text-xs font-medium">{formik.errors.firstName}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="companyName" className="text-gray-500 text-sm">Company Name</label>
            <input
              id="companyName"
              type="text"
              {...formik.getFieldProps('companyName')}
              className="bg-[#F5F5F5] border border-transparent rounded px-4 py-3 outline-none focus:border-[#DB4444] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="streetAddress" className="text-gray-500 text-sm">
              Street Address<span className="text-[#DB4444]">*</span>
            </label>
            <input
              id="streetAddress"
              type="text"
              {...formik.getFieldProps('streetAddress')}
              className={`bg-[#F5F5F5] border rounded px-4 py-3 outline-none transition-colors ${
                formik.touched.streetAddress && formik.errors.streetAddress
                  ? 'border-[#DB4444] focus:border-[#DB4444]'
                  : 'border-transparent focus:border-[#DB4444]'
              }`}
            />
            {formik.touched.streetAddress && formik.errors.streetAddress && (
              <span className="text-[#DB4444] text-xs font-medium">{formik.errors.streetAddress}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="apartmentInfo" className="text-gray-500 text-sm">
              Apartment, floor, etc. (optional)
            </label>
            <input
              id="apartmentInfo"
              type="text"
              {...formik.getFieldProps('apartmentInfo')}
              className="bg-[#F5F5F5] border border-transparent rounded px-4 py-3 outline-none focus:border-[#DB4444] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="city" className="text-gray-500 text-sm">
              Town/City<span className="text-[#DB4444]">*</span>
            </label>
            <input
              id="city"
              type="text"
              {...formik.getFieldProps('city')}
              className={`bg-[#F5F5F5] border rounded px-4 py-3 outline-none transition-colors ${
                formik.touched.city && formik.errors.city
                  ? 'border-[#DB4444] focus:border-[#DB4444]'
                  : 'border-transparent focus:border-[#DB4444]'
              }`}
            />
            {formik.touched.city && formik.errors.city && (
              <span className="text-[#DB4444] text-xs font-medium">{formik.errors.city}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="text-gray-500 text-sm">
              Phone Number<span className="text-[#DB4444]">*</span>
            </label>
            <input
              id="phoneNumber"
              type="text"
              {...formik.getFieldProps('phoneNumber')}
              className={`bg-[#F5F5F5] border rounded px-4 py-3 outline-none transition-colors ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? 'border-[#DB4444] focus:border-[#DB4444]'
                  : 'border-transparent focus:border-[#DB4444]'
              }`}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <span className="text-[#DB4444] text-xs font-medium">{formik.errors.phoneNumber}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="emailAddress" className="text-gray-500 text-sm">
              Email Address<span className="text-[#DB4444]">*</span>
            </label>
            <input
              id="emailAddress"
              type="email"
              {...formik.getFieldProps('emailAddress')}
              className={`bg-[#F5F5F5] border rounded px-4 py-3 outline-none transition-colors ${
                formik.touched.emailAddress && formik.errors.emailAddress
                  ? 'border-[#DB4444] focus:border-[#DB4444]'
                  : 'border-transparent focus:border-[#DB4444]'
              }`}
            />
            {formik.touched.emailAddress && formik.errors.emailAddress && (
              <span className="text-[#DB4444] text-xs font-medium">{formik.errors.emailAddress}</span>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer mt-4 select-none">
            <input
              type="checkbox"
              {...formik.getFieldProps('saveInfo')}
              className="w-5 h-5 accent-[#DB4444] rounded border-gray-300"
            />
            <span className="text-sm font-medium">Save this information for faster check-out next time</span>
          </label>
        </form>

        <div className="w-full lg:w-[470px] flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {safeCartItems.map((item) => {
              const unitPrice = item.hasDiscount ? item.discountPrice : item.price;
              const lineTotal = unitPrice * item.cartQuantity;
              const imageUrl = buildImageUrl(item.image);

              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center p-1 rounded">
                      <img
                        src={imageUrl}
                        onError={(e) => {
                          if (e.currentTarget.getAttribute('data-failed')) return;
                          e.currentTarget.setAttribute('data-failed', 'true');
                          e.currentTarget.src = '/images/placeholder.avif';
                        }}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-medium text-black line-clamp-1 max-w-[200px]">
                      {item.productName} (x{item.cartQuantity})
                    </span>
                  </div>
                  <span className="font-semibold text-black">${lineTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">
            <div className="flex justify-between font-medium">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between font-medium text-[#DB4444]">
                <span>Discount ({appliedDiscountPercent}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-medium">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="w-5 h-5 accent-[#DB4444]"
                />
                <span className="font-medium">Bank</span>
              </div>
              <div className="flex gap-2">
                <img src="/images/placeholder.avif" alt="Bank" className="h-6 object-contain" />
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="w-5 h-5 accent-[#DB4444]"
              />
              <span className="font-medium">Cash on delivery</span>
            </label>
          </div>

          <form onSubmit={handleApplyCoupon} className="flex gap-4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border border-black rounded px-4 py-3 outline-none focus:border-[#DB4444] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-8 py-3 rounded font-medium transition-colors"
            >
              Apply Coupon
            </button>
          </form>
          {couponError && <p className="text-[#DB4444] font-medium text-sm mt-[-10px]">{couponError}</p>}
          {couponSuccess && <p className="text-green-600 font-medium text-sm mt-[-10px]">{couponSuccess}</p>}

          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className="bg-[#DB4444] hover:bg-[#c23b3b] text-white py-4 rounded font-medium transition-colors w-full text-center"
          >
            Place Order
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            ref={modalRef}
            tabIndex={-1}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-scale-up outline-none"
          >
            <CheckCircle size={70} className="text-green-500 animate-bounce" />
            <h2 className="text-2xl font-bold text-black">Order Placed Successfully!</h2>
            <p className="text-gray-600 leading-relaxed">
              Thank you for your purchase. We have received your order and are processing it.
              Our manager will contact you shortly to confirm the details.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
              className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-10 py-3 rounded font-medium transition-colors w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
