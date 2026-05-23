import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  userName: Yup.string().min(2, 'Минимум 2 символа').required('Обязательное поле'),
  phoneNumber: Yup.string().required('Обязательное поле'),
  email: Yup.string().email('Некорректный email').required('Обязательное поле'),
  password: Yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли не совпадают')
    .required('Обязательное поле'),
});

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      userName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,

    /*
      Обработчик отправки формы регистрации.
      Отправляем POST на /Account/register с полным набором полей.
      При успехе показываем уведомление "Успешно!" и редиректим на /login.
      При ошибке — выводим сообщение от сервера или дефолтное сообщение.
    */
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Account/register`, {
          userName: values.userName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        setSuccessMessage('Успешно! Перенаправляем...');
        setTimeout(() => navigate('/login'), 1500);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        const msg = err.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.';
        setServerError(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fields = [
    { id: 'userName', label: 'Name', type: 'text' },
    { id: 'phoneNumber', label: 'Phone number', type: 'text' },
    { id: 'email', label: 'Email or phone number', type: 'email' },
    { id: 'password', label: 'Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20 font-poppins">
      <div className="w-full max-w-[370px]">
        <h1 className="text-3xl font-medium mb-2">Create an account</h1>
        <p className="text-sm text-gray-600 mb-8">Enter your details below</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-md text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-[#DB4444] text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-7">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.label}
                value={formik.values[field.id]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm bg-transparent placeholder:text-gray-400 transition-colors"
              />
              {formik.touched[field.id] && formik.errors[field.id] && (
                <span className="text-xs text-[#DB4444]">{formik.errors[field.id]}</span>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#DB4444] hover:bg-[#c23b3b] text-white py-4 rounded-md font-medium transition-colors disabled:opacity-60"
          >
            {formik.isSubmitting ? 'Loading...' : 'Create Account'}
          </button>

          <button
            type="button"
            className="w-full border border-gray-300 text-sm py-4 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path d="M43.6 20.5H42V20.4H24V27.6H35.3C33.7 32 29.3 35 24 35C17.4 35 12 29.6 12 23C12 16.4 17.4 11 24 11C27 11 29.7 12.1 31.8 14L36.9 8.9C33.5 5.8 29 4 24 4C13.5 4 5 12.5 5 23C5 33.5 13.5 42 24 42C34.5 42 43 33.5 43 23C43 22.1 42.9 21.3 43.6 20.5Z" fill="#FFC107"/>
              <path d="M6.3 13.7L12.3 18C14 13.5 18.6 10 24 10C27 10 29.7 11.1 31.8 13L36.9 7.9C33.5 4.8 29 3 24 3C16.3 3 9.6 7.3 6.3 13.7Z" fill="#FF3D00"/>
              <path d="M24 44C29 44 33.5 42.2 36.9 39.3L31.3 34.7C29 36.5 26.1 37.5 24 37.5C18.8 37.5 14.4 34.5 12.7 30L6.6 35.2C9.9 41.4 16.4 44 24 44Z" fill="#4CAF50"/>
              <path d="M43.6 20.5H42V20.4H24V27.6H35.3C34.5 30 33 32 31.3 33.6L31.3 33.6L36.9 38.2C36.5 38.6 43 34 43 24C43 22.8 42.9 21.6 43.6 20.5Z" fill="#1976D2"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-medium underline hover:text-[#DB4444] transition-colors">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
