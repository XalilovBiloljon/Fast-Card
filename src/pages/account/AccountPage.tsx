import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Схема валидации (Адрес больше не обязателен, чтобы не блокировать форму)
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string(),
  currentPassword: Yup.string(),
  newPassword: Yup.string(),
  confirmNewPassword: Yup.string().when('newPassword', {
    is: (val: string) => val && val.length > 0,
    then: (schema) => schema.required('Please confirm your new password').oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function AccountPage() {
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Твой реальный ID (пока захардкодим для надежности)
  const USER_ID = 'ee81dbfe-739a-41b3-a79b-6c5a64a5ce24';
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Загрузка данных при открытии страницы
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token'); 
        
        if (!token) {
          console.warn("Нет токена! Запрос может упасть с 401.");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/UserProfile/get-user-profile-by-id?id=${USER_ID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profile = response.data.data;

        setUserData({
          firstName: profile.firstName || '', 
          lastName: profile.lastName || '',
          email: profile.email || '', 
          address: '', // Адреса нет в ответе API, оставляем пустым
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });

      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-10 font-poppins relative">
      
      {/* Toast успешного сохранения */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[999] bg-green-500 text-white px-8 py-4 rounded-md shadow-lg animate-bounce">
          <p className="font-medium text-lg">Profile Updated Successfully! 🎉</p>
        </div>
      )}

      {/* Хлебные крошки */}
      <div className="flex justify-between items-center mb-10">
        <div className="text-gray-500 text-sm">
          Home <span className="mx-2">/</span> <span className="text-black font-medium">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-[#DB4444] font-medium">{userData.firstName || 'User'}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* ================= САЙДБАР (С Рабочей Навигацией) ================= */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Manage My Account</h3>
            <ul className="space-y-2 pl-4">
              <li className="text-[#DB4444] font-medium cursor-pointer">My Profile</li>
              <li className="text-gray-500 hover:text-black cursor-pointer transition">Address Book</li>
              <li className="text-gray-500 hover:text-black cursor-pointer transition">My Payment Options</li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">My Orders</h3>
            <ul className="space-y-2 pl-4">
              {/* РАБОЧАЯ ССЫЛКА НА CHECKOUT */}
              <li 
                onClick={() => navigate('/checkout')}
                className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition font-medium"
              >
                Go to Checkout
              </li>
              <li className="text-gray-500 hover:text-black cursor-pointer transition">My Returns</li>
              <li className="text-gray-500 hover:text-black cursor-pointer transition">My Cancellations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">My WishList</h3>
            <ul className="space-y-2 pl-4">
               {/* РАБОЧАЯ ССЫЛКА НА WISHLIST */}
              <li 
                onClick={() => navigate('/wishlist')}
                className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition font-medium"
              >
                Go to Wishlist
              </li>
            </ul>
          </div>
        </aside>

        {/* ================= ФОРМА ================= */}
        <div className="flex-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-md p-8 md:p-12">
          <h2 className="text-[#DB4444] text-xl font-medium mb-8">Edit Your Profile</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#DB4444] rounded-full animate-spin"></div>
            </div>
          ) : (
            <Formik
              enableReinitialize={true} 
              initialValues={userData}
              validationSchema={ProfileSchema}
              onSubmit={async (values, { setFieldValue, setFieldTouched }) => {
                try {
                  const token = localStorage.getItem('token');
                  
                  // РЕАЛЬНЫЙ ЗАПРОС НА СОХРАНЕНИЕ
                  await axios.put(`${import.meta.env.VITE_API_BASE_URL}/UserProfile/update-user-profile`, {
                    id: USER_ID,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: "",
                    dob: "0001-01-01"
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  });

                  // Если запрос прошел успешно:
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 3000);
                  
                  // Очищаем пароли
                  setFieldValue('currentPassword', '');
                  setFieldValue('newPassword', '');
                  setFieldValue('confirmNewPassword', '');
                  setFieldTouched('newPassword', false);
                  setFieldTouched('confirmNewPassword', false);

                } catch (error) {
                  console.error('Ошибка при сохранении:', error);
                  alert('Произошла ошибка при сохранении профиля!');
                }
              }}
            >
              {({ resetForm }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2">First Name</label>
                      <Field name="firstName" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Last Name</label>
                      <Field name="lastName" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email</label>
                      <Field name="email" type="email" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Address</label>
                      <Field name="address" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Password Changes</h3>
                    <div className="space-y-4">
                      <div>
                        <Field name="currentPassword" type="password" placeholder="Current Password" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      </div>
                      <div>
                        <Field name="newPassword" type="password" placeholder="New Password" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                      </div>
                      <div>
                        <Field name="confirmNewPassword" type="password" placeholder="Confirm New Password" className="w-full bg-[#F5F5F5] border-none rounded p-3 outline-none focus:ring-1 focus:ring-[#DB4444]" />
                        <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-6 pt-6">
                    <button type="button" onClick={() => resetForm()} className="text-black font-medium hover:text-[#DB4444] transition">
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-rose-600 transition font-medium">
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}