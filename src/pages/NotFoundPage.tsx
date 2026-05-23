import { useNavigate } from 'react-router-dom';

/*
  Компонент используется двумя способами:
  1. Как element для маршрута path="*" в React Router — рендерится при 404.
  2. Как FallbackComponent для <ErrorBoundary> — рендерится при JavaScript-ошибке во вложенных компонентах.
  В обоих случаях сигнатура компонента совместима: лишние пропсы из FallbackProps (error, resetErrorBoundary) игнорируются.
*/
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-32 min-h-[60vh] font-poppins">
      <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-wide">
        404 Not Found
      </h1>
      <p className="text-gray-500 text-sm md:text-base mb-12 max-w-md">
        Your visited page not found. You may go home page.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-16 py-4 rounded-md font-medium transition-colors"
      >
        Back to home page
      </button>
    </div>
  );
};
