import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../shared/store/authSlice';

const validationSchema = Yup.object({
  userName: Yup.string().required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { userName: '', password: '' },
    validationSchema,

    /*
      Обработчик отправки формы логина.
      Пересобираем payload явно перед отправкой — это гарантирует, что
      в тело запроса попадут строго поля { userName, password } без лишних
      метаданных Formik. Именно такой контракт ожидает сервер (иначе 400).
      При успехе сохраняем токен в localStorage и обновляем глобальный стейт.
    */
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const payload = {
          userName: values.userName,
          password: values.password,
        };

        // Дебаг: смотрим точно что уходит на сервер
        console.log('Sending payload:', payload);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/Account/login`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        const token = response.data?.data?.token || response.data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        dispatch(login(token));
        navigate('/');
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        console.error('Status:', err.response?.status);

        // Извлекаем читаемое сообщение: сервер может вернуть строку, массив или объект
        const responseData = err.response?.data;
        const serverMsg =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message
            || responseData?.title
            || (Array.isArray(responseData?.errors)
                ? responseData.errors.join(', ')
                : null)
            || JSON.stringify(responseData);

        setServerError(serverMsg || 'Что-то пошло не так. Попробуйте позже.');
      } finally {
        setSubmitting(false);
      }
    },

  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20 font-poppins">
      <div className="w-full max-w-[370px]">
        <h1 className="text-3xl font-medium mb-2">Log in to Exclusive</h1>
        <p className="text-sm text-gray-600 mb-8">Enter your details below</p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <input
              id="userName"
              name="userName"
              type="text"
              placeholder="Enter your User Name"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm bg-transparent placeholder:text-gray-400 transition-colors"
            />
            {formik.touched.userName && formik.errors.userName && (
              <span className="text-xs text-[#DB4444]">{formik.errors.userName}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm bg-transparent placeholder:text-gray-400 transition-colors pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-xs text-[#DB4444]">{formik.errors.password}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {serverError ? (
              <span className="text-xs text-[#DB4444] max-w-[200px]">{serverError}</span>
            ) : (
              <span />
            )}
            <button type="button" className="text-sm text-[#DB4444] hover:underline ml-auto">
              Forget Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#DB4444] hover:bg-[#c23b3b] text-white py-4 rounded-md font-medium transition-colors disabled:opacity-60"
          >
            {formik.isSubmitting ? 'Loading...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#DB4444] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
